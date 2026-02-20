import { Request, Response } from 'express';
import { TicketQueryService } from '../services/TicketQueryService';
import { TicketFilters } from '../types';

export class TicketsController {
  constructor(private readonly queryService: TicketQueryService) {}

  async getTickets(req: Request, res: Response): Promise<void> {
    try {
      const { status, priority, type, dateFrom, dateTo, page = '1', limit = '20' } = req.query;
      const filters: TicketFilters = {
        status: status as TicketFilters['status'],
        priority: priority as TicketFilters['priority'],
        type: type as TicketFilters['type'],
        dateFrom: dateFrom as string | undefined,
        dateTo: dateTo as string | undefined,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
      };
      const result = await this.queryService.getTickets(filters);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}