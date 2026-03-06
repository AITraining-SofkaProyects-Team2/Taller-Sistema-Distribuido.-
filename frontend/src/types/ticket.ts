import type { IncidentType } from './incident';

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
  status?: TicketStatus;
  priority?: TicketPriority;
  type?: IncidentType;
  dateFrom?: string;
  dateTo?: string;
  ticketId?: string;
  lineNumber?: string;
  page?: number;
  limit?: number;
}

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  HIGH: 'Alta',
  MEDIUM: 'Media',
  LOW: 'Baja',
  PENDING: 'Pendiente',
};

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  RECEIVED: 'Recibida',
  IN_PROGRESS: 'En Progreso',
};

export const INITIAL_FILTERS: TicketFilters = {
  status: undefined,
  priority: undefined,
  type: undefined,
  dateFrom: undefined,
  dateTo: undefined,
  ticketId: undefined,
  lineNumber: undefined,
  page: 1,
  limit: 10,
};
