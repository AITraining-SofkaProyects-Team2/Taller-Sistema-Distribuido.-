/**
 * tipos para componentes de gráficas
 * 
 * Define las estructuras de datos que usan los componentes de visualización
 */

export interface MetricsData {
  HIGH: number;
  MEDIUM: number;
  LOW: number;
  PENDING: number;
}

export interface StatusData {
  RECEIVED: number;
  IN_PROGRESS: number;
}

export interface ChartProps {
  data: MetricsData | StatusData | null;
  title?: string;
  showLegend?: boolean;
}

export interface FilteredChartsContainerProps {
  priorityData: MetricsData | null;
  statusData: StatusData | null;
  filterActive: boolean;
}
