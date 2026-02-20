export type IncidentType =
  | 'NO_SERVICE'
  | 'INTERMITTENT_SERVICE'
  | 'SLOW_CONNECTION'
  | 'ROUTER_ISSUE'
  | 'BILLING_QUESTION'
  | 'OTHER';

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW' | 'PENDING';

export type TicketStatus = 'RECEIVED' | 'IN_PROGRESS';

export interface Ticket {
  ticketId: string;
  lineNumber: string;
  type: IncidentType;
  description: string | null;
  priority: Priority;
  status: TicketStatus;
  createdAt: Date;
  processedAt: Date;
}
