import { ITicketRepository } from '../repositories/ITicketRepository';
import { TicketNotFoundError } from '../errors/TicketNotFoundError';
import { InvalidUuidFormatError } from '../errors/InvalidUuidFormatError';
import { Ticket, TicketFilters } from '../types';

// PaginatedResponse para mantener compatibilidad con getTickets
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LINE_NUMBER_REGEX = /^\d{10}$/;

export class TicketQueryService {
  constructor(private readonly repository: ITicketRepository) {}

  async findById(ticketId: string): Promise<Ticket> {
    if (!UUID_V4_REGEX.test(ticketId)) {
      throw new InvalidUuidFormatError();
    }

    const ticket = await this.repository.findById(ticketId);

    if (ticket === null) {
      throw new TicketNotFoundError();
    }

    return ticket;
  }
  
  async getTickets(filters: TicketFilters): Promise<PaginatedResponse<Ticket>> {
        const tickets = await this.repository.findAll(filters);
        // Convertir a PaginatedResponse si es necesario
        if (Array.isArray(tickets)) {
            return {
                data: tickets,
                pagination: {
                    page: 1,
                    pageSize: tickets.length,
                    totalItems: tickets.length,
                    totalPages: 1
                }
            };
        }
        return tickets;
    }
  
    async findByLineNumber(lineNumber: string): Promise<Ticket[]> {
    if (!LINE_NUMBER_REGEX.test(lineNumber)) {
      throw new Error(`Invalid lineNumber: must be exactly 10 digits, got "${lineNumber}"`);
    }
    return this.repository.findByLineNumber(lineNumber);
  }
}

