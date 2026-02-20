import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryIncidentRepository } from './InMemoryIncidentRepository';
import { IncidentType, Priority, IncidentStatus, Incident } from '../types';

const buildIncident = (overrides?: Partial<Incident>): Incident => ({
    ticketId: 'ticket-001',
    lineNumber: '0991234567',
    type: IncidentType.NO_SERVICE,
    description: 'Sin servicio',
    priority: Priority.HIGH,
    status: IncidentStatus.IN_PROGRESS,
    createdAt: '2026-02-13T10:00:00Z',
    processedAt: new Date(),
    ...overrides,
});

describe('InMemoryIncidentRepository', () => {
    let repo: InMemoryIncidentRepository;

    beforeEach(() => {
        repo = new InMemoryIncidentRepository();
    });

    it('guarda un incidente y lo retorna', async () => {
        const incident = buildIncident();
        const saved = await repo.save(incident);

        expect(saved).toEqual(incident);
    });

    it('permite guardar múltiples incidentes', async () => {
        const i1 = buildIncident({ ticketId: 'ticket-001' });
        const i2 = buildIncident({ ticketId: 'ticket-002' });

        await repo.save(i1);
        await repo.save(i2);

        // Both should save without error (no exception thrown)
        expect(await repo.save(buildIncident({ ticketId: 'ticket-003' }))).toBeDefined();
    });

    it('sobrescribe un incidente con el mismo ticketId', async () => {
        const original = buildIncident({ priority: Priority.LOW });
        const updated = buildIncident({ priority: Priority.HIGH });

        await repo.save(original);
        const result = await repo.save(updated);

        expect(result.priority).toBe(Priority.HIGH);
    });
});
