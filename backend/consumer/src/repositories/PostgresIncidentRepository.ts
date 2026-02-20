import { Incident } from '../types';
import { IIncidentRepository } from './IIncidentRepository';
import pool from '../utils/database';
import { logger } from '../utils/logger';

export class PostgresIncidentRepository implements IIncidentRepository {
    async save(incident: Incident): Promise<Incident> {
        const queryText = `
      INSERT INTO incidents (
        ticket_id, 
        line_number, 
        type, 
        description, 
        priority, 
        status, 
        created_at, 
        processed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (ticket_id) DO UPDATE SET
        line_number = EXCLUDED.line_number,
        type = EXCLUDED.type,
        description = EXCLUDED.description,
        priority = EXCLUDED.priority,
        status = EXCLUDED.status,
        created_at = EXCLUDED.created_at,
        processed_at = EXCLUDED.processed_at
      RETURNING *;
    `;

        const values = [
            incident.ticketId,
            incident.lineNumber,
            incident.type,
            incident.description || null,
            incident.priority,
            incident.status,
            incident.createdAt,
            incident.processedAt || new Date()
        ];

        try {
            await pool.query(queryText, values);
            return incident;
        } catch (error) {
            logger.error('Error saving incident to Postgres', { ticketId: incident.ticketId, error });
            throw error;
        }
    }
}
