import { ITicketRepository } from '../repositories/ITicketRepository';
import { Ticket } from '../types/Ticket';
import { TicketNotFoundError } from '../errors/TicketNotFoundError';
import { InvalidUuidFormatError } from '../errors/InvalidUuidFormatError';

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
}
