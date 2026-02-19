import { IncidentType, Priority, IncidentStatus } from './types';
import { PriorityResolver } from './strategies';

/**
 * Module-level {@link PriorityResolver} instance shared by all processing calls.
 * Instantiated once with default strategies; can be replaced in tests.
 */
const resolver = new PriorityResolver();

/**
 * Resolves the priority for a given incident type by delegating to
 * the {@link PriorityResolver} (Strategy Pattern).
 *
 * @param {IncidentType} type - The type of incident to evaluate.
 * @returns {Priority} The computed priority (HIGH, MEDIUM, LOW, or PENDING).
 *
 * @example
 * ```typescript
 * determinePriority(IncidentType.NO_SERVICE); // Priority.HIGH
 * determinePriority(IncidentType.OTHER);      // Priority.PENDING
 * ```
 */
export const determinePriority = (type: IncidentType): Priority => {
  return resolver.resolve(type);
};

/**
 * Determines the lifecycle status of an incident based on its resolved priority.
 *
 * - `PENDING` priority → {@link IncidentStatus.RECEIVED} (awaits manual triage).
 * - Any other priority → {@link IncidentStatus.IN_PROGRESS} (processing started).
 *
 * @param {Priority} priority - The priority resolved for the incident.
 * @returns {IncidentStatus} The resulting lifecycle status.
 *
 * @example
 * ```typescript
 * determineStatus(Priority.HIGH);    // IncidentStatus.IN_PROGRESS
 * determineStatus(Priority.PENDING); // IncidentStatus.RECEIVED
 * ```
 */
export const determineStatus = (priority: Priority): IncidentStatus => {
  return priority === Priority.PENDING
    ? IncidentStatus.RECEIVED
    : IncidentStatus.IN_PROGRESS;
};
