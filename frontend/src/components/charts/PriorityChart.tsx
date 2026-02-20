import { memo, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { MetricsData } from './types';

/**
 * PriorityChart — Componente de gráfica de distribución por prioridad
 * 
 * Renderiza una gráfica que muestra la distribución de tickets por nivel de prioridad
 * (HIGH, MEDIUM, LOW, PENDING).
 * 
 * Props:
 * - data: MetricsData | null - Objeto con conteos por prioridad
 * - title: string - Título de la gráfica (default: "Distribución por Prioridad")
 * - showLegend: boolean - Mostrar leyenda (default: true)
 * 
 * Patrón: Componente presentacional memoizado para optimizar re-renders
 */

interface PriorityChartProps {
  data: MetricsData | null;
  title?: string;
  showLegend?: boolean;
}

/**
 * Renderiza los items de la leyenda
 * Extraído a función auxiliar para mejorar legibilidad y mantenibilidad
 */
const renderLegendItems = (data: MetricsData): ReactNode[] => {
  return Object.entries(data).map(([priority, count]) => (
    <li 
      key={priority} 
      data-testid={`legend-${priority.toLowerCase()}`}
    >
      {priority}: {count}
    </li>
  ));
};

/**
 * Componente PriorityChart
 * 
 * Características:
 * - Renderiza null si no hay datos (patrón de componentes presentacionales)
 * - Leyenda con etiquetas y valores
 * - Datos disponibles en atributo data-testid para integración con charting libraries
 * - Memoizado para evitar re-renders innecesarios
 */
const PriorityChart = memo<PriorityChartProps>(
  ({ 
    data, 
    title = 'Distribución por Prioridad',
    showLegend = true 
  }) => {
    if (!data) return null;

    // Calcular suma total para validación de consistencia
    const totalCount = useMemo(
      () => Object.values(data).reduce((acc, val) => acc + val, 0),
      [data]
    );

    return (
      <div 
        data-testid="priority-chart" 
        data-chart-type="priority"
        role="figure"
        aria-label={title}
      >
        <div data-testid="chart-title" role="heading" aria-level={2}>
          {title}
        </div>

        {showLegend && (
          <div data-testid="chart-legend" role="list">
            <ul data-testid="legend-items">
              {renderLegendItems(data)}
            </ul>
            <div 
              data-testid="chart-total" 
              style={{ marginTop: '0.5rem', fontWeight: 'bold' }}
            >
              Total: {totalCount}
            </div>
          </div>
        )}

        <div 
          data-testid="chart-data" 
          data-chart-data={JSON.stringify(data)}
          role="img"
          aria-label={`Gráfica con valores: ${Object.entries(data)
            .map(([key, val]) => `${key} ${val}`)
            .join(', ')}`}
        >
          {/* Placeholder para gráfica real: canvas/svg con Chart.js, Recharts, etc. */}
        </div>
      </div>
    );
  }
);

PriorityChart.displayName = 'PriorityChart';

export default PriorityChart;
