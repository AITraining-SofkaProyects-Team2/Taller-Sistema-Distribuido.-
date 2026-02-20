import { ITicketRepository } from '../repositories/ITicketRepository';
import { Ticket } from '../types/Ticket';

export class TicketQueryService {
  constructor(private readonly repository: ITicketRepository) {}

  async findByLineNumber(lineNumber: string): Promise<Ticket[]> {
    return this.repository.findByLineNumber(lineNumber);
  }
}
