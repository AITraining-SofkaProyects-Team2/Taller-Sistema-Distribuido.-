import { TicketRepository } from '../repositories/TicketRepository';
import { Ticket, TicketFilters, PaginatedResponse } from '../types';
import { ALLOWED_SORT_FIELDS } from '../types/allowedSortFields';

const VALID_PRIORITIES = ['HIGH', 'MEDIUM', 'LOW', 'PENDING'];

function normalizePriority(value: string | undefined): string | undefined {
  return value?.toUpperCase();
}

function isValidPriority(value: string): boolean {
  return VALID_PRIORITIES.includes(value.toUpperCase());
}

export async function getPaginatedTickets(
  page: number,
  limit: number,
  sort?: string,
  order?: string,
  priority?: string,
  status?: string,
  type?: string,
): Promise<PaginatedResponse<Ticket>> {
  const repo = new TicketRepository();
  const filters: TicketFilters = {
    priority: normalizePriority(priority) as TicketFilters['priority'],
    status: status as TicketFilters['status'],
    type: type as TicketFilters['type'],
    page,
    limit,
  };

  // ── Validación de priority ────────────────────────────────────────────────
  if (priority !== undefined) {
    if (!isValidPriority(priority)) {
      const validList = VALID_PRIORITIES.join(', ');
      throw Object.assign(
        new Error(`La prioridad "${priority}" no es válida. Prioridad válida: ${validList}`),
        { status: 400 }
      );
    }
  }

  // ── Validación de sort ────────────────────────────────────────────────────
  if (sort !== undefined && !(ALLOWED_SORT_FIELDS as readonly string[]).includes(sort)) {
    throw Object.assign(
      new Error(`Campo de ordenamiento inválido: ${String(sort)}. Campos válidos: ${ALLOWED_SORT_FIELDS.join(', ')}.`),
      { status: 400 }
    );
  }

  return repo.findAll(filters);
}