import { HttpError } from './http.error.js';

/**
 * Thrown when a complaint request fails input validation.
 *
 * Automatically handled by `validationErrorHandler` in the error handler chain,
 * returning HTTP 400 with the validation details.
 *
 * @class ValidationError
 * @extends {HttpError}
 */
export class ValidationError extends HttpError {
  /**
   * @param {string} message - Description of the validation failure.
   */
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}
