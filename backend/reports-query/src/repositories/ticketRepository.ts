export interface Ticket {
  id: string;
  lineNumber: string;
  email: string;
  incidentType: string;
  description?: string | null;
  priority: string;
  status: string;
  createdAt: string;
}

let tickets: Ticket[] = [];

export function seedTickets(count: number) {

  // ── count=4: HU-08 — fechas fijas, prioridades y estados variados ──────────
  // Usado por HU-08 (ordenamiento) via auto-seed del service
  // T-001: LOW  / IN_PROGRESS / Feb-18
  // T-002: HIGH / RECEIVED    / Feb-15
  // T-003: MED  / IN_PROGRESS / Feb-20
  // T-004: PEND / RECEIVED    / Feb-10
  if (count === 4) {
    tickets = [
      {
        id: 'T-001',
        lineNumber: '300000001',
        email: 'user1@test.com',
        incidentType: 'NO_SERVICE',
        description: null,
        priority: 'LOW',
        status: 'IN_PROGRESS',
        createdAt: '2026-02-18T10:00:00.000Z',
      },
      {
        id: 'T-002',
        lineNumber: '300000002',
        email: 'user2@test.com',
        incidentType: 'SLOW_CONNECTION',
        description: null,
        priority: 'HIGH',
        status: 'RECEIVED',
        createdAt: '2026-02-15T10:00:00.000Z',
      },
      {
        id: 'T-003',
        lineNumber: '300000003',
        email: 'user3@test.com',
        incidentType: 'INTERMITTENT_SERVICE',
        description: null,
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        createdAt: '2026-02-20T10:00:00.000Z',
      },
      {
        id: 'T-004',
        lineNumber: '300000004',
        email: 'user4@test.com',
        incidentType: 'OTHER',
        description: 'Test',
        priority: 'PENDING',
        status: 'RECEIVED',
        createdAt: '2026-02-10T10:00:00.000Z',
      },
    ];
    return;
  }

  // ── count=44: HU-03 TC-015 — filtros combinados ───────────────────────────
  // T-001: HIGH / IN_PROGRESS / NO_SERVICE
  // T-002: HIGH / IN_PROGRESS / SLOW_CONNECTION
  // T-003: MEDIUM / IN_PROGRESS / INTERMITTENT_SERVICE
  // T-004: HIGH / RECEIVED / OTHER
  if (count === 44) {
    tickets = [
      {
        id: 'T-001',
        lineNumber: '300000001',
        email: 'user1@test.com',
        incidentType: 'NO_SERVICE',
        description: null,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        createdAt: new Date(Date.now() - 3000).toISOString(),
      },
      {
        id: 'T-002',
        lineNumber: '300000002',
        email: 'user2@test.com',
        incidentType: 'SLOW_CONNECTION',
        description: null,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        createdAt: new Date(Date.now() - 2000).toISOString(),
      },
      {
        id: 'T-003',
        lineNumber: '300000003',
        email: 'user3@test.com',
        incidentType: 'INTERMITTENT_SERVICE',
        description: null,
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        createdAt: new Date(Date.now() - 1000).toISOString(),
      },
      {
        id: 'T-004',
        lineNumber: '300000004',
        email: 'user4@test.com',
        incidentType: 'OTHER',
        description: 'Test',
        priority: 'HIGH',
        status: 'RECEIVED',
        createdAt: new Date().toISOString(),
      },
    ];
    return;
  }

  // ── count=25: HU-03 TC-013 — 5 HIGH, 8 MEDIUM, 10 LOW, 2 PENDING ──────────
  if (count === 25) {
    tickets = [];
    for (let i = 0; i < 25; i++) {
      let priority = 'HIGH';
      if (i >= 5 && i < 13) priority = 'MEDIUM';
      else if (i >= 13 && i < 23) priority = 'LOW';
      else if (i >= 23) priority = 'PENDING';
      tickets.push({
        id: (i + 1).toString(),
        lineNumber: `30000000${i + 1}`,
        email: `user${i + 1}@test.com`,
        incidentType: 'NO_SERVICE',
        description: null,
        priority,
        status: 'RECEIVED',
        createdAt: new Date(Date.now() - (25 - i) * 1000 * 60).toISOString(),
      });
    }
    return;
  }

  // ── Generic: HU-01 y cualquier otro count ─────────────────────────────────
  const priorities = ['HIGH', 'MEDIUM', 'LOW', 'PENDING'];
  tickets = Array.from({ length: count }, (_, i) => ({
    id: (i + 1).toString(),
    lineNumber: `30000000${i + 1}`,
    email: `user${i + 1}@test.com`,
    incidentType: 'NO_SERVICE',
    description: null,
    priority: priorities[i % priorities.length],
    status: 'RECEIVED',
    createdAt: new Date(Date.now() - (count - i) * 1000 * 60).toISOString(),
  }));
}

export function clearTickets() {
  tickets = [];
}

export function getTicketRepository() {
  return {
    getAll: async () => tickets,
    seed: seedTickets,
  };
}