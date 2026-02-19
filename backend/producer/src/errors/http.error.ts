/**
 * Base HTTP error class with an embedded `statusCode`.
 *
 * All domain errors that map to HTTP responses should extend this class
 * (Open/Closed Principle — OCP §3.2). The generic `httpErrorHandler` middleware
 * can handle any `HttpError` subclass without modification.
 *
 * Hierarchy:
 * ```
 * Error
 *  └─ HttpError (base, abstract-ish)
 *      ├─ ValidationError  (400)
 *      └─ MessagingError   (503)
 * ```
 *
 * @class HttpError
 * @extends {Error}
 */
export class HttpError extends Error {
  /**
   * @param {string} message - Human-readable error description.
   * @param {number} statusCode - HTTP status code to return to the client.
   */
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = 'HttpError';
  }
}
