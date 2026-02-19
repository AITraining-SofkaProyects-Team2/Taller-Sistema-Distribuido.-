import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/validation.error.js';
import { IncidentType, CreateTicketRequest } from '../types/ticket.types.js';
import { isIncidentType } from '../utils/typeGuards.js';

/** Email format validation regex. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Express middleware that validates the request body for complaint creation.
 *
 * Enforces the following rules:
 * - `lineNumber` — required, must be a string.
 * - `email` — required, must be a valid email format.
 * - `incidentType` — required, must be a valid {@link IncidentType} enum value.
 * - `description` — **required only when** `incidentType === 'OTHER'`.
 *   For all other types, `description` may be absent, `null`, or empty.
 *
 * Throws {@link ValidationError} (HTTP 400) on the first validation failure.
 * Extracted from the service layer to respect SRP (§3.1).
 *
 * @param {Request} req - The incoming Express request.
 * @param {Response} _res - Express response (unused).
 * @param {NextFunction} next - Proceeds to the controller if valid.
 * @throws {ValidationError} On any validation failure.
 */
export const validateComplaintRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const request = req.body as CreateTicketRequest;

  if (!request.lineNumber || typeof request.lineNumber !== 'string') {
    throw new ValidationError('lineNumber is required and must be a string');
  }

  if (!request.email || typeof request.email !== 'string') {
    throw new ValidationError('email is required and must be a string');
  }

  if (!EMAIL_REGEX.test(request.email)) {
    throw new ValidationError('email must be a valid email address');
  }

  if (!request.incidentType || typeof request.incidentType !== 'string') {
    throw new ValidationError('incidentType is required and must be a string');
  }

  if (!isIncidentType(request.incidentType)) {
    throw new ValidationError(
      `incidentType must be one of: ${Object.values(IncidentType).join(', ')}`
    );
  }

  if (request.incidentType === IncidentType.OTHER && (!request.description || request.description.trim() === '')) {
    throw new ValidationError('description is required when incidentType is OTHER');
  }

  next();
};
