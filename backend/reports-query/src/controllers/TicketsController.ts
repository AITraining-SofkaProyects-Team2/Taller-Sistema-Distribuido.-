import { Request, Response } from 'express';
import { TicketQueryService } from '../services/TicketQueryService';
import { TicketStatus, TicketPriority, IncidentType } from '../types';

// Valores válidos para cada tipo
const VALID_STATUSES: TicketStatus[] = ['RECEIVED', 'IN_PROGRESS'];
const VALID_PRIORITIES: TicketPriority[] = ['HIGH', 'MEDIUM', 'LOW', 'PENDING'];
const VALID_INCIDENT_TYPES: IncidentType[] = [
  'NO_SERVICE',
  'INTERMITTENT_SERVICE',
  'SLOW_CONNECTION',
  'ROUTER_ISSUE',
  'BILLING_QUESTION',
  'OTHER'
];

export class TicketsController {
    constructor(private queryService: TicketQueryService) { }

    async getTickets(req: Request, res: Response) {
        try {
            const { status, priority, incidentType, dateFrom, dateTo, page, limit } = req.query;

            // Validation
            const validStatuses = VALID_STATUSES;
            const validPriorities = VALID_PRIORITIES;
            const validIncidentTypes = VALID_INCIDENT_TYPES;

            let statusFilter: TicketStatus[] | undefined;
            if (status) {
                const statuses = Array.isArray(status) ? status : [status];
                for (const s of statuses) {
                    if (typeof s !== 'string' || !validStatuses.includes(s as TicketStatus)) {
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
                if (typeof priority !== 'string' || !validPriorities.includes(priority as TicketPriority)) {
                    return res.status(400).json({
                        message: `"${priority}" no es una prioridad válida`,
                        validValues: validPriorities
                    });
                }
                priorityFilter = priority as TicketPriority;
            }

            let typeFilter: IncidentType | undefined;
            if (incidentType) {
                if (typeof incidentType !== 'string' || !validIncidentTypes.includes(incidentType as IncidentType)) {
                    return res.status(400).json({
                        error: 'Bad Request',
                        message: `El tipo de incidente no es válido: ${incidentType}`,
                        validValues: validIncidentTypes
                    });
                }
                typeFilter = incidentType as IncidentType;
            }

            // Date validation
            const isISO = (str: any) => {
                if (!str || typeof str !== 'string') return false;
                const d = new Date(str);
                return !isNaN(d.valueOf()) && (str.includes('T') || /^\d{4}-\d{2}-\d{2}$/.test(str));
            };

            if (dateFrom && !isISO(dateFrom)) {
                return res.status(400).json({ error: 'Formato de fecha de inicio inválido' });
            }
            if (dateTo && !isISO(dateTo)) {
                return res.status(400).json({ error: 'Formato de fecha de fin inválido' });
            }

            if (dateFrom && dateTo) {
                if (new Date(dateFrom as string) > new Date(dateTo as string)) {
                    return res.status(400).json({ error: 'dateTo debe ser mayor o igual a dateFrom' });
                }
            }

            const result = await this.queryService.getTickets({
                status: statusFilter,
                priority: priorityFilter,
                type: typeFilter,
                dateFrom: dateFrom as string,
                dateTo: dateTo as string,
                page: page ? parseInt(page as string) : 1,
                limit: limit ? parseInt(limit as string) : 20
            });

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
