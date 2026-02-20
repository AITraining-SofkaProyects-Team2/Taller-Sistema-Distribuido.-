import { ITicketRepository } from '../repositories/ITicketRepository';
import { Ticket, TicketFilters, PaginatedResponse } from '../types';
import { TicketNotFoundError } from '../errors/TicketNotFoundError';
import { InvalidUuidFormatError } from '../errors/InvalidUuidFormatError';

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
    return this.repository.findAll(filters);
  }
  
  async findByLineNumber(lineNumber: string): Promise<Ticket[]> {
    if (!LINE_NUMBER_REGEX.test(lineNumber)) {
      throw new Error(`Invalid lineNumber: must be exactly 10 digits, got "${lineNumber}"`);
    }
    return this.repository.findByLineNumber(lineNumber);
  }
}

