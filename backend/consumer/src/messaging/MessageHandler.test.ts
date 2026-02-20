import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Channel, ConsumeMessage } from 'amqplib';
import { MessageHandler } from './MessageHandler';
import type { IIncidentRepository } from '../repositories/IIncidentRepository';
import type { ILogger } from '../utils/ILogger';
import { IncidentType, Priority, IncidentStatus } from '../types';

// --- Helpers ---

const createMockChannel = (): Channel =>
    ({
        ack: vi.fn(),
        nack: vi.fn(),
    }) as unknown as Channel;

const createMockRepository = (): IIncidentRepository => ({
    save: vi.fn((incident) => Promise.resolve(incident)),
});

const silentLogger: ILogger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
};

const buildMessage = (
    content: Record<string, unknown>,
    headers: Record<string, unknown> = {}
): ConsumeMessage =>
    ({
        content: Buffer.from(JSON.stringify(content)),
        properties: {
            correlationId: 'test-correlation-id',
            headers,
        },
        fields: {},
    }) as unknown as ConsumeMessage;

const validPayload = {
    ticketId: 'ticket-001',
    lineNumber: '0991234567',
    email: 'test@example.com',
    type: IncidentType.NO_SERVICE,
    description: 'Sin servicio en la zona',
    createdAt: '2026-02-13T10:00:00Z',
};

// --- Tests ---

describe('MessageHandler', () => {
    let channel: Channel;
    let repository: IIncidentRepository;
    let handler: MessageHandler;

    beforeEach(() => {
        vi.clearAllMocks();
        channel = createMockChannel();
        repository = createMockRepository();
        handler = new MessageHandler(channel, repository, silentLogger);
    });

    // --- Null message ---

    it('ignora mensajes nulos sin hacer ack ni nack', async () => {
        await handler.handle(null);

        expect(channel.ack).not.toHaveBeenCalled();
        expect(channel.nack).not.toHaveBeenCalled();
    });

    // --- Successful processing ---

    it('procesa mensaje válido: persiste, hace ack', async () => {
        const msg = buildMessage(validPayload);

        await handler.handle(msg);

        expect(repository.save).toHaveBeenCalledOnce();
        expect(repository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                ticketId: 'ticket-001',
                type: IncidentType.NO_SERVICE,
                priority: Priority.HIGH,
                status: IncidentStatus.IN_PROGRESS,
            })
        );
        expect(channel.ack).toHaveBeenCalledWith(msg);
        expect(channel.nack).not.toHaveBeenCalled();
    });

    it('asigna prioridad PENDING y status RECEIVED para tipo OTHER con descripción', async () => {
        const msg = buildMessage({
            ...validPayload,
            type: IncidentType.OTHER,
            description: 'Algo diferente',
        });

        await handler.handle(msg);

        expect(repository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                priority: Priority.PENDING,
                status: IncidentStatus.RECEIVED,
            })
        );
        expect(channel.ack).toHaveBeenCalledWith(msg);
    });

    // --- Invalid structure → DLQ ---

    it('rechaza mensaje sin campo type (nack sin requeue → DLQ)', async () => {
        const msg = buildMessage({
            ticketId: 'ticket-002',
            lineNumber: '099',
            description: 'test',
            createdAt: '2026-01-01',
        });

        await handler.handle(msg);

        expect(channel.nack).toHaveBeenCalledWith(msg, false, false);
        expect(channel.ack).not.toHaveBeenCalled();
        expect(repository.save).not.toHaveBeenCalled();
    });

    it('rechaza mensaje con type inválido (nack sin requeue → DLQ)', async () => {
        const msg = buildMessage({
            ...validPayload,
            type: 'INVALID_TYPE',
        });

        await handler.handle(msg);

        expect(channel.nack).toHaveBeenCalledWith(msg, false, false);
        expect(repository.save).not.toHaveBeenCalled();
    });

    it('rechaza mensaje OTHER sin descripción (nack sin requeue → DLQ)', async () => {
        const msg = buildMessage({
            ...validPayload,
            type: IncidentType.OTHER,
            description: undefined,
        });

        await handler.handle(msg);

        expect(channel.nack).toHaveBeenCalledWith(msg, false, false);
        expect(repository.save).not.toHaveBeenCalled();
    });

    // --- JSON parse error → retry ---

    it('reintenta mensaje con JSON inválido si retry < MAX_RETRIES', async () => {
        const msg = {
            content: Buffer.from('not-json'),
            properties: { correlationId: 'c1', headers: {} },
            fields: {},
        } as unknown as ConsumeMessage;

        await handler.handle(msg);

        // Should requeue (3rd arg = true) since retryCount is 0 < 3
        expect(channel.nack).toHaveBeenCalledWith(msg, false, true);
        expect(channel.ack).not.toHaveBeenCalled();
    });

    it('envía a DLQ si retry >= MAX_RETRIES (JSON inválido)', async () => {
        const msg = {
            content: Buffer.from('not-json'),
            properties: {
                correlationId: 'c2',
                headers: {
                    'x-death': [{ count: 3 }],
                },
            },
            fields: {},
        } as unknown as ConsumeMessage;

        await handler.handle(msg);

        // Should NOT requeue (3rd arg = false) → DLQ
        expect(channel.nack).toHaveBeenCalledWith(msg, false, false);
    });

    // --- Retry count extraction ---

    it('extrae retry count desde x-death header (múltiples entradas)', async () => {
        const msg = {
            content: Buffer.from('bad'),
            properties: {
                correlationId: 'c3',
                headers: {
                    'x-death': [{ count: 1 }, { count: 1 }],
                },
            },
            fields: {},
        } as unknown as ConsumeMessage;

        await handler.handle(msg);

        // Total count = 2, which is < 3 → requeue
        expect(channel.nack).toHaveBeenCalledWith(msg, false, true);
    });

    it('usa x-retry-count como fallback cuando no hay x-death', async () => {
        const msg = {
            content: Buffer.from('bad'),
            properties: {
                correlationId: 'c4',
                headers: { 'x-retry-count': 5 },
            },
            fields: {},
        } as unknown as ConsumeMessage;

        await handler.handle(msg);

        // count = 5 >= 3 → DLQ
        expect(channel.nack).toHaveBeenCalledWith(msg, false, false);
    });

    // --- Repository error → retry ---

    it('reintenta si el repositorio lanza error', async () => {
        const failRepo: IIncidentRepository = {
            save: vi.fn(async () => { throw new Error('DB error'); }),
        };
        const failHandler = new MessageHandler(channel, failRepo, silentLogger);

        const msg = buildMessage(validPayload);
        await failHandler.handle(msg);

        expect(channel.nack).toHaveBeenCalledWith(msg, false, true);
        expect(channel.ack).not.toHaveBeenCalled();
    });

    // --- correlationId missing ---

    it('maneja mensaje sin correlationId (usa "unknown")', async () => {
        const msg = {
            content: Buffer.from(JSON.stringify(validPayload)),
            properties: { headers: {} },
            fields: {},
        } as unknown as ConsumeMessage;

        await handler.handle(msg);

        expect(channel.ack).toHaveBeenCalled();
        expect(silentLogger.info).toHaveBeenCalledWith(
            'Message received',
            expect.objectContaining({ correlationId: 'unknown' })
        );
    });
});
