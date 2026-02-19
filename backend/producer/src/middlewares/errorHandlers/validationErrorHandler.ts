import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../errors/validation.error.js';

/**
 * Chain-of-Responsibility handler for {@link ValidationError}.
 *
 * If the error is an instance of `ValidationError`, responds with HTTP 400
 * and the validation message. Otherwise, delegates to the next handler.
 *
 * **Position in chain**: First — catches the most common client errors early.
 *
 * @param {Error} err - The error to inspect.
 * @param {Request} _req - Express request (unused).
 * @param {Response} res - Express response.
 * @param {NextFunction} next - Passes the error to the next handler if not handled.
 */
export const validationErrorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof ValidationError) {
        res.status(400).json({
            error: 'Validation Error',
            details: err.message,
        });
        return;
    }
    next(err);
};
