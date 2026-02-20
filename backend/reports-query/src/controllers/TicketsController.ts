import { Request, Response } from 'express';
import { TicketQueryService } from '../services/TicketQueryService';
import { TicketStatus, TicketPriority, IncidentType } from '../types';

// Type guards for validation
function isValidTicketStatus(value: string): value is TicketStatus {
    return ['RECEIVED', 'IN_PROGRESS'].includes(value);
}

function isValidTicketPriority(value: string): value is TicketPriority {
    return ['HIGH', 'MEDIUM', 'LOW', 'PENDING'].includes(value);
}

function isValidIncidentType(value: string): value is IncidentType {
    return ['NO_SERVICE', 'INTERMITTENT_SERVICE', 'SLOW_CONNECTION', 'ROUTER_ISSUE', 'BILLING_QUESTION', 'OTHER'].includes(value);
}

const VALID_STATUSES = ['RECEIVED', 'IN_PROGRESS'];
const VALID_PRIORITIES = ['HIGH', 'MEDIUM', 'LOW', 'PENDING'];
const VALID_INCIDENT_TYPES = [
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
                const validatedStatuses: TicketStatus[] = [];
                for (const s of statuses) {
                    if (typeof s !== 'string' || !isValidTicketStatus(s)) {
                        return res.status(400).json({
                            message: `"${s}" no es un estado válido`,
                            validValues: validStatuses
                        });
                    }
                    validatedStatuses.push(s);
                }
                statusFilter = validatedStatuses;
            }

            let priorityFilter: TicketPriority | undefined;
            if (priority) {
                if (typeof priority !== 'string' || !isValidTicketPriority(priority)) {
                    return res.status(400).json({
                        message: `"${priority}" no es una prioridad válida`,
                        validValues: validPriorities
                    });
                }
                priorityFilter = priority;
            }

            let typeFilter: IncidentType | undefined;
            if (incidentType) {
                if (typeof incidentType !== 'string' || !isValidIncidentType(incidentType)) {
                    return res.status(400).json({
                        error: 'Bad Request',
                        message: `El tipo de incidente no es válido: ${incidentType}`,
                        validValues: validIncidentTypes
                    });
                }
                typeFilter = incidentType;
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
