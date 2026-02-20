
import { Request, Response } from 'express';
import { getPaginatedTickets } from '../services/ticketsService';

const MAX_LIMIT = 100;

export async function getTickets(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  let limit: number;
  if (req.query.limit === undefined) {
    limit = 20;
  } else {
    limit = Number(req.query.limit);
    if (
      isNaN(limit) ||
      !Number.isInteger(limit) ||
      limit <= 0 ||
      limit > MAX_LIMIT
    ) {
      return res.status(400).json({ error: 'El parámetro "limit" debe ser un entero entre 1 y 100.' });
    }
  }
  const sort = typeof req.query.sort === 'string' ? req.query.sort : undefined;
  const order = typeof req.query.order === 'string' ? req.query.order : undefined;
  const priority = typeof req.query.priority === 'string' ? req.query.priority : undefined;
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  const type = typeof req.query.type === 'string' ? req.query.type : undefined;
  try {
    const result = await getPaginatedTickets(page, limit, sort, order, priority, status, type);
    res.status(200).json(result);
  } catch (err: any) {
    if (err.status === 400) {
      return res.status(400).json({ error: err.message });
    }
    throw err;
  }
}
