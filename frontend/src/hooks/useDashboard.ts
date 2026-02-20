import { useState, useCallback, useMemo } from 'react';
import type { Ticket, TicketFilters, PaginationMetadata } from '../types/ticket';
import { INITIAL_FILTERS } from '../types/ticket';
import type { IncidentType } from '../types/incident';

interface UseDashboardReturn {
  tickets: Ticket[];
  pagination: PaginationMetadata;
  filters: TicketFilters;
  isLoading: boolean;
  error: string | null;
  setFilters: (filters: TicketFilters) => void;
  updateFilter: <K extends keyof TicketFilters>(key: K, value: TicketFilters[K]) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  refresh: () => void;
  activeFilterCount: number;
}

const INCIDENT_TYPES: IncidentType[] = [
  'NO_SERVICE', 'INTERMITTENT_SERVICE', 'SLOW_CONNECTION',
  'ROUTER_ISSUE', 'BILLING_QUESTION', 'OTHER',
];

const PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'] as const;
const STATUSES = ['RECEIVED', 'IN_PROGRESS'] as const;

/**
 * Genera datos mock realistas para el dashboard.
 */
const generateMockTickets = (): Ticket[] =>
  Array.from({ length: 53 }, (_, i): Ticket => ({
    ticketId: `TCK-${1000 + i}`,
    lineNumber: `300${i % 10}1234${i}`,
    email: `cliente${i}@isp.com`,
    type: INCIDENT_TYPES[i % 6],
    priority: PRIORITIES[i % 3],
    status: STATUSES[i % 2],
    description: i % 6 === 5 ? 'Otro tipo de incidente' : null,
    createdAt: new Date(Date.now() - i * 3600 * 1000).toISOString(),
    processedAt: i % 2 === 1 ? new Date(Date.now() - i * 1800 * 1000).toISOString() : null,
  }));

const ALL_MOCK_TICKETS = generateMockTickets();

const countActiveFilters = (filters: TicketFilters): number => {
  let count = 0;
  if (filters.status) count++;
  if (filters.priority) count++;
  if (filters.type) count++;
  if (filters.dateFrom) count++;
  if (filters.dateTo) count++;
  if (filters.ticketId) count++;
  if (filters.lineNumber) count++;
  return count;
};

/**
 * Aplica todos los filtros activos sobre el array de tickets.
 */
const applyFilters = (tickets: Ticket[], filters: TicketFilters): Ticket[] =>
  tickets.filter((t) => {
    if (filters.status && t.status !== filters.status) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.type && t.type !== filters.type) return false;
    if (filters.ticketId && !t.ticketId.toLowerCase().includes(filters.ticketId.toLowerCase())) return false;
    if (filters.lineNumber && !t.lineNumber.includes(filters.lineNumber)) return false;
    if (filters.dateFrom && t.createdAt < new Date(filters.dateFrom).toISOString()) return false;
    if (filters.dateTo && t.createdAt > new Date(filters.dateTo + 'T23:59:59').toISOString()) return false;
    return true;
  });

export const useDashboard = (): UseDashboardReturn => {
  const [filters, setFiltersState] = useState<TicketFilters>(INITIAL_FILTERS);

  const filteredTickets = useMemo(() => applyFilters(ALL_MOCK_TICKETS, filters), [filters]);

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const totalItems = filteredTickets.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const safeCurrentPage = Math.min(page, totalPages);

  const paginatedTickets = useMemo(
    () => filteredTickets.slice((safeCurrentPage - 1) * limit, safeCurrentPage * limit),
    [filteredTickets, safeCurrentPage, limit],
  );

  const pagination: PaginationMetadata = {
    page: safeCurrentPage,
    pageSize: limit,
    totalItems,
    totalPages,
  };

  const setFilters = useCallback((newFilters: TicketFilters) => {
    setFiltersState(newFilters);
  }, []);

  const updateFilter = useCallback(<K extends keyof TicketFilters>(key: K, value: TicketFilters[K]) => {
    setFiltersState(prev => ({
      ...prev,
      [key]: value || undefined,
      ...(key !== 'page' ? { page: 1 } : {}),
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(INITIAL_FILTERS);
  }, []);

  const setPage = useCallback((page: number) => {
    setFiltersState(prev => ({ ...prev, page }));
  }, []);

  const refresh = useCallback(() => {
    // Con mock data, no-op — se recalcula reactivamente por useMemo
  }, []);

  const activeFilterCount = countActiveFilters(filters);

  return {
    tickets: paginatedTickets,
    pagination,
    filters,
    isLoading: false,
    error: null,
    setFilters,
    updateFilter,
    clearFilters,
    setPage,
    refresh,
    activeFilterCount,
  };
};
