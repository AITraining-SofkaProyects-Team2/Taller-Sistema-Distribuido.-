import pool from '../config/database';
import { Ticket, TicketFilters, PaginatedResponse, TicketStatus, TicketPriority, IncidentType } from '../types';
import { ITicketRepository } from './ITicketRepository';

export class TicketRepository implements ITicketRepository {
    async findById(ticketId: string): Promise<Ticket | null> {
        const query = `
            SELECT 
                ticket_id as "ticketId",
                line_number as "lineNumber",
                email,
                type,
                description,
                status,
                priority,
                created_at as "createdAt",
                processed_at as "processedAt"
            FROM tickets
            WHERE ticket_id = $1
        `;

        try {
            const result = await pool.query(query, [ticketId]);
            if (result.rows.length === 0) return null;

            const row = result.rows[0];
            return {
                ...row,
                createdAt: typeof row.createdAt === 'string' ? row.createdAt : row.createdAt.toISOString(),
                processedAt: row.processedAt ? (typeof row.processedAt === 'string' ? row.processedAt : row.processedAt.toISOString()) : null
            };
        } catch (error) {
            console.error('Error fetching ticket by ID:', error);
            throw error;
        }
    }

    async findAll(filters: TicketFilters): Promise<PaginatedResponse<Ticket>> {
        const { status, priority, type, dateFrom, dateTo, page = 1, limit = 20 } = filters;
        const offset = (page - 1) * limit;

        const whereClauses: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (status) {
            const statusArray = Array.isArray(status) ? status : [status];
            if (statusArray.length > 0) {
                const placeholders = statusArray.map(() => `$${paramIndex++}`).join(', ');
                whereClauses.push(`status IN (${placeholders})`);
                values.push(...statusArray);
            }
        }

        if (priority) {
            whereClauses.push(`priority = $${paramIndex++}`);
            values.push(priority);
        }

        if (type) {
            whereClauses.push(`type = $${paramIndex++}`);
            values.push(type);
        }

        if (dateFrom) {
            whereClauses.push(`created_at >= $${paramIndex++}`);
            values.push(dateFrom);
        }

        if (dateTo) {
            whereClauses.push(`created_at <= $${paramIndex++}`);
            values.push(dateTo);
        }

        const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        // Query for data
        const dataQuery = `
            SELECT 
                ticket_id as "ticketId",
                line_number as "lineNumber",
                email,
                type,
                description,
                status,
                priority,
                created_at as "createdAt",
                processed_at as "processedAt"
            FROM tickets
            ${whereSql}
            ORDER BY created_at DESC
            LIMIT $${paramIndex++} OFFSET $${paramIndex++}
        `;

        // Query for total count
        const countQuery = `
            SELECT COUNT(*) FROM tickets ${whereSql}
        `;

        try {
            const [dataResult, countResult] = await Promise.all([
                pool.query(dataQuery, [...values, limit, offset]),
                pool.query(countQuery, values)
            ]);

            const tickets: Ticket[] = dataResult.rows.map((row: any) => ({
                ...row,
                createdAt: typeof row.createdAt === 'string' ? row.createdAt : row.createdAt.toISOString(),
                processedAt: row.processedAt ? (typeof row.processedAt === 'string' ? row.processedAt : row.processedAt.toISOString()) : null
            }));

            const totalItems = parseInt(countResult.rows[0].count);
            const totalPages = Math.ceil(totalItems / limit);

            return {
                data: tickets,
                pagination: {
                    page,
                    pageSize: limit,
                    totalItems,
                    totalPages
                }
            };
        } catch (error) {
            console.error('Error fetching tickets from database:', error);
            throw error;
        }
    }

    async findByLineNumber(lineNumber: string): Promise<Ticket[]> {
        const query = `
            SELECT 
                ticket_id as "ticketId",
                line_number as "lineNumber",
                email,
                type,
                description,
                status,
                priority,
                created_at as "createdAt",
                processed_at as "processedAt"
            FROM tickets
            WHERE line_number = $1
        `;

        try {
            const result = await pool.query(query, [lineNumber]);
            return result.rows.map((row: any) => ({
                ...row,
                createdAt: typeof row.createdAt === 'string' ? row.createdAt : row.createdAt.toISOString(),
                processedAt: row.processedAt ? (typeof row.processedAt === 'string' ? row.processedAt : row.processedAt.toISOString()) : null
            }));
        } catch (error) {
            console.error('Error fetching ticket by line number:', error);
            throw error;
        }
    }

    async getMetrics(): Promise<Record<string, unknown>> {
        const query = `
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'RECEIVED' THEN 1 END) as received,
                COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END) as in_progress,
                COUNT(CASE WHEN priority = 'HIGH' THEN 1 END) as high_priority,
                COUNT(CASE WHEN priority = 'MEDIUM' THEN 1 END) as medium_priority,
                COUNT(CASE WHEN priority = 'LOW' THEN 1 END) as low_priority,
                COUNT(CASE WHEN priority = 'PENDING' THEN 1 END) as pending_priority
            FROM tickets
        `;

        try {
            const result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching metrics:', error);
            throw error;
        }
    }
}

