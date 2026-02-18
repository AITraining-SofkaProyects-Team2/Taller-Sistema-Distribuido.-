/**
 * Logger abstraction used throughout the Consumer (DIP).
 *
 * Allows the concrete logging implementation to be swapped
 * (e.g., console-based in dev, structured JSON in production,
 * or a silent stub in unit tests).
 *
 * @interface ILogger
 */
export interface ILogger {
  /**
   * Logs an informational message.
   * @param {string} message - Human-readable log message.
   * @param {Record<string, unknown>} [context] - Optional structured metadata.
   */
  info(message: string, context?: Record<string, unknown>): void;

  /**
   * Logs a warning (non-fatal but noteworthy condition).
   * @param {string} message - Human-readable log message.
   * @param {Record<string, unknown>} [context] - Optional structured metadata.
   */
  warn(message: string, context?: Record<string, unknown>): void;

  /**
   * Logs an error (operation failed or critical condition).
   * @param {string} message - Human-readable log message.
   * @param {Record<string, unknown>} [context] - Optional structured metadata.
   */
  error(message: string, context?: Record<string, unknown>): void;

  /**
   * Logs a debug message (only visible in development mode).
   * @param {string} message - Human-readable log message.
   * @param {Record<string, unknown>} [context] - Optional structured metadata.
   */
  debug(message: string, context?: Record<string, unknown>): void;
}
