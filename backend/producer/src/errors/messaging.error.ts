import { HttpError } from './http.error.js';

/**
 * Thrown when the messaging broker is unavailable or rejects a publish.
 *
 * Automatically handled by `messagingErrorHandler` in the error handler chain,
 * returning HTTP 503 (Service Unavailable) to the client.
 *
 * @class MessagingError
 * @extends {HttpError}
 */
export class MessagingError extends HttpError {
    /**
     * @param {string} message - Description of the messaging failure.
     * @param {string} [ticketId] - The ticket ID that failed to publish (for logging/tracing).
     */
    constructor(message: string, public readonly ticketId?: string) {
        super(message, 503);
        this.name = 'MessagingError';
    }
}
