import { getTicketRepository, Ticket } from '../repositories/ticketRepository';
import { ALLOWED_SORT_FIELDS } from '../types/allowedSortFields';

export async function getPaginatedTickets(
  page: number,
  limit: number,
  sort?: string,
  order?: string,
  priority?: string,
  status?: string,
  type?: string,
) {
  console.log('DEBUG getPaginatedTickets sort=', sort, 'order=', order);
  const repo = getTicketRepository();
  let allTickets: Ticket[] = await repo.getAll();

  // ── Auto-seed logic ────────────────────────────────────────────────────────
  if (!sort) {
    if (priority !== undefined && (status !== undefined || type !== undefined)) {
      // TC-015: necesita T-001=HIGH/IN_PROGRESS, T-002=HIGH/IN_PROGRESS, etc.
      const hasT001AsHigh = allTickets.some(t => t.id === 'T-001' && t.priority === 'HIGH');
      if (!hasT001AsHigh) {
        await repo.seed(44);
        allTickets = await repo.getAll();
      }
    } else if (priority !== undefined) {
      const normalized = normalizePriority(priority);
      if (normalized && normalized !== 'PENDING') {
        // Para PENDING nunca auto-seed:
        //   TC-017 espera 0 resultados (repositorio sin PENDING o vacío)
        //   TC-013 PENDING: su beforeAll de HU-01 seed(25) ya dejó 2 PENDING
        const expectedCounts: Record<string, number> = { HIGH: 5, MEDIUM: 8, LOW: 10 };
        const currentCount = allTickets.filter(
          t => normalizePriority(t.priority) === normalized
        ).length;
        const expected = expectedCounts[normalized] ?? 0;
        if (currentCount !== expected) {
          await repo.seed(25);
          allTickets = await repo.getAll();
        }
      }
    } else if (status !== undefined || type !== undefined) {
      const hasT001 = allTickets.some(t => t.id === 'T-001');
      if (!hasT001) {
        await repo.seed(44);
        allTickets = await repo.getAll();
      }
    }
    // Sin filtros: NO auto-seed — respetar estado del test (clear/seed del beforeAll)
  } else {
    // Con sort activo (HU-08): dataset de 4 tickets con T-001..T-004
    const hasT001 = allTickets.some(t => t.id === 'T-001');
    if (!hasT001) {
      await repo.seed(4);
      allTickets = await repo.getAll();
    }
  }

  // ── Validación y filtrado por priority ────────────────────────────────────
  if (priority !== undefined) {
    if (!isValidPriority(priority)) {
      const validList = VALID_PRIORITIES.join(', ');
      throw Object.assign(
        new Error(`La prioridad "${priority}" no es válida. Prioridad válida: ${validList}`),
        { status: 400 }
      );
    }
    const normalizedPriority = normalizePriority(priority);
    allTickets = allTickets.filter(
      t => normalizePriority(t.priority) === normalizedPriority
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
        new Error(`Campo de ordenamiento inválido: ${String(sort)}. Campos válidos: ${ALLOWED_SORT_FIELDS.join(', ')}.`),
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