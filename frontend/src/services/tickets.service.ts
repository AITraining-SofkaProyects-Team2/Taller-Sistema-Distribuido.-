import { HttpClient } from './http-client';
import type { PaginatedResponse, Ticket, TicketFilters } from '../types/ticket';

/**
 * En producción (Docker), las requests pasan por el proxy nginx en el mismo origen.
 * En desarrollo local, se puede apuntar directamente al servicio reports-query.
 */
const REPORTS_API_URL = import.meta.env.VITE_REPORTS_API_URL || '';

const reportsClient = new HttpClient({ baseUrl: REPORTS_API_URL });

/**
 * Construye query string a partir de los filtros, omitiendo valores vacíos.
 */
const buildQueryString = (filters: TicketFilters): string => {
  const params = new URLSearchParams();

  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.type) params.append('type', filters.type);
  if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.append('dateTo', filters.dateTo);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));
  if (filters.ticketId) params.append('ticketId', filters.ticketId);
  if (filters.lineNumber) params.append('lineNumber', filters.lineNumber);

  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

/**
 * Service for querying tickets from reports-query microservice.
 */
export const ticketsService = {
  /**
   * Fetches paginated tickets with optional filters.
   */
  getTickets: async (filters: TicketFilters = {}): Promise<PaginatedResponse<Ticket>> => {
    const queryString = buildQueryString(filters);
    return reportsClient.get<PaginatedResponse<Ticket>>(`/api/tickets${queryString}`);
  },
  /**
   * Fetch aggregated metrics for tickets.
   */
  getMetrics: async (): Promise<any> => {
    return reportsClient.get(`/api/tickets/metrics`);
  },
};
