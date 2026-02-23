import { initializeDatabase, query, default as pool } from '../utils/database';
import { randomUUID } from 'crypto';
import { logger } from '../utils/logger';

type SeedTicket = {
  ticket_id: string;
  line_number: string;
  email: string | null;
  type: string;
  description: string | null;
  priority: string;
  status: string;
  created_at: string;
};

const sampleTickets = (): SeedTicket[] => {
  const now = new Date().toISOString();

  const base: SeedTicket[] = [
    {
      ticket_id: randomUUID(),
      line_number: 'LN-1001',
      email: 'user1@example.com',
      type: 'outage',
      description: 'Customer reports total service outage',
      priority: 'high',
      status: 'open',
      created_at: now,
    },
    {
      ticket_id: randomUUID(),
      line_number: 'LN-1002',
      email: 'user2@example.com',
      type: 'latency',
      description: 'Intermittent high latency observed',
      priority: 'medium',
      status: 'open',
      created_at: now,
    },
    {
      ticket_id: randomUUID(),
      line_number: 'LN-1003',
      email: null,
      type: 'billing',
      description: 'Question about charges',
      priority: 'low',
      status: 'closed',
      created_at: now,
    },
  ];

  // generate 32 additional tickets to reach 35 total
  const types = ['outage', 'latency', 'billing', 'installation', 'maintenance'];
  const priorities = ['low', 'medium', 'high'];
  const statuses = ['open', 'in_progress', 'closed'];

  for (let i = 4; i <= 35; i++) {
    const idx = i - 4;
    base.push({
      ticket_id: randomUUID(),
      line_number: `LN-${1000 + i}`,
      email: idx % 5 === 0 ? null : `user${i}@example.com`,
      type: types[idx % types.length],
      description: `Sample ticket number ${i}`,
      priority: priorities[idx % priorities.length],
      status: statuses[idx % statuses.length],
      created_at: new Date(Date.now() - idx * 1000 * 60).toISOString(),
    });
  }

  return base;
};

const run = async () => {
  try {
    await initializeDatabase();

    const tickets = sampleTickets();

    await query('BEGIN');

    const insertText = `INSERT INTO tickets
      (ticket_id, line_number, email, type, description, priority, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (ticket_id) DO NOTHING`;

    for (const t of tickets) {
      await query(insertText, [
        t.ticket_id,
        t.line_number,
        t.email,
        t.type,
        t.description,
        t.priority,
        t.status,
        t.created_at,
      ]);
    }

    await query('COMMIT');

    logger.info('Seed completed', { inserted: tickets.length });
  } catch (error) {
    await query('ROLLBACK');
    logger.error('Seed failed', { error });
    process.exitCode = 1;
  } finally {
    try {
      await pool.end();
    } catch {
      // ignore
    }
  }
};

run();
