export type IncidentType =
  | 'NO_SERVICE'
  | 'INTERMITTENT_SERVICE'
  | 'SLOW_CONNECTION'
  | 'ROUTER_ISSUE'
  | 'BILLING_QUESTION'
  | 'OTHER';

export type TicketPriority = 'HIGH' | 'MEDIUM' | 'LOW' | 'PENDING';

export type TicketStatus = 'RECEIVED' | 'IN_PROGRESS';

export interface Ticket {
  ticketId: string;
  lineNumber: string;
  email?: string;
  type: IncidentType;
  description: string | null;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  processedAt: string | null;
}

export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

export interface TicketFilters {
  status?: TicketStatus | TicketStatus[];
  priority?: TicketPriority;
  type?: IncidentType;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

