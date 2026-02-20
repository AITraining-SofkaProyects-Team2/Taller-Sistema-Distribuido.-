import React, { useState, useEffect, useCallback } from "react";
import type { TicketFilters, TicketPriority, TicketStatus } from "../../types/ticket";
import { TICKET_PRIORITY_LABELS, TICKET_STATUS_LABELS } from "../../types/ticket";
import { IncidentType, IncidentTypeLabels } from "../../types/incident";

interface FiltersProps {
  filters: TicketFilters;
  onFilterChange: <K extends keyof TicketFilters>(key: K, value: TicketFilters[K]) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
  isLoading: boolean;
}

const DEBOUNCE_MS = 400;

/**
 * Hook para debounce de inputs de texto.
 */
const useDebouncedValue = (value: string, delay: number): string => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
  isLoading,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Local state para inputs de texto con debounce
  const [localTicketId, setLocalTicketId] = useState(filters.ticketId ?? "");
  const [localLineNumber, setLocalLineNumber] = useState(filters.lineNumber ?? "");

  const debouncedTicketId = useDebouncedValue(localTicketId, DEBOUNCE_MS);
  const debouncedLineNumber = useDebouncedValue(localLineNumber, DEBOUNCE_MS);

  // Sincronizar valores debounced con los filtros reales
  useEffect(() => {
    if (debouncedTicketId !== (filters.ticketId ?? "")) {
      onFilterChange("ticketId", debouncedTicketId || undefined);
    }
  }, [debouncedTicketId, filters.ticketId, onFilterChange]);

  useEffect(() => {
    if (debouncedLineNumber !== (filters.lineNumber ?? "")) {
      onFilterChange("lineNumber", debouncedLineNumber || undefined);
    }
  }, [debouncedLineNumber, filters.lineNumber, onFilterChange]);

  // Resetear inputs locales cuando se limpian los filtros globales
  useEffect(() => {
    if (!filters.ticketId && localTicketId) setLocalTicketId("");
    if (!filters.lineNumber && localLineNumber) setLocalLineNumber("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.ticketId, filters.lineNumber]);

  const handleSelectChange = useCallback(
    (key: keyof TicketFilters) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFilterChange(key, e.target.value || undefined);
    },
    [onFilterChange]
  );

  const handleDateChange = useCallback(
    (key: "dateFrom" | "dateTo") => (e: React.ChangeEvent<HTMLInputElement>) => {
      onFilterChange(key, e.target.value || undefined);
    },
    [onFilterChange]
  );

  const handleClear = useCallback(() => {
    setLocalTicketId("");
    setLocalLineNumber("");
    onClearFilters();
  }, [onClearFilters]);

  return (
    <section className="bg-indigo-50 p-6 rounded-2xl shadow-xl border border-indigo-100 mb-8 transition-all duration-300">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 group"
        >
          <h2 className="text-2xl font-bold text-indigo-700 group-hover:text-indigo-900 transition-colors">
            Filtros
          </h2>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-indigo-600 rounded-full">
              {activeFilterCount}
            </span>
          )}
          <svg
            className={`w-5 h-5 text-indigo-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          {isLoading && (
            <div className="flex items-center gap-2 text-indigo-500 text-sm">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Cargando...
            </div>
          )}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              Limpiar filtros ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Contenido colapsable */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Estado */}
          <div className="flex flex-col gap-2">
            <label htmlFor="filter-status" className="block text-sm font-semibold text-indigo-700">
              Estado
            </label>
            <select
              id="filter-status"
              value={filters.status ?? ""}
              onChange={handleSelectChange("status")}
              className="w-full rounded-lg border border-indigo-200 p-2.5 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-colors"
            >
              <option value="">Todos</option>
              {(Object.keys(TICKET_STATUS_LABELS) as TicketStatus[]).map((status) => (
                <option key={status} value={status}>
                  {TICKET_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          {/* Prioridad */}
          <div className="flex flex-col gap-2">
            <label htmlFor="filter-priority" className="block text-sm font-semibold text-indigo-700">
              Prioridad
            </label>
            <select
              id="filter-priority"
              value={filters.priority ?? ""}
              onChange={handleSelectChange("priority")}
              className="w-full rounded-lg border border-indigo-200 p-2.5 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-colors"
            >
              <option value="">Todas</option>
              {(Object.keys(TICKET_PRIORITY_LABELS) as TicketPriority[]).map((priority) => (
                <option key={priority} value={priority}>
                  {TICKET_PRIORITY_LABELS[priority]}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Incidente */}
          <div className="flex flex-col gap-2">
            <label htmlFor="filter-type" className="block text-sm font-semibold text-indigo-700">
              Tipo de Incidente
            </label>
            <select
              id="filter-type"
              value={filters.type ?? ""}
              onChange={handleSelectChange("type")}
              className="w-full rounded-lg border border-indigo-200 p-2.5 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-colors"
            >
              <option value="">Todos</option>
              {(Object.keys(IncidentType) as (keyof typeof IncidentType)[]).map((key) => (
                <option key={IncidentType[key]} value={IncidentType[key]}>
                  {IncidentTypeLabels[IncidentType[key]]}
                </option>
              ))}
            </select>
          </div>

          {/* Rango de Fechas */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-indigo-700">
              Rango de Fechas
            </label>
            <div className="flex gap-2">
              <div className="flex flex-col flex-1">
                <label htmlFor="filter-date-from" className="sr-only">Fecha desde</label>
                <input
                  id="filter-date-from"
                  type="date"
                  value={filters.dateFrom ?? ""}
                  onChange={handleDateChange("dateFrom")}
                  max={filters.dateTo ?? undefined}
                  className="rounded-lg border border-indigo-200 p-2.5 w-full bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-colors"
                />
              </div>
              <span className="self-center text-indigo-400 font-medium">—</span>
              <div className="flex flex-col flex-1">
                <label htmlFor="filter-date-to" className="sr-only">Fecha hasta</label>
                <input
                  id="filter-date-to"
                  type="date"
                  value={filters.dateTo ?? ""}
                  onChange={handleDateChange("dateTo")}
                  min={filters.dateFrom ?? undefined}
                  className="rounded-lg border border-indigo-200 p-2.5 w-full bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Buscar por ID */}
          <div className="flex flex-col gap-2">
            <label htmlFor="filter-ticket-id" className="block text-sm font-semibold text-indigo-700">
              Buscar por ID
            </label>
            <div className="relative">
              <input
                id="filter-ticket-id"
                type="text"
                value={localTicketId}
                onChange={(e) => setLocalTicketId(e.target.value)}
                placeholder="Ej: TCK-1001"
                className="rounded-lg border border-indigo-200 p-2.5 w-full bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-colors pr-8"
              />
              {localTicketId && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalTicketId("");
                    onFilterChange("ticketId", undefined);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Limpiar búsqueda por ID"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Buscar por Línea */}
          <div className="flex flex-col gap-2">
            <label htmlFor="filter-line-number" className="block text-sm font-semibold text-indigo-700">
              Buscar por Línea
            </label>
            <div className="relative">
              <input
                id="filter-line-number"
                type="text"
                value={localLineNumber}
                onChange={(e) => setLocalLineNumber(e.target.value)}
                placeholder="Número de línea"
                className="rounded-lg border border-indigo-200 p-2.5 w-full bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-colors pr-8"
              />
              {localLineNumber && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalLineNumber("");
                    onFilterChange("lineNumber", undefined);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Limpiar búsqueda por línea"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Resumen de filtros activos */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-indigo-200">
            <span className="text-sm text-indigo-600 font-medium self-center">Activos:</span>
            {filters.status && (
              <FilterTag
                label={`Estado: ${TICKET_STATUS_LABELS[filters.status]}`}
                onRemove={() => onFilterChange("status", undefined)}
              />
            )}
            {filters.priority && (
              <FilterTag
                label={`Prioridad: ${TICKET_PRIORITY_LABELS[filters.priority]}`}
                onRemove={() => onFilterChange("priority", undefined)}
              />
            )}
            {filters.type && (
              <FilterTag
                label={`Tipo: ${IncidentTypeLabels[filters.type]}`}
                onRemove={() => onFilterChange("type", undefined)}
              />
            )}
            {filters.dateFrom && (
              <FilterTag
                label={`Desde: ${filters.dateFrom}`}
                onRemove={() => onFilterChange("dateFrom", undefined)}
              />
            )}
            {filters.dateTo && (
              <FilterTag
                label={`Hasta: ${filters.dateTo}`}
                onRemove={() => onFilterChange("dateTo", undefined)}
              />
            )}
            {filters.ticketId && (
              <FilterTag
                label={`ID: ${filters.ticketId}`}
                onRemove={() => {
                  setLocalTicketId("");
                  onFilterChange("ticketId", undefined);
                }}
              />
            )}
            {filters.lineNumber && (
              <FilterTag
                label={`Línea: ${filters.lineNumber}`}
                onRemove={() => {
                  setLocalLineNumber("");
                  onFilterChange("lineNumber", undefined);
                }}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

/** Chip para filtro activo individual con botón de remover */
const FilterTag: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 border border-indigo-200 rounded-full">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="ml-1 text-indigo-400 hover:text-indigo-700 transition-colors"
      aria-label={`Quitar filtro: ${label}`}
    >
      ✕
    </button>
  </span>
);

export default Filters;
