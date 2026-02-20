import { ITicketRepository } from '../repositories/TicketRepository';
import { Ticket, TicketFilters, PaginatedResponse } from '../types';

export class TicketQueryService {
    constructor(private repository: ITicketRepository) { }

    async getTickets(filters: TicketFilters): Promise<PaginatedResponse<Ticket>> {
        return this.repository.findAll(filters);
    }
}
