import type { ILogger } from './ILogger';

/** Supported severity levels for log output. */
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

/**
 * Formats a log entry into a human-readable string with ISO timestamp.
 *
 * Output format: `[2026-02-18T12:00:00.000Z] [INFO] Some message {"key":"val"}`
 *
 * @param {LogLevel} level - Severity level prefix.
 * @param {string} message - The log message body.
 * @param {Record<string, unknown>} [context] - Optional structured metadata appended as JSON.
 * @returns {string} The formatted log line.
 */
const formatMessage = (
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
): string => {
    const timestamp = new Date().toISOString();
    const ctx = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}] ${message}${ctx}`;
};

/**
 * Default console-based logger implementing {@link ILogger}.
 *
 * - `info`, `warn`, `error` always output.
 * - `debug` only outputs when `NODE_ENV === 'development'`.
 *
 * @type {ILogger}
 */
export const logger: ILogger = {
    info: (message: string, context?: Record<string, unknown>): void => {
        console.log(formatMessage('INFO', message, context));
    },
    warn: (message: string, context?: Record<string, unknown>): void => {
        console.warn(formatMessage('WARN', message, context));
    },
    error: (message: string, context?: Record<string, unknown>): void => {
        console.error(formatMessage('ERROR', message, context));
    },
    debug: (message: string, context?: Record<string, unknown>): void => {
        if (process.env.NODE_ENV === 'development') {
            console.log(formatMessage('DEBUG', message, context));
        }
    },
};
