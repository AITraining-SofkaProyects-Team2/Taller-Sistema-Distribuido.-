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
  // Special cases used by tests
  if (count === 4) {
    tickets = [
      {
        id: 'T-001',
        lineNumber: '300000001',
        email: 'user1@test.com',
        incidentType: 'NO_SERVICE',
        description: null,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'T-002',
        lineNumber: '300000002',
        email: 'user2@test.com',
        incidentType: 'SLOW_CONNECTION',
        description: null,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'T-003',
        lineNumber: '300000003',
        email: 'user3@test.com',
        incidentType: 'INTERMITTENT_SERVICE',
        description: null,
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        createdAt: new Date().toISOString(),
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

  if (count === 25) {
    // 5 HIGH, 8 MEDIUM, 10 LOW, 2 PENDING
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
        createdAt: new Date(Date.now() - i * 1000 * 60).toISOString(),
      });
    }
    return;
  }

  // Generic seeding
  const priorities = ['HIGH', 'MEDIUM', 'LOW', 'PENDING'];
  tickets = Array.from({ length: count }, (_, i) => ({
    id: (i + 1).toString(),
    lineNumber: `30000000${i + 1}`,
    email: `user${i + 1}@test.com`,
    incidentType: 'NO_SERVICE',
    description: null,
    priority: priorities[i % priorities.length],
    status: 'RECEIVED',
    createdAt: new Date(Date.now() - i * 1000 * 60).toISOString(),
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
