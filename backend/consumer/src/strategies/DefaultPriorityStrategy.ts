import { IncidentType, Priority } from '../types';
import type { IPriorityStrategy } from './IPriorityStrategy';

/**
 * Fallback strategy for uncategorized or unrecognized incident types.
 *
 * Handles {@link IncidentType.OTHER} and serves as the fallback for any
 * incident type not explicitly mapped to a concrete strategy in
 * {@link PriorityResolver}.
 *
 * **Business rule**: Incidents of type OTHER require manual triage
 * (they must include a `description` field). Until triaged, their
 * priority remains {@link Priority.PENDING}.
 *
 * @class DefaultPriorityStrategy
 * @implements {IPriorityStrategy}
 * @see {@link PriorityResolver} — Uses this as the fallback strategy.
 */
export class DefaultPriorityStrategy implements IPriorityStrategy {
    /** @inheritdoc */
    readonly supportedTypes = [IncidentType.OTHER];

    /**
     * Returns {@link Priority.PENDING} so the incident awaits manual triage.
     *
     * @param {IncidentType} _type - The incident type (unused; always returns PENDING).
     * @returns {Priority} Always {@link Priority.PENDING}.
     */
    calculate(_type: IncidentType): Priority {
        return Priority.PENDING;
    }
}
