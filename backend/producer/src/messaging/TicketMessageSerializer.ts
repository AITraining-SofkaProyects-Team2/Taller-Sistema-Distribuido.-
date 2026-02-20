import type { Ticket, TicketEventPayload } from '../types/ticket.types.js';
import type { IMessageSerializer } from './IMessageSerializer.js';

/**
 * JSON serializer that converts a {@link Ticket} into a {@link TicketEventPayload}
 * Buffer for publishing to RabbitMQ.
 *
 * **Contract note**: The output shape (`TicketEventPayload`) is the contract
 * between Producer and Consumer. The Consumer's `MessageHandler` deserializes
 * this exact structure. Any field changes here **must** be mirrored on the
 * Consumer side and in E2E tests.
 *
 * Field mapping:
 * - `ticket.incidentType` → `payload.type` (Consumer uses `type`).
 * - `ticket.createdAt` → `payload.createdAt` (serialized as ISO-8601 string).
 *
 * @class TicketMessageSerializer
 * @implements {IMessageSerializer}
 */
export class TicketMessageSerializer implements IMessageSerializer {
    /**
     * Serializes a ticket into a JSON Buffer matching {@link TicketEventPayload}.
     *
     * @param {Ticket} ticket - The ticket to serialize.
     * @returns {Buffer} UTF-8 JSON buffer ready for AMQP publishing.
     */
    serializeTicketCreated(ticket: Ticket): Buffer {
        const payload: TicketEventPayload = {
            ticketId: ticket.ticketId,
            lineNumber: ticket.lineNumber,
            email: ticket.email,
            type: ticket.incidentType,
            description: ticket.description,
            createdAt: ticket.createdAt.toISOString(),
        };
        return Buffer.from(JSON.stringify(payload));
    }
}
