import { ITicketRepository } from '../repositories/ITicketRepository';
import { Ticket } from '../types/Ticket';

export class TicketQueryService {
  constructor(private readonly repository: ITicketRepository) {}

  async findById(ticketId: string): Promise<Ticket | null> {
    return this.repository.findById(ticketId);
  }
}
