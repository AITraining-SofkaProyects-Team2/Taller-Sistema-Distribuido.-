import { Incident } from '../types';
import type { IIncidentRepository } from './IIncidentRepository';
import { logger } from '../utils/logger';

/**
 * In-memory implementation of {@link IIncidentRepository}.
 *
 * Stores incidents in a `Map<ticketId, Incident>` for fast O(1) lookups.
 * Data is **not** persisted across process restarts — suitable for
 * development, testing, and lightweight deployments.
 *
 * **Thread safety**: Node.js is single-threaded, so no locking is required.
 * If the Consumer were scaled to multiple workers with shared state,
 * a database-backed repository would be needed.
 *
 * @class InMemoryIncidentRepository
 * @implements {IIncidentRepository}
 */
export class InMemoryIncidentRepository implements IIncidentRepository {
    /** Internal store keyed by `ticketId`. */
    private readonly incidents: Map<string, Incident> = new Map();

    /**
     * Saves (or overwrites) an incident by its `ticketId`.
     *
     * @param {Incident} incident - The incident to persist.
     * @returns {Incident} The same incident reference that was stored.
     */
    save(incident: Incident): Incident {
        this.incidents.set(incident.ticketId, incident);
        logger.debug('Incident persisted', { ticketId: incident.ticketId });
        return incident;
    }
}

