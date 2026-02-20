/**
 * Servicio de Métricas para la Query Service
 * 
 * Responsable de agregar y calcular métricas sobre los tickets
 * desde los datos del repositorio de incidentes.
 */

export interface Ticket {
  ticketId: string;
  lineNumber: string;
  type: string;
  priority: string;
  status: string;
  description?: string | null;
  createdAt: string;
  processedAt?: string;
}

export interface Metrics {
  totalTickets: number;
  byStatus: {
    [key: string]: number;
  };
  byPriority: {
    [key: string]: number;
  };
  byType: {
    [key: string]: number;
  };
}

export interface IncidentRepository {
  findAll(): Promise<Ticket[]>;
  findById(id: string): Promise<Ticket | null>;
  create(ticket: Ticket): Promise<Ticket>;
  update(id: string, ticket: Partial<Ticket>): Promise<Ticket>;
}

/**
 * Servicio de Métricas
 * Calcula agregaciones de tickets para proporcionar reportes y dashboards
 */
export class MetricsService {
  constructor(private incidentRepository: IncidentRepository) {}

  /**
   * Obtiene las métricas agregadas de todos los tickets
   * @returns Objeto con totalTickets y distribuciones por estado, prioridad y tipo
   */
  async getMetrics(): Promise<Metrics> {
    // Obtener todos los tickets del repositorio
    const tickets = await this.incidentRepository.findAll();

    // Inicializar métricas vacías
    const metrics: Metrics = {
      totalTickets: 0,
      byStatus: {
        RECEIVED: 0,
        IN_PROGRESS: 0,
      },
      byPriority: {
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0,
        PENDING: 0,
      },
      byType: {
        NO_SERVICE: 0,
        INTERMITTENT_SERVICE: 0,
        SLOW_CONNECTION: 0,
        ROUTER_ISSUE: 0,
        BILLING_QUESTION: 0,
        OTHER: 0,
      },
    };

    // Contar total de tickets
    metrics.totalTickets = tickets.length;

    // Agregar por cada dimensión
    for (const ticket of tickets) {
      // Contar por estado
      if (ticket.status in metrics.byStatus) {
        metrics.byStatus[ticket.status]++;
      }

      // Contar por prioridad
      if (ticket.priority in metrics.byPriority) {
        metrics.byPriority[ticket.priority]++;
      }

      // Contar por tipo
      if (ticket.type in metrics.byType) {
        metrics.byType[ticket.type]++;
      }
    }

    return metrics;
  }

  /**
   * Obtiene el total de tickets
   * @returns Número de tickets en el repositorio
   */
  async getTotalTickets(): Promise<number> {
    const tickets = await this.incidentRepository.findAll();
    return tickets.length;
  }
}
