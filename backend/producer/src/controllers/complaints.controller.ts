import { Request, Response, NextFunction } from 'express';
import { complaintsService } from '../services/complaints.service.js';
import { logger } from '../utils/logger.js';

/**
 * Thin controller for complaint operations.
 *
 * Follows the project convention of "thin controllers" — contains **no**
 * business logic. Input validation is handled by the `validateComplaintRequest`
 * middleware; business logic lives in `complaintsService`.
 *
 * All errors are forwarded to `next()` for centralized handling by the
 * error handler chain (Chain of Responsibility).
 *
 * @namespace complaintsController
 */
export const complaintsController = {
  /**
   * Handles `POST /complaints` — creates a new complaint ticket.
   *
   * Steps:
   * 1. Extracts validated fields from `req.body`.
   * 2. Delegates ticket creation and publishing to `complaintsService.createTicket`.
   * 3. Returns 201 with the created ticket.
   *
   * @param {Request} req - Express request with validated body.
   * @param {Response} res - Express response.
   * @param {NextFunction} next - Error forwarding to the Chain of Responsibility.
   * @returns {Promise<void>}
   */
  createComplaint: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Extract only the fields needed — ISP §3.4
      const { lineNumber, email, incidentType, description } = req.body;

      logger.debug('Received create complaint request', {
        lineNumber,
        incidentType,
      });

      const ticket = await complaintsService.createTicket({
        lineNumber,
        email,
        incidentType,
        description,
      });

      res.status(201).json(ticket);
    } catch (error) {
      next(error);
    }
  },
};
