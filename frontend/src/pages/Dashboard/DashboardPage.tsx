import React from "react";
import TicketList from "./TicketList";
import Layout from "../../components/layout/Layout";
import Filters from "./Filters";
import Metrics from "./Metrics";
import { useDashboard } from "../../hooks/useDashboard";

const DashboardPage: React.FC = () => {
  const {
    tickets,
    pagination,
    filters,
    isLoading,
    error,
    updateFilter,
    clearFilters,
    setPage,
    refresh,
    activeFilterCount,
  } = useDashboard();

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Dashboard de Gestión de Tickets</h1>
        <button
          type="button"
          onClick={refresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-100 border border-indigo-200 rounded-lg hover:bg-indigo-200 disabled:opacity-50 transition-colors"
        >
          <svg
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Actualizar
        </button>
      </div>

      <Metrics />

      <Filters
        filters={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
        isLoading={isLoading}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={refresh}
            className="text-sm font-semibold text-red-600 hover:text-red-800 underline"
          >
            Reintentar
          </button>
        </div>
      )}

      <TicketList
        tickets={tickets}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={setPage}
      />
    </Layout>
  );
};

export default DashboardPage;
