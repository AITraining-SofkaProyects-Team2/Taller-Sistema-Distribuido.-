import { Request, Response, NextFunction } from 'express';
import { MessagingError } from '../../errors/messaging.error.js';
import { logger } from '../../utils/logger.js';

/**
 * Chain-of-Responsibility handler for {@link MessagingError}.
 *
 * If the error is an instance of `MessagingError`, logs the failure with
 * the associated `ticketId` and responds with HTTP 503 (Service Unavailable).
 * Otherwise, delegates to the next handler.
 *
 * **Position in chain**: Third — after client-side errors, before the generic HTTP handler.
 *
 * @param {Error} err - The error to inspect.
 * @param {Request} _req - Express request (unused).
 * @param {Response} res - Express response.
 * @param {NextFunction} next - Passes the error to the next handler if not handled.
 */
export const messagingErrorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof MessagingError) {
        logger.error('Messaging error', {
            ticketId: err.ticketId,
            message: err.message,
        });
        res.status(503).json({
            error: 'Service Unavailable',
            details: 'The messaging service is temporarily unavailable',
        });
        return;
    }
    next(err);
};
