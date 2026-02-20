import { Ticket } from '../types/Ticket';

export interface ITicketRepository {
  findById(ticketId: string): Promise<Ticket | null>;
  findAll(): Promise<Ticket[]>;
  findByLineNumber(lineNumber: string): Promise<Ticket[]>;
  getMetrics(): Promise<Record<string, unknown>>;
}
