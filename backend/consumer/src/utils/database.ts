import { Pool } from 'pg';
import { logger } from './logger';

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'tickets_db',
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const initializeDatabase = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS incidents (
        ticket_id UUID PRIMARY KEY,
        line_number VARCHAR(50) NOT NULL,
        type VARCHAR(30) NOT NULL,
        description TEXT,
        priority VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL,
        processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        logger.info('Database initialized - incidents table created if not existed');
    } catch (error) {
        logger.error('Failed to initialize database', { error });
        throw error;
    }
};

export default pool;
