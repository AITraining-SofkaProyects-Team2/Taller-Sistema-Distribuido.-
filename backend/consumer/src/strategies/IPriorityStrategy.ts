import { IncidentType, Priority } from '../types';

/**
 * Strategy interface for priority calculation (Strategy Pattern).
 *
 * Each implementation handles a specific subset of {@link IncidentType} values
 * and maps them to a {@link Priority}. The {@link PriorityResolver} acts as the
 * context that selects and delegates to the correct strategy.
 *
 * @interface IPriorityStrategy
 * @see {@link PriorityResolver} — Context class that orchestrates strategy selection.
 *
 * @example
 * ```typescript
 * class MyCustomStrategy implements IPriorityStrategy {
 *   readonly supportedTypes = [IncidentType.NO_SERVICE];
 *   calculate(_type: IncidentType): Priority {
 *     return Priority.HIGH;
 *   }
 * }
 * ```
 */
export interface IPriorityStrategy {
    /**
     * The incident types this strategy is responsible for.
     * Used by {@link PriorityResolver} to build the type-to-strategy mapping.
     * @readonly
     */
    readonly supportedTypes: IncidentType[];

    /**
     * Calculates the priority for the given incident type.
     *
     * @param {IncidentType} type - The type of incident to evaluate.
     * @returns {Priority} The resolved priority level.
     */
    calculate(type: IncidentType): Priority;
}
