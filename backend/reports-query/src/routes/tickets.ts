import { Router } from 'express';
import { getTickets } from '../controllers/ticketsController';

const router = Router();

router.get('/', getTickets);

export default router;
