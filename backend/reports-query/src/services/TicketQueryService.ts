import { ITicketRepository } from '../repositories/ITicketRepository';
import { Ticket } from '../types/Ticket';
import { TicketNotFoundError } from '../errors/TicketNotFoundError';

export class TicketQueryService {
  constructor(private readonly repository: ITicketRepository) {}

  async findById(ticketId: string): Promise<Ticket> {
    const ticket = await this.repository.findById(ticketId);

    if (ticket === null) {
      throw new TicketNotFoundError();
    }

    return ticket;
  }
}
