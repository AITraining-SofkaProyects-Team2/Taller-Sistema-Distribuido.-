import { IncidentType, Priority } from '../types';
import type { IPriorityStrategy } from './IPriorityStrategy';

/**
 * Strategy for minor issues that do not directly impact internet connectivity.
 *
 * Handles:
 * - {@link IncidentType.ROUTER_ISSUE} — Customer-premises equipment problems.
 * - {@link IncidentType.BILLING_QUESTION} — Account or billing inquiries.
 *
 * **Business rule**: These incidents are non-urgent and can be handled during
 * normal support windows. They receive {@link Priority.LOW} to keep the queue
 * focused on service-affecting issues first.
 *
 * @class MinorIssuesStrategy
 * @implements {IPriorityStrategy}
 * @see {@link PriorityResolver} — Context that delegates to this strategy.
 */
export class MinorIssuesStrategy implements IPriorityStrategy {
    /** @inheritdoc */
    readonly supportedTypes = [
        IncidentType.ROUTER_ISSUE,
        IncidentType.BILLING_QUESTION,
    ];

    /**
     * Always returns {@link Priority.LOW} for minor / non-service issues.
     *
     * @param {IncidentType} _type - The incident type (unused; all supported types map to LOW).
     * @returns {Priority} Always {@link Priority.LOW}.
     */
    calculate(_type: IncidentType): Priority {
        return Priority.LOW;
    }
}
