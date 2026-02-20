import React, { useState } from "react";
import type { Ticket, PaginationMetadata, TicketPriority, TicketStatus } from "../../types/ticket";
import { TICKET_PRIORITY_LABELS, TICKET_STATUS_LABELS } from "../../types/ticket";
import { IncidentTypeLabels } from "../../types/incident";
import type { IncidentType } from "../../types/incident";

interface TicketListProps {
  tickets: Ticket[];
  pagination: PaginationMetadata;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

type SortableField = "ticketId" | "lineNumber" | "type" | "priority" | "status" | "createdAt";

const PRIORITY_ORDER: Record<TicketPriority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1, PENDING: 0 };

const TicketList: React.FC<TicketListProps> = ({ tickets, pagination, isLoading, onPageChange }) => {
  const [sortBy, setSortBy] = useState<SortableField>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { page, totalPages, totalItems } = pagination;

  // Client-side sort on the current page of data
  const sortedTickets = [...tickets].sort((a, b) => {
    const dir = sortOrder === "asc" ? 1 : -1;
    switch (sortBy) {
      case "createdAt":
        return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case "priority":
        return dir * (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
      case "status":
        return dir * a.status.localeCompare(b.status);
      case "ticketId":
        return dir * a.ticketId.localeCompare(b.ticketId);
      case "lineNumber":
        return dir * a.lineNumber.localeCompare(b.lineNumber);
      case "type":
        return dir * a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const handleSort = (field: SortableField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const SortIcon: React.FC<{ field: SortableField }> = ({ field }) => {
    if (sortBy !== field) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-indigo-600 ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>;
  };

  const priorityBadge = (priority: TicketPriority) => {
    const styles: Record<TicketPriority, string> = {
      HIGH: "bg-red-100 text-red-700",
      MEDIUM: "bg-yellow-100 text-yellow-700",
      LOW: "bg-green-100 text-green-700",
      PENDING: "bg-gray-100 text-gray-600",
    };
    return (
      <span className={`${styles[priority]} px-2 py-1 rounded text-xs font-semibold`}>
        {TICKET_PRIORITY_LABELS[priority]}
      </span>
    );
  };

  const statusBadge = (status: TicketStatus) => {
    const styles: Record<TicketStatus, string> = {
      IN_PROGRESS: "bg-blue-100 text-blue-700",
      RECEIVED: "bg-gray-100 text-gray-700",
    };
    return (
      <span className={`${styles[status]} px-2 py-1 rounded text-xs font-semibold`}>
        {TICKET_STATUS_LABELS[status]}
      </span>
    );
  };

  return (
    <section className="bg-white p-8 rounded-2xl shadow-xl shadow-indigo-100 border border-indigo-50">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Listado de Tickets</h2>
        <div className="flex gap-4">
          <span className="text-gray-500">
            Total: <span className="font-semibold text-indigo-600">{totalItems}</span>
          </span>
          {totalPages > 0 && (
            <span className="text-gray-500">
              Página <span className="font-semibold text-indigo-600">{page}</span> de{" "}
              <span className="font-semibold text-indigo-600">{totalPages}</span>
            </span>
          )}
        </div>
      </div>

      {isLoading && tickets.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="ml-3 text-indigo-600 font-medium">Cargando tickets...</span>
        </div>
      ) : (
        <>
          <div className={`overflow-x-auto ${isLoading ? "opacity-50 pointer-events-none" : ""} transition-opacity`}>
            <table className="min-w-full bg-white border border-indigo-100 rounded-lg">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-600 uppercase cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => handleSort("ticketId")}>
                    ID <SortIcon field="ticketId" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-600 uppercase cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => handleSort("lineNumber")}>
                    Línea <SortIcon field="lineNumber" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-600 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-600 uppercase cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => handleSort("type")}>
                    Tipo <SortIcon field="type" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-600 uppercase cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => handleSort("priority")}>
                    Prioridad <SortIcon field="priority" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-600 uppercase cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => handleSort("status")}>
                    Estado <SortIcon field="status" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-600 uppercase cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => handleSort("createdAt")}>
                    Fecha <SortIcon field="createdAt" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-50">
                {sortedTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-400 py-12">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-lg">No hay tickets para mostrar</span>
                        <span className="text-sm">Intenta ajustar los filtros</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedTickets.map((ticket) => (
                    <tr key={ticket.ticketId} className="hover:bg-indigo-50/50 transition">
                      <td className="px-4 py-3 font-mono text-sm text-indigo-700 font-medium">{ticket.ticketId}</td>
                      <td className="px-4 py-3">{ticket.lineNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ticket.email ?? "—"}</td>
                      <td className="px-4 py-3 text-sm">
                        {IncidentTypeLabels[ticket.type as IncidentType] ?? ticket.type}
                      </td>
                      <td className="px-4 py-3">{priorityBadge(ticket.priority)}</td>
                      <td className="px-4 py-3">{statusBadge(ticket.status)}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(ticket.createdAt).toLocaleString("es-AR")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-gray-500">
                Mostrando {sortedTickets.length} de {totalItems} tickets
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => onPageChange(1)}
                  className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-sm disabled:bg-gray-50 disabled:text-gray-400 hover:bg-indigo-100 transition"
                  title="Primera página"
                >
                  ««
                </button>
                <button
                  disabled={page <= 1}
                  onClick={() => onPageChange(page - 1)}
                  className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-semibold disabled:bg-gray-100 disabled:text-gray-400 hover:bg-indigo-200 transition"
                >
                  Anterior
                </button>

                {/* Page number buttons */}
                {generatePageNumbers(page, totalPages).map((p) =>
                  p === -1 ? (
                    <span key={`ellipsis-${Math.random()}`} className="px-2 text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => onPageChange(p)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                        p === page
                          ? "bg-indigo-600 text-white"
                          : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  disabled={page >= totalPages}
                  onClick={() => onPageChange(page + 1)}
                  className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-semibold disabled:bg-gray-100 disabled:text-gray-400 hover:bg-indigo-200 transition"
                >
                  Siguiente
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => onPageChange(totalPages)}
                  className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-sm disabled:bg-gray-50 disabled:text-gray-400 hover:bg-indigo-100 transition"
                  title="Última página"
                >
                  »»
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

/**
 * Genera los números de página a mostrar en la paginación.
 * Muestra siempre la primera, última y las cercanas a la actual.
 */
function generatePageNumbers(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: number[] = [1];

  if (current > 3) pages.push(-1); // ellipsis

  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push(-1); // ellipsis

  pages.push(total);
  return pages;
}

export default TicketList;
