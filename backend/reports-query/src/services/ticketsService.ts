
import { getTicketRepository, Ticket } from '../repositories/ticketRepository';


export async function getPaginatedTickets(
  page: number,
  limit: number,
  sort?: string,
  order?: string,
  priority?: string,
  status?: string,
  type?: string,
) {
  // Solo lógica de negocio real, sin auto-seed de tests
  const repo = getTicketRepository();
  let allTickets: Ticket[] = await repo.getAll();

  // ── Validación y filtrado por priority ───────────────────────────────────
  if (priority !== undefined) {
    const validPriorities = ['HIGH', 'MEDIUM', 'LOW', 'PENDING'];
    const normalizedPriority = String(priority).toUpperCase();
    if (!validPriorities.includes(normalizedPriority)) {
      const validList = validPriorities.join(', ');
      throw Object.assign(
        new Error(`La prioridad "${priority}" no es válida. Prioridad válida: ${validList}`),
        { status: 400 }
      );
    }
    allTickets = allTickets.filter(
      t => (t.priority || '').toUpperCase() === normalizedPriority
    );
  }

  // ── Filtrado por status ───────────────────────────────────────────────────
  if (status !== undefined) {
    allTickets = allTickets.filter(t => t.status === status);
  }

  // ── Filtrado por type ─────────────────────────────────────────────────────
  if (type !== undefined) {
    allTickets = allTickets.filter(t => t.incidentType === type);
  }

  // ── Ordenamiento ──────────────────────────────────────────────────────────
  if (sort !== undefined) {
    if (sort === 'createdAt') {
      allTickets = allTickets.filter(
        t => (t.priority || '').toUpperCase() !== 'PENDING'
      );
      allTickets = allTickets.slice().sort((a, b) =>
        order === 'desc'
          ? b.createdAt.localeCompare(a.createdAt)
          : a.createdAt.localeCompare(b.createdAt)
      );
    } else if (sort === 'priority') {
      const priorityOrder = ['HIGH', 'MEDIUM', 'LOW', 'PENDING'];
      allTickets = allTickets.slice().sort((a, b) => {
        const ia = priorityOrder.indexOf((a.priority || '').toUpperCase());
        const ib = priorityOrder.indexOf((b.priority || '').toUpperCase());
        return order === 'desc' ? ia - ib : ib - ia;
      });
    } else if (sort === 'status') {
      const statusOrder = ['RECEIVED', 'IN_PROGRESS'];
      allTickets = allTickets.slice().sort((a, b) => {
        const ia = statusOrder.indexOf((a.status || '').toUpperCase());
        const ib = statusOrder.indexOf((b.status || '').toUpperCase());
        return order === 'desc' ? ib - ia : ia - ib;
      });
    } else {
      throw Object.assign(
        new Error(`Campo de ordenamiento inválido: ${String(sort)}. Campos válidos: createdAt, priority, status.`),
        { status: 400 }
      );
    }
  }

  // ── Paginación ────────────────────────────────────────────────────────────
  const totalItems = allTickets.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);
  const start = (page - 1) * limit;
  const pageSlice =
    start < totalItems && start >= 0 ? allTickets.slice(start, start + limit) : [];

  const data = pageSlice.map(t => ({
    id: t.id,
    ticketId: t.id,
    lineNumber: t.lineNumber,
    email: t.email,
    type: t.incidentType,
    description: t.description ?? null,
    priority: t.priority,
    status: t.status,
    createdAt: t.createdAt,
  }));

  return {
    data,
    pagination: { page, limit, totalItems, totalPages },
  };
}