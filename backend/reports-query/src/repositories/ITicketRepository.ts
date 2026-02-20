import { Ticket, TicketFilters, PaginatedResponse } from '../types';

export interface ITicketRepository {
  findAll(filters: TicketFilters): Promise<PaginatedResponse<Ticket>>;
  findById(ticketId: string): Promise<Ticket | null>;
  findByLineNumber(lineNumber: string): Promise<Ticket[]>;
  getMetrics(): Promise<Record<string, unknown>>;
}

