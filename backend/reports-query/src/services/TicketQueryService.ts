import { ITicketRepository } from '../repositories/ITicketRepository';
import { Ticket } from '../types/Ticket';

const LINE_NUMBER_REGEX = /^\d{10}$/;

export class TicketQueryService {
  constructor(private readonly repository: ITicketRepository) {}

  async findByLineNumber(lineNumber: string): Promise<Ticket[]> {
    if (!LINE_NUMBER_REGEX.test(lineNumber)) {
      throw new Error(`Invalid lineNumber: must be exactly 10 digits, got "${lineNumber}"`);
    }
    return this.repository.findByLineNumber(lineNumber);
  }
}
