import { getTicketRepository, Ticket } from '../repositories/ticketRepository';

export async function getPaginatedTickets(page: number, limit: number, sort?: string, order?: string) {
  const repo = getTicketRepository();
  let allTickets: Ticket[] = await repo.getAll();

  // Only support sort by createdAt for now
  if (sort === 'createdAt') {
    allTickets = allTickets.slice().sort((a, b) => {
      if (order === 'desc') {
        return b.createdAt.localeCompare(a.createdAt);
      }
      return a.createdAt.localeCompare(b.createdAt);
    });
  }

  const totalItems = allTickets.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);
  const start = (page - 1) * limit;
  const data = (start < totalItems && start >= 0) ? allTickets.slice(start, start + limit) : [];
  return {
    data,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  };
}
