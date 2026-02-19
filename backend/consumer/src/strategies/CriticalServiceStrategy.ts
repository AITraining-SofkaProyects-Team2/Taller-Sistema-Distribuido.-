import { IncidentType, Priority } from '../types';
import type { IPriorityStrategy } from './IPriorityStrategy';

/**
 * Strategy for critical service incidents that cause total loss of connectivity.
 *
 * Maps {@link IncidentType.NO_SERVICE} to {@link Priority.HIGH}.
 *
 * **Business rule**: A complete service outage is the most severe incident
 * and must always be assigned the highest priority for immediate attention.
 *
 * @class CriticalServiceStrategy
 * @implements {IPriorityStrategy}
 * @see {@link PriorityResolver} — Context that delegates to this strategy.
 */
export class CriticalServiceStrategy implements IPriorityStrategy {
    /** @inheritdoc */
    readonly supportedTypes = [IncidentType.NO_SERVICE];

    /**
     * Always returns {@link Priority.HIGH} regardless of input,
     * since all supported types are critical-severity incidents.
     *
     * @param {IncidentType} _type - The incident type (unused; always NO_SERVICE).
     * @returns {Priority} Always {@link Priority.HIGH}.
     */
    calculate(_type: IncidentType): Priority {
        return Priority.HIGH;
    }
}
