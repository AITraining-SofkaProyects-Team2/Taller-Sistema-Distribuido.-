import { Ticket, TicketFilters, PaginatedResponse } from '../types';

export interface ITicketRepository {
  findById(ticketId: string): Promise<Ticket | null>;
  findAll(filters: TicketFilters): Promise<PaginatedResponse<Ticket>>;
  findByLineNumber(lineNumber: string): Promise<Ticket[]>;
  getMetrics(): Promise<Record<string, unknown>>;
}

