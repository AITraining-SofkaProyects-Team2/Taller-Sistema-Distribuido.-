import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger.js';

/**
 * Terminal Chain-of-Responsibility handler — catches ALL unhandled errors.
 *
 * Logs the full error (name, message, stack) and returns HTTP 500
 * with a generic message. This handler **never** calls `next()` because
 * it is always the last in the chain.
 *
 * **Position in chain**: Last (terminal).
 *
 * @param {Error} err - The unhandled error.
 * @param {Request} _req - Express request (unused).
 * @param {Response} res - Express response.
 * @param {NextFunction} _next - Not called (terminal handler).
 */
export const defaultErrorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    logger.error('Unhandled error', {
        name: err.name,
        message: err.message,
        stack: err.stack,
    });
    res.status(500).json({
        error: 'Internal Server Error',
        details: 'An unexpected error occurred',
    });
};
