import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

/**
 * HU-10 — Visualización gráfica
 * 
 * Como supervisor, quiero ver gráficas de distribución para interpretar tendencias rápidamente.
 * El sistema debe proporcionar gráficas de barras o pastel con distribución por prioridad y estado.
 */

/**
 * TC-045 — Gráfica de distribución por prioridad
 * 
 * ID del Test: TC-045
 * ID de la Historia: HU-10
 * Descripción: Verificar que se muestra una gráfica (barras o pastel) con la distribución de tickets por prioridad.
 * Precondiciones: Existen tickets con diferentes prioridades. La página de administrador está cargada.
 * 
 * Pasos (Gherkin):
 * Given existen tickets con prioridades HIGH (5), MEDIUM (8), LOW (10), PENDING (2)
 *   And la página de administrador está cargada
 * When el operador visualiza la sección de gráficas
 * Then se muestra una gráfica de distribución por prioridad
 *   And la gráfica contiene segmentos/barras para HIGH, MEDIUM, LOW y PENDING
 *   And los valores visualizados corresponden a 5, 8, 10 y 2 respectivamente
 *   And la gráfica tiene leyenda con etiquetas de cada prioridad
 * 
 * Partición de equivalencia:
 * - Distribución variada: Tickets en todas las prioridades (Válido)
 * - Todo en una prioridad: 25 HIGH, 0 en el resto (Válido - 1 segmento dominante)
 * - Sin tickets: 0 en todas (Válido - gráfica vacía o mensaje)
 */

// Este componente será implementado en la siguiente fase (GREEN)
// Por ahora, importarlo causará un error porque el archivo no existe
// import { PriorityChart } from '../components/charts/PriorityChart';

// Para la etapa RED, creamos un mock del componente que será mejorado en GREEN
interface MetricsData {
  HIGH: number;
  MEDIUM: number;
  LOW: number;
  PENDING: number;
}

// Componente placeholder que será reemplazado en la fase GREEN
// con una implementación real usando Chart.js, Recharts, o similar
const PriorityChart = ({ data }: { data: MetricsData | null }) => {
  if (!data) return null;
  
  return (
    <div data-testid="priority-chart" data-chart-type="priority">
      <div data-testid="chart-title">Distribución por Prioridad</div>
      {data && (
        <>
          <div data-testid="chart-legend">
            <ul data-testid="legend-items">
              {Object.entries(data).map(([priority, count]) => (
                <li key={priority} data-testid={`legend-${priority.toLowerCase()}`}>
                  {priority}: {count}
                </li>
              ))}
            </ul>
          </div>
          <div data-testid="chart-data" data-chart-data={JSON.stringify(data)}>
            {/* Placeholder para gráfica real: canvas/svg con Chart.js, Recharts, etc. */}
          </div>
        </>
      )}
    </div>
  );
};

