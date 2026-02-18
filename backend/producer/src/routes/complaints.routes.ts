import { Router } from 'express';
import { complaintsController } from '../controllers/complaints.controller.js';
import { validateComplaintRequest } from '../middlewares/validateComplaintRequest.js';

/**
 * Express router for complaint-related endpoints.
 *
 * Routes:
 * - `POST /` — Validate input via `validateComplaintRequest`,
 *   then delegate to `complaintsController.createComplaint`.
 *
 * Mounted at `/complaints` in [app.ts](../app.ts).
 */
const router = Router();

/** POST /complaints — Create a new complaint ticket. */
router.post('/', validateComplaintRequest, complaintsController.createComplaint);

export { router as complaintsRouter };
