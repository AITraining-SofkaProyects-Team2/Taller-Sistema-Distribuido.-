import { Incident } from '../types';

/**
 * Repository abstraction for persisting processed incidents (DIP).
 *
 * Decouples the {@link MessageHandler} from the storage implementation,
 * allowing easy substitution (e.g., in-memory for development,
 * database-backed for production).
 *
 * @interface IIncidentRepository
 * @see {@link InMemoryIncidentRepository} — Default implementation.
 */
export interface IIncidentRepository {
    /**
     * Persists or updates an incident in the underlying store.
     *
     * @param {Incident} incident - The fully processed incident to save.
     * @returns {Incident} The persisted incident (may include generated fields).
     */
    save(incident: Incident): Promise<Incident>;
}
