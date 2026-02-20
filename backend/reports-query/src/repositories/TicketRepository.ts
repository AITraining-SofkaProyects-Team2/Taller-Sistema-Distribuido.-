import { Ticket, TicketFilters, PaginatedResponse } from '../types';

export interface ITicketRepository {
    findAll(filters: TicketFilters): Promise<PaginatedResponse<Ticket>>;
}

export class TicketRepository implements ITicketRepository {
    async findAll(_filters: TicketFilters): Promise<PaginatedResponse<Ticket>> {
        // This will be implemented with PostgreSQL later.
        // For now, it's a placeholder for tests to mock.
        return {
            data: [],
            pagination: {
                page: 1,
                pageSize: 20,
                totalItems: 0,
                totalPages: 0
            }
        };
    }
}
