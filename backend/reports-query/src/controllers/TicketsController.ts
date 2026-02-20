import { Request, Response } from 'express';
import { TicketQueryService } from '../services/TicketQueryService';
import { TicketStatus, TicketPriority } from '../types';

export class TicketsController {
    constructor(private queryService: TicketQueryService) { }

    async getTickets(req: Request, res: Response) {
        try {
            const { status, priority, page, limit } = req.query;

            // Validation
            const validStatuses = Object.values(TicketStatus) as string[];
            const validPriorities = Object.values(TicketPriority) as string[];

            let statusFilter: TicketStatus[] | undefined;
            if (status) {
                const statuses = Array.isArray(status) ? status : [status];
                for (const s of statuses) {
                    if (typeof s !== 'string' || !validStatuses.includes(s)) {
                        return res.status(400).json({
                            message: `"${s}" no es un estado válido`,
                            validValues: validStatuses
                        });
                    }
                }
                statusFilter = statuses as TicketStatus[];
            }

            let priorityFilter: TicketPriority | undefined;
            if (priority) {
                if (typeof priority !== 'string' || !validPriorities.includes(priority)) {
                    return res.status(400).json({
                        message: `"${priority}" no es una prioridad válida`,
                        validValues: validPriorities
                    });
                }
                priorityFilter = priority as TicketPriority;
            }

            const result = await this.queryService.getTickets({
                status: statusFilter,
                priority: priorityFilter,
                page: page ? parseInt(page as string) : 1,
                limit: limit ? parseInt(limit as string) : 20
            });

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
