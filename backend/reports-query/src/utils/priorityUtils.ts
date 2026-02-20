// Centralized priorities and normalization util for tickets

export const VALID_PRIORITIES = ['HIGH', 'MEDIUM', 'LOW', 'PENDING'] as const;
export type TicketPriority = typeof VALID_PRIORITIES[number];

export function normalizePriority(priority: string | undefined | null): TicketPriority | undefined {
  if (!priority) return undefined;
  const normalized = String(priority).toUpperCase();
  return VALID_PRIORITIES.find(p => p === normalized) as TicketPriority | undefined;
}

export function isValidPriority(priority: string | undefined | null): boolean {
  if (!priority) return false;
  return VALID_PRIORITIES.includes(String(priority).toUpperCase() as TicketPriority);
}
