import { Router } from 'express';
import { TicketsController } from '../controllers/ticketsController';
import { TicketQueryService } from '../services/TicketQueryService';
import { TicketRepository } from '../repositories/TicketRepository';

const router = Router();
const repository = new TicketRepository();
const service = new TicketQueryService(repository);
const controller = new TicketsController(service);

router.get('/', (req, res) => controller.getTickets(req, res));

export default router;
