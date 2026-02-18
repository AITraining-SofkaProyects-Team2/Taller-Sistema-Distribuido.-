import { Request, Response, NextFunction } from 'express';

/**
 * Chain-of-Responsibility handler for malformed JSON request bodies.
 *
 * Express's built-in `json()` parser throws a `SyntaxError` with a `body`
 * property when the request body is not valid JSON. This handler detects
 * that specific error pattern and returns HTTP 400.
 *
 * **Position in chain**: Second — after validation, before messaging errors.
 *
 * @param {Error} err - The error to inspect.
 * @param {Request} _req - Express request (unused).
 * @param {Response} res - Express response.
 * @param {NextFunction} next - Passes the error to the next handler if not handled.
 */
export const jsonSyntaxErrorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof SyntaxError && 'body' in err) {
        res.status(400).json({
            error: 'Invalid JSON',
            details: 'The request body contains invalid JSON',
        });
        return;
    }
    next(err);
};