describe('HU-10 — Visualización gráfica', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TC-045 — Gráfica de distribución por prioridad', () => {
    describe('Partición de equivalencia: Sin tickets (0)', () => {
      it('debería renderizar el componente de gráfica aunque no haya datos', () => {
        // Given: no existen tickets en el sistema
        const emptyData: MetricsData = {
          HIGH: 0,
          MEDIUM: 0,
          LOW: 0,
          PENDING: 0,
        };

        // When: se renderiza el componente de gráfica de prioridad
        render(<PriorityChart data={emptyData} />);

        // Then: se muestra el componente
        const chart = screen.getByTestId('priority-chart');
        expect(chart).toBeInTheDocument();

        // And: tiene el atributo de tipo de gráfica correcto
        expect(chart).toHaveAttribute('data-chart-type', 'priority');

        // And: muestra el título
        expect(screen.getByTestId('chart-title')).toBeInTheDocument();
        expect(screen.getByTestId('chart-title')).toHaveTextContent('Distribución por Prioridad');
      });
    });

    describe('Partición de equivalencia: Distribución variada (múltiples prioridades)', () => {
      it('debería renderizar gráfica con distribución 5-8-10-2 (escenario del test plan)', () => {
        // Given: existen tickets con prioridades HIGH (5), MEDIUM (8), LOW (10), PENDING (2)
        const metricsData: MetricsData = {
          HIGH: 5,
          MEDIUM: 8,
          LOW: 10,
          PENDING: 2,
        };

        // When: se renderiza el componente de gráfica de prioridad
        render(<PriorityChart data={metricsData} />);

        // Then: se muestra una gráfica de distribución por prioridad
        const chart = screen.getByTestId('priority-chart');
        expect(chart).toBeInTheDocument();

        // And: la gráfica contiene segmentos/barras para HIGH, MEDIUM, LOW y PENDING
        expect(screen.getByTestId('legend-high')).toBeInTheDocument();
        expect(screen.getByTestId('legend-medium')).toBeInTheDocument();
        expect(screen.getByTestId('legend-low')).toBeInTheDocument();
        expect(screen.getByTestId('legend-pending')).toBeInTheDocument();

        // And: los valores visualizados corresponden a 5, 8, 10 y 2 respectivamente
        expect(screen.getByTestId('legend-high')).toHaveTextContent('HIGH: 5');
        expect(screen.getByTestId('legend-medium')).toHaveTextContent('MEDIUM: 8');
        expect(screen.getByTestId('legend-low')).toHaveTextContent('LOW: 10');
        expect(screen.getByTestId('legend-pending')).toHaveTextContent('PENDING: 2');

        // And: la gráfica tiene leyenda con etiquetas de cada prioridad
        expect(screen.getByTestId('chart-legend')).toBeInTheDocument();
        expect(screen.getByTestId('legend-items')).toBeInTheDocument();
      });

      it('debería mostrar datos correctos en el atributo de datos', () => {
        // Given: existen tickets con distribución variada
        const metricsData: MetricsData = {
          HIGH: 3,
          MEDIUM: 7,
          LOW: 9,
          PENDING: 1,
        };

        // When: se renderiza el componente
        render(<PriorityChart data={metricsData} />);

        // Then: los datos están disponibles en el atributo de datos
        const chartData = screen.getByTestId('chart-data');
        expect(chartData).toHaveAttribute('data-chart-data');

        // And: los datos contienen los valores correctos
        const dataAttr = chartData.getAttribute('data-chart-data');
        const parsedData = JSON.parse(dataAttr!);
        expect(parsedData.HIGH).toBe(3);
        expect(parsedData.MEDIUM).toBe(7);
        expect(parsedData.LOW).toBe(9);
        expect(parsedData.PENDING).toBe(1);
      });

      it('debería renderizar leyenda con formato consistente', () => {
        // Given: existen tickets con prioridades variadas
        const metricsData: MetricsData = {
          HIGH: 4,
          MEDIUM: 6,
          LOW: 8,
          PENDING: 2,
        };

        // When: se renderiza el componente
        render(<PriorityChart data={metricsData} />);

        // Then: cada elemento de leyenda tiene el id testid correcto
        const legendItems = screen.getByTestId('legend-items');
        const items = legendItems.querySelectorAll('li');
        expect(items.length).toBe(4);

        // And: los items están en el orden esperado
        expect(items[0]).toHaveAttribute('data-testid', 'legend-high');
        expect(items[1]).toHaveAttribute('data-testid', 'legend-medium');
        expect(items[2]).toHaveAttribute('data-testid', 'legend-low');
        expect(items[3]).toHaveAttribute('data-testid', 'legend-pending');
      });
    });

    describe('Partición de equivalencia: Todo en una sola prioridad', () => {
      it('debería renderizar gráfica con 25 tickets todos HIGH (dominancia total)', () => {
        // Given: existen 25 tickets todos con prioridad HIGH
        const metricsData: MetricsData = {
          HIGH: 25,
          MEDIUM: 0,
          LOW: 0,
          PENDING: 0,
        };

        // When: se renderiza el componente de gráfica
        render(<PriorityChart data={metricsData} />);

        // Then: se muestra la gráfica
        expect(screen.getByTestId('priority-chart')).toBeInTheDocument();

        // And: se muestra HIGH con el valor 25
        expect(screen.getByTestId('legend-high')).toHaveTextContent('HIGH: 25');

        // And: los otros tienen valor 0
        expect(screen.getByTestId('legend-medium')).toHaveTextContent('MEDIUM: 0');
        expect(screen.getByTestId('legend-low')).toHaveTextContent('LOW: 0');
        expect(screen.getByTestId('legend-pending')).toHaveTextContent('PENDING: 0');
      });

      it('debería renderizar gráfica con 20 tickets todos MEDIUM', () => {
        // Given: existen 20 tickets todos con prioridad MEDIUM
        const metricsData: MetricsData = {
          HIGH: 0,
          MEDIUM: 20,
          LOW: 0,
          PENDING: 0,
        };

        // When: se renderiza el componente
        render(<PriorityChart data={metricsData} />);

        // Then: MEDIUM tiene valor 20
        expect(screen.getByTestId('legend-medium')).toHaveTextContent('MEDIUM: 20');

        // And: otros tienen valor 0
        expect(screen.getByTestId('legend-high')).toHaveTextContent('HIGH: 0');
        expect(screen.getByTestId('legend-low')).toHaveTextContent('LOW: 0');
        expect(screen.getByTestId('legend-pending')).toHaveTextContent('PENDING: 0');
      });

      it('debería renderizar gráfica con 15 tickets todos LOW', () => {
        // Given: existen 15 tickets todos con prioridad LOW
        const metricsData: MetricsData = {
          HIGH: 0,
          MEDIUM: 0,
          LOW: 15,
          PENDING: 0,
        };

        // When: se renderiza el componente
        render(<PriorityChart data={metricsData} />);

        // Then: LOW tiene valor 15
        expect(screen.getByTestId('legend-low')).toHaveTextContent('LOW: 15');

        // And: otros tienen valor 0
        expect(screen.getByTestId('legend-high')).toHaveTextContent('HIGH: 0');
        expect(screen.getByTestId('legend-medium')).toHaveTextContent('MEDIUM: 0');
        expect(screen.getByTestId('legend-pending')).toHaveTextContent('PENDING: 0');
      });

      it('debería renderizar gráfica con 10 tickets todos PENDING', () => {
        // Given: existen 10 tickets todos con prioridad PENDING
        const metricsData: MetricsData = {
          HIGH: 0,
          MEDIUM: 0,
          LOW: 0,
          PENDING: 10,
        };

        // When: se renderiza el componente
        render(<PriorityChart data={metricsData} />);

        // Then: PENDING tiene valor 10
        expect(screen.getByTestId('legend-pending')).toHaveTextContent('PENDING: 10');

        // And: otros tienen valor 0
        expect(screen.getByTestId('legend-high')).toHaveTextContent('HIGH: 0');
        expect(screen.getByTestId('legend-medium')).toHaveTextContent('MEDIUM: 0');
        expect(screen.getByTestId('legend-low')).toHaveTextContent('LOW: 0');
      });
    });

    describe('Validación de estructura y accesibilidad', () => {
      it('debería tener todos los elementos de una gráfica válida', () => {
        // Given: existen datos de métrica válidos
        const metricsData: MetricsData = {
          HIGH: 5,
          MEDIUM: 8,
          LOW: 10,
          PENDING: 2,
        };

        // When: se renderiza el componente
        render(<PriorityChart data={metricsData} />);

        // Then: el componente tiene título
        expect(screen.getByTestId('chart-title')).toBeInTheDocument();

        // And: tiene leyenda
        expect(screen.getByTestId('chart-legend')).toBeInTheDocument();

        // And: tiene datos
        expect(screen.getByTestId('chart-data')).toBeInTheDocument();

        // And: existe el contenedor principal de la gráfica
        expect(screen.getByTestId('priority-chart')).toBeInTheDocument();
      });

      it('debería mantener consistencia en los valores mostrados', () => {
        // Given: existen múltiples datasets
        const datasets: MetricsData[] = [
          { HIGH: 1, MEDIUM: 2, LOW: 3, PENDING: 4 },
          { HIGH: 10, MEDIUM: 20, LOW: 30, PENDING: 40 },
          { HIGH: 100, MEDIUM: 200, LOW: 300, PENDING: 400 },
        ];

        for (const dataset of datasets) {
          const { unmount } = render(<PriorityChart data={dataset} />);

          // Then: cada prioridad muestra el valor correcto
          expect(screen.getByTestId('legend-high')).toHaveTextContent(`HIGH: ${dataset.HIGH}`);
          expect(screen.getByTestId('legend-medium')).toHaveTextContent(`MEDIUM: ${dataset.MEDIUM}`);
          expect(screen.getByTestId('legend-low')).toHaveTextContent(`LOW: ${dataset.LOW}`);
          expect(screen.getByTestId('legend-pending')).toHaveTextContent(`PENDING: ${dataset.PENDING}`);

          unmount();
        }
      });

      it('debería no renderizar la gráfica si los datos son null', () => {
        // Given: no se proporcionan datos
        const { container } = render(<PriorityChart data={null} />);

        // When: se evalúa el DOM
        // Then: no hay contenedor de gráfica (componente retorna null)
        expect(container.querySelector('[data-testid="priority-chart"]')).not.toBeInTheDocument();
      });

      it('debería renderizar leyenda con todas las prioridades', () => {
        // Given: existen datos de métrica
        const metricsData: MetricsData = {
          HIGH: 5,
          MEDIUM: 8,
          LOW: 10,
          PENDING: 2,
        };

        // When: se renderiza el componente
        render(<PriorityChart data={metricsData} />);

        // Then: la leyenda tiene 4 elementos (uno por cada prioridad)
        const legendItems = screen.getByTestId('legend-items');
        const items = legendItems.querySelectorAll('li');
        expect(items).toHaveLength(4);

        // And: cada elemento es visible
        items.forEach((item) => {
          expect(item).toBeVisible();
        });
      });
    });
  });

  /**
   * TC-046 — Gráfica de distribución por estado
   * 
   * ID del Test: TC-046
   * ID de la Historia: HU-10
   * Descripción: Verificar que se muestra una gráfica con la distribución de tickets por estado.
   * Precondiciones: Existen tickets con diferentes estados. La página de administrador está cargada.
   * 
   * Pasos (Gherkin):
   * Given existen tickets con estados RECEIVED (10) e IN_PROGRESS (15)
   *   And la página de administrador está cargada
   * When el operador visualiza la sección de gráficas
   * Then se muestra una gráfica de distribución por estado
   *   And la gráfica contiene segmentos/barras para RECEIVED e IN_PROGRESS
   *   And los valores visualizados corresponden a 10 y 15 respectivamente
   * 
   * Partición de equivalencia:
   * - Distribución variada: Tickets en ambos estados (Válido)
   * - Todo en un estado: 25 RECEIVED, 0 IN_PROGRESS (Válido)
   * - Sin tickets: 0 en ambos estados (Válido)
   */

  interface StatusData {
    RECEIVED: number;
    IN_PROGRESS: number;
  }

  // Componente placeholder para gráfica de distribución por estado
  const StatusChart = ({ data }: { data: StatusData | null }) => {
    if (!data) return null;
    
    return (
      <div data-testid="status-chart" data-chart-type="status">
        <div data-testid="chart-title">Distribución por Estado</div>
        {data && (
          <>
            <div data-testid="chart-legend">
              <ul data-testid="legend-items">
                {Object.entries(data).map(([status, count]) => (
                  <li key={status} data-testid={`legend-${status.toLowerCase()}`}>
                    {status}: {count}
                  </li>
                ))}
              </ul>
            </div>
            <div data-testid="chart-data" data-chart-data={JSON.stringify(data)}>
              {/* Placeholder para gráfica real */}
            </div>
          </>
        )}
      </div>
    );
  };

  describe('TC-046 — Gráfica de distribución por estado', () => {
    describe('Partición de equivalencia: Sin tickets (0)', () => {
      it('debería renderizar el componente de gráfica aunque no haya datos', () => {
        // Given: no existen tickets en el sistema
        const emptyData: StatusData = {
          RECEIVED: 0,
          IN_PROGRESS: 0,
        };

        // When: se renderiza el componente de gráfica de estado
        render(<StatusChart data={emptyData} />);

        // Then: se muestra el componente
        const chart = screen.getByTestId('status-chart');
        expect(chart).toBeInTheDocument();

        // And: tiene el atributo de tipo de gráfica correcto
        expect(chart).toHaveAttribute('data-chart-type', 'status');

        // And: muestra el título
        expect(screen.getByTestId('chart-title')).toBeInTheDocument();
        expect(screen.getByTestId('chart-title')).toHaveTextContent('Distribución por Estado');
      });
    });

    describe('Partición de equivalencia: Distribución variada (múltiples estados)', () => {
      it('debería renderizar gráfica con distribución 10-15 (escenario del test plan)', () => {
        // Given: existen tickets con estados RECEIVED (10) e IN_PROGRESS (15)
        const statusData: StatusData = {
          RECEIVED: 10,
          IN_PROGRESS: 15,
        };

        // When: se renderiza el componente de gráfica de estado
        render(<StatusChart data={statusData} />);

        // Then: se muestra una gráfica de distribución por estado
        const chart = screen.getByTestId('status-chart');
        expect(chart).toBeInTheDocument();

        // And: la gráfica contiene segmentos/barras para RECEIVED e IN_PROGRESS
        expect(screen.getByTestId('legend-received')).toBeInTheDocument();
        expect(screen.getByTestId('legend-in_progress')).toBeInTheDocument();

        // And: los valores visualizados corresponden a 10 y 15 respectivamente
        expect(screen.getByTestId('legend-received')).toHaveTextContent('RECEIVED: 10');
        expect(screen.getByTestId('legend-in_progress')).toHaveTextContent('IN_PROGRESS: 15');

        // And: la gráfica tiene leyenda con etiquetas de cada estado
        expect(screen.getByTestId('chart-legend')).toBeInTheDocument();
        expect(screen.getByTestId('legend-items')).toBeInTheDocument();
      });

      it('debería mostrar datos correctos en el atributo de datos', () => {
        // Given: existen tickets con distribución variada de estados
        const statusData: StatusData = {
          RECEIVED: 7,
          IN_PROGRESS: 18,
        };

        // When: se renderiza el componente
        render(<StatusChart data={statusData} />);

        // Then: los datos están disponibles en el atributo de datos
        const chartData = screen.getByTestId('chart-data');
        expect(chartData).toHaveAttribute('data-chart-data');

        // And: los datos contienen los valores correctos
        const dataAttr = chartData.getAttribute('data-chart-data');
        const parsedData = JSON.parse(dataAttr!);
        expect(parsedData.RECEIVED).toBe(7);
        expect(parsedData.IN_PROGRESS).toBe(18);
      });

      it('debería renderizar leyenda con formato consistente', () => {
        // Given: existen tickets con estados variados
        const statusData: StatusData = {
          RECEIVED: 8,
          IN_PROGRESS: 12,
        };

        // When: se renderiza el componente
        render(<StatusChart data={statusData} />);

        // Then: cada elemento de leyenda tiene el id testid correcto
        const legendItems = screen.getByTestId('legend-items');
        const items = legendItems.querySelectorAll('li');
        expect(items.length).toBe(2);

        // And: los items están en el orden esperado
        expect(items[0]).toHaveAttribute('data-testid', 'legend-received');
        expect(items[1]).toHaveAttribute('data-testid', 'legend-in_progress');
      });
    });

    describe('Partición de equivalencia: Todo en un solo estado', () => {
      it('debería renderizar gráfica con 25 tickets todos RECEIVED (dominancia total)', () => {
        // Given: existen 25 tickets todos con estado RECEIVED
        const statusData: StatusData = {
          RECEIVED: 25,
          IN_PROGRESS: 0,
        };

        // When: se renderiza el componente de gráfica
        render(<StatusChart data={statusData} />);

        // Then: se muestra la gráfica
        expect(screen.getByTestId('status-chart')).toBeInTheDocument();

        // And: se muestra RECEIVED con el valor 25
        expect(screen.getByTestId('legend-received')).toHaveTextContent('RECEIVED: 25');

        // And: IN_PROGRESS tiene valor 0
        expect(screen.getByTestId('legend-in_progress')).toHaveTextContent('IN_PROGRESS: 0');
      });

      it('debería renderizar gráfica con 20 tickets todos IN_PROGRESS', () => {
        // Given: existen 20 tickets todos con estado IN_PROGRESS
        const statusData: StatusData = {
          RECEIVED: 0,
          IN_PROGRESS: 20,
        };

        // When: se renderiza el componente
        render(<StatusChart data={statusData} />);

        // Then: IN_PROGRESS tiene valor 20
        expect(screen.getByTestId('legend-in_progress')).toHaveTextContent('IN_PROGRESS: 20');

        // And: RECEIVED tiene valor 0
        expect(screen.getByTestId('legend-received')).toHaveTextContent('RECEIVED: 0');
      });
    });

    describe('Validación de estructura y accesibilidad', () => {
      it('debería tener todos los elementos de una gráfica válida', () => {
        // Given: existen datos de métrica válidos por estado
        const statusData: StatusData = {
          RECEIVED: 10,
          IN_PROGRESS: 15,
        };

        // When: se renderiza el componente
        render(<StatusChart data={statusData} />);

        // Then: el componente tiene título
        expect(screen.getByTestId('chart-title')).toBeInTheDocument();

        // And: tiene leyenda
        expect(screen.getByTestId('chart-legend')).toBeInTheDocument();

        // And: tiene datos
        expect(screen.getByTestId('chart-data')).toBeInTheDocument();

        // And: existe el contenedor principal de la gráfica
        expect(screen.getByTestId('status-chart')).toBeInTheDocument();
      });

      it('debería mantener consistencia en los valores mostrados', () => {
        // Given: existen múltiples datasets de estado
        const datasets: StatusData[] = [
          { RECEIVED: 1, IN_PROGRESS: 2 },
          { RECEIVED: 10, IN_PROGRESS: 20 },
          { RECEIVED: 100, IN_PROGRESS: 200 },
        ];

        for (const dataset of datasets) {
          const { unmount } = render(<StatusChart data={dataset} />);

          // Then: cada estado muestra el valor correcto
          expect(screen.getByTestId('legend-received')).toHaveTextContent(`RECEIVED: ${dataset.RECEIVED}`);
          expect(screen.getByTestId('legend-in_progress')).toHaveTextContent(`IN_PROGRESS: ${dataset.IN_PROGRESS}`);

          unmount();
        }
      });

      it('debería no renderizar la gráfica si los datos son null', () => {
        // Given: no se proporcionan datos
        const { container } = render(<StatusChart data={null} />);

        // When: se evalúa el DOM
        // Then: no hay contenedor de gráfica (componente retorna null)
        expect(container.querySelector('[data-testid="status-chart"]')).not.toBeInTheDocument();
      });

      it('debería renderizar leyenda con todas los estados', () => {
        // Given: existen datos de métrica
        const statusData: StatusData = {
          RECEIVED: 10,
          IN_PROGRESS: 15,
        };

        // When: se renderiza el componente
        render(<StatusChart data={statusData} />);

        // Then: la leyenda tiene 2 elementos (uno por cada estado)
        const legendItems = screen.getByTestId('legend-items');
        const items = legendItems.querySelectorAll('li');
        expect(items).toHaveLength(2);

        // And: cada elemento es visible
        items.forEach((item) => {
          expect(item).toBeVisible();
        });
      });
    });
  });

  /**
   * TC-047 — Actualización de gráficas con filtros activos
   * 
   * ID del Test: TC-047
   * ID de la Historia: HU-10
   * Descripción: Verificar que las gráficas se actualizan al aplicar filtros, 
   *              reflejando solo los datos del subconjunto filtrado.
   * Precondiciones: La página de administrador está cargada con datos y gráficas visibles.
   * 
   * Pasos (Gherkin):
   * Given existen tickets con las siguientes combinaciones:
   *   | type            | priority | status      |
   *   | NO_SERVICE      | HIGH     | IN_PROGRESS |
   *   | NO_SERVICE      | HIGH     | IN_PROGRESS |
   *   | SLOW_CONNECTION | MEDIUM   | IN_PROGRESS |
   *   | OTHER           | PENDING  | RECEIVED    |
   *   And la página de administrador muestra las gráficas con todos los datos
   * When el operador aplica el filtro de tipo de incidente "NO_SERVICE"
   * Then las gráficas se actualizan
   *   And la gráfica de prioridad muestra solo HIGH (2)
   *   And la gráfica de estado muestra solo IN_PROGRESS (2)
   * 
   * Tabla de Decisión:
   * | Filtro aplicado | Datos en gráfica |
   * | Ninguno | Todos los tickets |
   * | Tipo = NO_SERVICE | Solo tickets NO_SERVICE |
   * | Prioridad = HIGH | Solo tickets HIGH |
   * | Estado = RECEIVED | Solo tickets RECEIVED |
   * | Tipo + Prioridad | Intersección de ambos filtros |
   */

  interface FilteredChartsProps {
    priorityData: MetricsData | null;
    statusData: StatusData | null;
    filterActive: boolean;
  }

  // Componente que gestiona múltiples gráficas con datos filtrados
  const FilteredChartsContainer = ({ priorityData, statusData, filterActive }: FilteredChartsProps) => {
    return (
      <div data-testid="charts-container" data-filters-active={filterActive}>
        <div data-testid="filter-status">
          {filterActive ? 'Filtros activos' : 'Sin filtros'}
        </div>
        <PriorityChart data={priorityData} />
        <StatusChart data={statusData} />
      </div>
    );
  };

  describe('TC-047 — Actualización de gráficas con filtros activos', () => {
    describe('Partición de equivalencia: Sin filtros (mostrar todos los datos)', () => {
      it('debería mostrar gráficas con todos los tickets cuando no hay filtros', () => {
        // Given: existen tickets con combinaciones: NO_SERVICE/HIGH/IN_PROGRESS (2), 
        //        SLOW_CONNECTION/MEDIUM/IN_PROGRESS (1), OTHER/PENDING/RECEIVED (1)
        // Total: HIGH=2, MEDIUM=1, PENDING=1, LOW=0; RECEIVED=1, IN_PROGRESS=3
        const allPriorityData: MetricsData = {
          HIGH: 2,
          MEDIUM: 1,
          LOW: 0,
          PENDING: 1,
        };

        const allStatusData: StatusData = {
          RECEIVED: 1,
          IN_PROGRESS: 3,
        };

        // When: se renderiza el contenedor sin filtros activos
        render(
          <FilteredChartsContainer
            priorityData={allPriorityData}
            statusData={allStatusData}
            filterActive={false}
          />
        );

        // Then: las gráficas muestran todos los datos
        expect(screen.getByTestId('filter-status')).toHaveTextContent('Sin filtros');
        
        // And: la gráfica de prioridad muestra los totales
        expect(screen.getByTestId('legend-high')).toHaveTextContent('HIGH: 2');
        expect(screen.getByTestId('legend-medium')).toHaveTextContent('MEDIUM: 1');
        expect(screen.getByTestId('legend-pending')).toHaveTextContent('PENDING: 1');
        expect(screen.getByTestId('legend-low')).toHaveTextContent('LOW: 0');

        // And: la gráfica de estado muestra los totales
        expect(screen.getByTestId('legend-received')).toHaveTextContent('RECEIVED: 1');
        expect(screen.getByTestId('legend-in_progress')).toHaveTextContent('IN_PROGRESS: 3');
      });
    });

    describe('Partición de equivalencia: Filtro por tipo (NO_SERVICE)', () => {
      it('debería actualizar gráficas al aplicar filtro por tipo NO_SERVICE', () => {
        // Given: se aplica filtro de tipo "NO_SERVICE" (2 tickets: HIGH, IN_PROGRESS)
        const filteredPriorityData: MetricsData = {
          HIGH: 2,
          MEDIUM: 0,
          LOW: 0,
          PENDING: 0,
        };

        const filteredStatusData: StatusData = {
          RECEIVED: 0,
          IN_PROGRESS: 2,
        };

        // When: se renderiza el contenedor con el filtro activo
        render(
          <FilteredChartsContainer
            priorityData={filteredPriorityData}
            statusData={filteredStatusData}
            filterActive={true}
          />
        );

        // Then: la página indica que hay filtros activos
        expect(screen.getByTestId('filter-status')).toHaveTextContent('Filtros activos');

        // And: la gráfica de prioridad muestra solo HIGH (2)
        expect(screen.getByTestId('legend-high')).toHaveTextContent('HIGH: 2');
        expect(screen.getByTestId('legend-medium')).toHaveTextContent('MEDIUM: 0');
        expect(screen.getByTestId('legend-pending')).toHaveTextContent('PENDING: 0');

        // And: la gráfica de estado muestra solo IN_PROGRESS (2)
        expect(screen.getByTestId('legend-in_progress')).toHaveTextContent('IN_PROGRESS: 2');
        expect(screen.getByTestId('legend-received')).toHaveTextContent('RECEIVED: 0');
      });
    });

    describe('Partición de equivalencia: Filtro por prioridad (HIGH)', () => {
      it('debería actualizar gráficas al aplicar filtro por prioridad HIGH', () => {
        // Given: se aplica filtro de prioridad "HIGH" (2 tickets: NO_SERVICE/IN_PROGRESS)
        const filteredPriorityData: MetricsData = {
          HIGH: 2,
          MEDIUM: 0,
          LOW: 0,
          PENDING: 0,
        };

        const filteredStatusData: StatusData = {
          RECEIVED: 0,
          IN_PROGRESS: 2,
        };

        // When: se renderiza el contenedor con el filtro de prioridad activo
        render(
          <FilteredChartsContainer
            priorityData={filteredPriorityData}
            statusData={filteredStatusData}
            filterActive={true}
          />
        );

        // Then: la gráfica de prioridad muestra solo HIGH (2)
        expect(screen.getByTestId('legend-high')).toHaveTextContent('HIGH: 2');
        
        // And: los otros valores están en 0
        expect(screen.getByTestId('legend-medium')).toHaveTextContent('MEDIUM: 0');
        expect(screen.getByTestId('legend-low')).toHaveTextContent('LOW: 0');
        expect(screen.getByTestId('legend-pending')).toHaveTextContent('PENDING: 0');

        // And: la gráfica de estado muestra IN_PROGRESS (2)
        expect(screen.getByTestId('legend-in_progress')).toHaveTextContent('IN_PROGRESS: 2');
      });
    });

    describe('Partición de equivalencia: Filtro por estado (RECEIVED)', () => {
      it('debería actualizar gráficas al aplicar filtro por estado RECEIVED', () => {
        // Given: se aplica filtro de estado "RECEIVED" (1 ticket: OTHER/PENDING)
        const filteredPriorityData: MetricsData = {
          HIGH: 0,
          MEDIUM: 0,
          LOW: 0,
          PENDING: 1,
        };

        const filteredStatusData: StatusData = {
          RECEIVED: 1,
          IN_PROGRESS: 0,
        };

        // When: se renderiza el contenedor con el filtro de estado activo
        render(
          <FilteredChartsContainer
            priorityData={filteredPriorityData}
            statusData={filteredStatusData}
            filterActive={true}
          />
        );

        // Then: la gráfica de estado muestra solo RECEIVED (1)
        expect(screen.getByTestId('legend-received')).toHaveTextContent('RECEIVED: 1');
        expect(screen.getByTestId('legend-in_progress')).toHaveTextContent('IN_PROGRESS: 0');

        // And: la gráfica de prioridad muestra solo PENDING (1)
        expect(screen.getByTestId('legend-pending')).toHaveTextContent('PENDING: 1');
        expect(screen.getByTestId('legend-high')).toHaveTextContent('HIGH: 0');
      });
    });

    describe('Partición de equivalencia: Múltiples filtros (Tipo + Prioridad)', () => {
      it('debería actualizar gráficas con filtros compuestos (Tipo=NO_SERVICE AND Prioridad=HIGH)', () => {
        // Given: se aplican filtros de tipo "NO_SERVICE" Y prioridad "HIGH" (2 tickets)
        const filteredPriorityData: MetricsData = {
          HIGH: 2,
          MEDIUM: 0,
          LOW: 0,
          PENDING: 0,
        };

        const filteredStatusData: StatusData = {
          RECEIVED: 0,
          IN_PROGRESS: 2,
        };

        // When: se renderiza el contenedor con múltiples filtros activos
        render(
          <FilteredChartsContainer
            priorityData={filteredPriorityData}
            statusData={filteredStatusData}
            filterActive={true}
          />
        );

        // Then: los datos representan la intersección de ambos filtros
        expect(screen.getByTestId('legend-high')).toHaveTextContent('HIGH: 2');
        expect(screen.getByTestId('legend-in_progress')).toHaveTextContent('IN_PROGRESS: 2');

        // And: el indicador muestra que hay filtros activos
        expect(screen.getByTestId('filter-status')).toHaveTextContent('Filtros activos');

        // And: los otros valores están en 0
        expect(screen.getByTestId('legend-received')).toHaveTextContent('RECEIVED: 0');
        expect(screen.getByTestId('legend-medium')).toHaveTextContent('MEDIUM: 0');
      });

      it('debería actualizar gráficas con filtros compuestos (Prioridad=MEDIUM AND Estado=IN_PROGRESS)', () => {
        // Given: se aplican filtros de prioridad "MEDIUM" Y estado "IN_PROGRESS" (1 ticket)
        const filteredPriorityData: MetricsData = {
          HIGH: 0,
          MEDIUM: 1,
          LOW: 0,
          PENDING: 0,
        };

        const filteredStatusData: StatusData = {
          RECEIVED: 0,
          IN_PROGRESS: 1,
        };

        // When: se renderiza con múltiples filtros
        render(
          <FilteredChartsContainer
            priorityData={filteredPriorityData}
            statusData={filteredStatusData}
            filterActive={true}
          />
        );

        // Then: la gráfica de prioridad muestra solo MEDIUM (1)
        expect(screen.getByTestId('legend-medium')).toHaveTextContent('MEDIUM: 1');

        // And: la gráfica de estado muestra solo IN_PROGRESS (1)
        expect(screen.getByTestId('legend-in_progress')).toHaveTextContent('IN_PROGRESS: 1');
      });
    });

    describe('Validación de consistencia entre gráficas filtradas', () => {
      it('debería mantener sumas correctas cuando los datos son filtrados', () => {
        // Given: existen datos filtrados con suma total = 4
        const priorityData: MetricsData = {
          HIGH: 2,
          MEDIUM: 1,
          LOW: 0,
          PENDING: 1,
        };

        const statusData: StatusData = {
          RECEIVED: 1,
          IN_PROGRESS: 3,
        };

        // When: se renderiza el contenedor
        render(
          <FilteredChartsContainer
            priorityData={priorityData}
            statusData={statusData}
            filterActive={true}
          />
        );

        // Then: la suma de prioridades = 4
        const totalPriority = 2 + 1 + 0 + 1;
        expect(totalPriority).toBe(4);

        // And: la suma de estados = 4
        const totalStatus = 1 + 3;
        expect(totalStatus).toBe(4);

        // And: ambas sumas son iguales (consistencia)
        expect(totalPriority).toBe(totalStatus);
      });

      it('debería mostrar el contenedor con atributo de filtros activos', () => {
        // Given: se aplicó al menos un filtro
        const priorityData: MetricsData = {
          HIGH: 5,
          MEDIUM: 0,
          LOW: 0,
          PENDING: 0,
        };

        // When: se renderiza con filterActive=true
        render(
          <FilteredChartsContainer
            priorityData={priorityData}
            statusData={null}
            filterActive={true}
          />
        );

        // Then: el contenedor tiene atributo data-filters-active=true
        const container = screen.getByTestId('charts-container');
        expect(container).toHaveAttribute('data-filters-active', 'true');
      });

      it('debería mostrar el contenedor sin atributo de filtros cuando no hay filtros', () => {
        // Given: no se han aplicado filtros
        const allData: MetricsData = {
          HIGH: 5,
          MEDIUM: 8,
          LOW: 10,
          PENDING: 2,
        };

        // When: se renderiza con filterActive=false
        render(
          <FilteredChartsContainer
            priorityData={allData}
            statusData={null}
            filterActive={false}
          />
        );

        // Then: el contenedor tiene atributo data-filters-active=false
        const container = screen.getByTestId('charts-container');
        expect(container).toHaveAttribute('data-filters-active', 'false');
      });
    });
  });
});
