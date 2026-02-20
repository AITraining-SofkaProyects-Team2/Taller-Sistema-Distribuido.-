// Campos permitidos para ordenamiento de tickets (HU-08, HU-01 TC-004)
export const ALLOWED_SORT_FIELDS = ['createdAt', 'priority', 'status'] as const;
export type AllowedSortField = typeof ALLOWED_SORT_FIELDS[number];