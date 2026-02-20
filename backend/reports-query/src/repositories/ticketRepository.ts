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
  tickets = Array.from({ length: count }, (_, i) => ({
    id: (i + 1).toString(),
    lineNumber: `30000000${i + 1}`,
    email: `user${i + 1}@test.com`,
    incidentType: 'NO_SERVICE',
    description: null,
    priority: 'HIGH',
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
