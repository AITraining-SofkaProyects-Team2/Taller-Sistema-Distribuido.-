import { useState, useCallback, useEffect } from 'react';
import type { Ticket, TicketFilters, PaginationMetadata } from '../types/ticket';
import { INITIAL_FILTERS } from '../types/ticket';
import { ticketsService } from '../services/tickets.service';

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



export const useDashboard = (): UseDashboardReturn => {
  const [filters, setFiltersState] = useState<TicketFilters>(INITIAL_FILTERS);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata>({ page: 1, pageSize: 10, totalItems: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async (f: TicketFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await ticketsService.getTickets(f);
      setTickets(res.data);
      setPagination(res.pagination);
    } catch (err: any) {
      setError(err?.message ?? 'Error fetching tickets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets(filters);
  }, [filters, fetchTickets]);

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
    fetchTickets(filters);
  }, [fetchTickets, filters]);

  const activeFilterCount = countActiveFilters(filters);

  return {
    tickets,
    pagination,
    filters,
    isLoading,
    error,
    setFilters,
    updateFilter,
    clearFilters,
    setPage,
    refresh,
    activeFilterCount,
  };
};
