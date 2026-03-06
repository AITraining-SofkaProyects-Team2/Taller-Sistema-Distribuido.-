import { memo } from 'react';
import PriorityChart from './PriorityChart';
import StatusChart from './StatusChart';
import type { MetricsData, StatusData, FilteredChartsContainerProps } from './types';

/**
 * FilteredChartsContainer — Componente contenedor de gráficas filtradas
 * 
 * Compone y gestiona dos gráficas (prioridad y estado) con soporte para filtros.
 * 
 * Responsabilidades:
 * - Renderizar ambas gráficas (PriorityChart y StatusChart)
 * - Indicar visualmente si hay filtros activos
 * - Mantener consistencia entre los datos mostrados
 * 
 * Props:
 * - priorityData: MetricsData | null - Datos agrupados por prioridad
 * - statusData: StatusData | null - Datos agrupados por estado
 * - filterActive: boolean - Indica si hay filtros limitando los datos
 * 
 * Patrón: Componente contenedor (Smart Component) memoizado
 */

/**
 * Renderiza el indicador de estado de filtros
 */
const renderFilterStatus = (filterActive: boolean): string => {
  return filterActive ? 'Filtros activos' : 'Sin filtros';
};

/**
 * Valida que la suma de tickets sea consistente entre ambas distribuciones
 */
const validateMetricsConsistency = (
  priorityData: MetricsData | null,
  statusData: StatusData | null
): boolean => {
  if (!priorityData || !statusData) return true;

  const priorityTotal = Object.values(priorityData).reduce((acc, val) => acc + val, 0);
  const statusTotal = Object.values(statusData).reduce((acc, val) => acc + val, 0);

  return priorityTotal === statusTotal;
};

/**
 * Componente FilteredChartsContainer
 * 
 * Características:
 * - Composición de múltiples gráficas
 * - Indicador de filtros activos
 * - Validación de consistencia de datos
 * - Memoizado para optimizar renders
 * - Estructura semántica con roles ARIA
 */
const FilteredChartsContainer = memo<FilteredChartsContainerProps>(
  ({ priorityData, statusData, filterActive }) => {
    // Validar consistencia de datos
    const isConsistent = validateMetricsConsistency(priorityData, statusData);

    if (!priorityData && !statusData) {
      return (
        <div 
          data-testid="charts-container" 
          data-filters-active={filterActive}
          role="region"
          aria-label="Contenedor de gráficas de métricas"
        >
          <div data-testid="filter-status">Sin datos disponibles</div>
        </div>
      );
    }

    return (
      <div 
        data-testid="charts-container" 
        data-filters-active={filterActive}
        role="region"
        aria-label="Contenedor de gráficas de métricas"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          padding: '1rem',
          border: filterActive ? '2px solid var(--primary-color, #3b82f6)' : '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          backgroundColor: filterActive ? 'var(--primary-50, #eff6ff)' : 'transparent',
        }}
      >
        {/* Indicador de estado de filtros */}
        <div 
          data-testid="filter-status"
          role="status"
          aria-live="polite"
          style={{
            gridColumn: '1 / -1',
            padding: '0.5rem 1rem',
            backgroundColor: filterActive ? 'var(--primary-100, #dbeafe)' : '#f9fafb',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {renderFilterStatus(filterActive)}
        </div>

        {/* Indicador de error si hay inconsistencia */}
        {!isConsistent && (
          <div 
            role="alert"
            style={{
              gridColumn: '1 / -1',
              padding: '0.75rem 1rem',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: '0.25rem',
              fontSize: '0.85rem',
            }}
          >
            ⚠️ Advertencia: Inconsistencia detectada en métricas. Las sumas no coinciden.
          </div>
        )}

        {/* Gráfica de prioridad */}
        {priorityData && (
          <div style={{ minWidth: 0 }}>
            <PriorityChart data={priorityData} showLegend={true} />
          </div>
        )}

        {/* Gráfica de estado */}
        {statusData && (
          <div style={{ minWidth: 0 }}>
            <StatusChart data={statusData} showLegend={true} />
          </div>
        )}
      </div>
    );
  }
);

FilteredChartsContainer.displayName = 'FilteredChartsContainer';

export default FilteredChartsContainer;
