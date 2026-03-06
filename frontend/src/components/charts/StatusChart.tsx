import { memo, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { StatusData } from './types';

/**
 * StatusChart — Componente de gráfica de distribución por estado
 * 
 * Renderiza una gráfica que muestra la distribución de tickets por estado de ciclo de vida
 * (RECEIVED, IN_PROGRESS).
 * 
 * Props:
 * - data: StatusData | null - Objeto con conteos por estado
 * - title: string - Título de la gráfica (default: "Distribución por Estado")
 * - showLegend: boolean - Mostrar leyenda (default: true)
 * 
 * Patrón: Componente presentacional memoizado para optimizar re-renders
 */

interface StatusChartProps {
  data: StatusData | null;
  title?: string;
  showLegend?: boolean;
}

/**
 * Renderiza los items de la leyenda
 * Extraído a función auxiliar para mejorar legibilidad
 */
const renderStatusLegendItems = (data: StatusData): ReactNode[] => {
  return Object.entries(data).map(([status, count]) => (
    <li 
      key={status} 
      data-testid={`legend-${status.toLowerCase()}`}
    >
      {status}: {count}
    </li>
  ));
};

/**
 * Componente StatusChart
 * 
 * Características:
 * - Renderiza null si no hay datos
 * - Leyenda con etiquetas de estado y valores numéricos
 * - Datos disponibles en atributo data-testid para charting libraries
 * - Memoizado para optimizar renders
 * - Atributos de accesibilidad ARIA
 */
const StatusChart = memo<StatusChartProps>(
  ({ 
    data, 
    title = 'Distribución por Estado',
    showLegend = true 
  }) => {
    if (!data) return null;

    // Calcular suma total para validación
    const totalCount = useMemo(
      () => Object.values(data).reduce((acc, val) => acc + val, 0),
      [data]
    );

    return (
      <div 
        data-testid="status-chart" 
        data-chart-type="status"
        role="figure"
        aria-label={title}
      >
        <div data-testid="chart-title" role="heading" aria-level={2}>
          {title}
        </div>

        {showLegend && (
          <div data-testid="chart-legend" role="list">
            <ul data-testid="legend-items">
              {renderStatusLegendItems(data)}
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

StatusChart.displayName = 'StatusChart';

export default StatusChart;
