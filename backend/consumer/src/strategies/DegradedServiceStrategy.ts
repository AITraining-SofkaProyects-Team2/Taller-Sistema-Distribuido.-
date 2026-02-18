import { IncidentType, Priority } from '../types';
import type { IPriorityStrategy } from './IPriorityStrategy';

/**
 * Strategy for degraded-service incidents where connectivity exists but is impaired.
 *
 * Handles:
 * - {@link IncidentType.INTERMITTENT_SERVICE} — Connectivity drops in and out.
 * - {@link IncidentType.SLOW_CONNECTION} — Speed is significantly below contracted rate.
 *
 * **Business rule**: Degraded service impacts user experience but does not constitute
 * a total outage. These incidents receive {@link Priority.MEDIUM} for timely resolution
 * without preempting critical outages.
 *
 * @class DegradedServiceStrategy
 * @implements {IPriorityStrategy}
 * @see {@link PriorityResolver} — Context that delegates to this strategy.
 */
export class DegradedServiceStrategy implements IPriorityStrategy {
    /** @inheritdoc */
    readonly supportedTypes = [
        IncidentType.INTERMITTENT_SERVICE,
        IncidentType.SLOW_CONNECTION,
    ];

    /**
     * Always returns {@link Priority.MEDIUM} for degraded-service incidents.
     *
     * @param {IncidentType} _type - The incident type (unused; all supported types map to MEDIUM).
     * @returns {Priority} Always {@link Priority.MEDIUM}.
     */
    calculate(_type: IncidentType): Priority {
        return Priority.MEDIUM;
    }
}
