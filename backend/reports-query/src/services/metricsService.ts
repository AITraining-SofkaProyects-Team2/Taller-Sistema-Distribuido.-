/**
 * Servicio de Métricas para la Query Service
 * 
 * Responsable de agregar y calcular métricas sobre los tickets
 * desde los datos del repositorio de incidentes.
 * 
 * Patrones aplicados:
 * - Strategy: Agregadores especializados por dimensión (status, priority, type)
 * - Single Responsibility: Separación clara de responsabilidades
 * - Dependency Inversion: Inyección de dependencias del repositorio
 */

// ============================================================================
// CONSTANTES DE DOMINIO
// ============================================================================

/**
 * Valores válidos para estado de tickets
 */
const VALID_STATUS_VALUES = ['RECEIVED', 'IN_PROGRESS'] as const;

/**
 * Valores válidos para prioridad de tickets
 */
const VALID_PRIORITY_VALUES = ['HIGH', 'MEDIUM', 'LOW', 'PENDING'] as const;

/**
 * Valores válidos para tipo de incidente
 */
const VALID_TYPE_VALUES = ['NO_SERVICE', 'INTERMITTENT_SERVICE', 'SLOW_CONNECTION', 'ROUTER_ISSUE', 'BILLING_QUESTION', 'OTHER'] as const;

/**
 * Inicialización por defecto de distribuciones
 */
const DEFAULT_DISTRIBUTIONS = {
  byStatus: Object.fromEntries(VALID_STATUS_VALUES.map(v => [v, 0])),
  byPriority: Object.fromEntries(VALID_PRIORITY_VALUES.map(v => [v, 0])),
  byType: Object.fromEntries(VALID_TYPE_VALUES.map(v => [v, 0])),
} as const;

// ============================================================================
// INTERFACES PÚBLICAS
// ============================================================================

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

// ============================================================================
// ESTRATEGIAS DE AGREGACIÓN (Strategy Pattern)
// ============================================================================

/**
 * Interfaz para estrategias de agregación de tickets
 */
interface AggregationStrategy {
  /**
   * Extrae la clave de dimensión del ticket
   */
  getKey(ticket: Ticket): string;

  /**
   * Retorna las claves válidas para esta dimensión
   */
  getValidKeys(): readonly string[];
}

/**
 * Estrategia de agregación por estado
 */
class StatusAggregationStrategy implements AggregationStrategy {
  getKey(ticket: Ticket): string {
    return ticket.status;
  }

  getValidKeys(): readonly string[] {
    return VALID_STATUS_VALUES;
  }
}

/**
 * Estrategia de agregación por prioridad
 */
class PriorityAggregationStrategy implements AggregationStrategy {
  getKey(ticket: Ticket): string {
    return ticket.priority;
  }

  getValidKeys(): readonly string[] {
    return VALID_PRIORITY_VALUES;
  }
}

/**
 * Estrategia de agregación por tipo de incidente
 */
class TypeAggregationStrategy implements AggregationStrategy {
  getKey(ticket: Ticket): string {
    return ticket.type;
  }

  getValidKeys(): readonly string[] {
    return VALID_TYPE_VALUES;
  }
}

/**
 * Agregador genérico que usa una estrategia
 * @param tickets Lista de tickets a agregar
 * @param strategy Estrategia de agregación a utilizar
 * @returns Distribución de conteos por la clave de la estrategia
 */
function aggregateByStrategy(tickets: Ticket[], strategy: AggregationStrategy): Record<string, number> {
  const distribution = Object.fromEntries(
    strategy.getValidKeys().map(key => [key, 0])
  );

  for (const ticket of tickets) {
    const key = strategy.getKey(ticket);
    if (key in distribution) {
      (distribution as Record<string, number>)[key]++;
    }
  }

  return distribution;
}

// ============================================================================
// SERVICIO DE MÉTRICAS
// ============================================================================

/**
 * Servicio de Métricas
 * Calcula agregaciones de tickets para proporcionar reportes y dashboards
 */
export class MetricsService {
  private statusStrategy = new StatusAggregationStrategy();
  private priorityStrategy = new PriorityAggregationStrategy();
  private typeStrategy = new TypeAggregationStrategy();

  constructor(private incidentRepository: IncidentRepository) {}

  /**
   * Obtiene las métricas agregadas de todos los tickets
   * @returns Objeto con totalTickets y distribuciones por estado, prioridad y tipo
   */
  async getMetrics(): Promise<Metrics> {
    const tickets = await this.incidentRepository.findAll();

    return {
      totalTickets: tickets.length,
      byStatus: aggregateByStrategy(tickets, this.statusStrategy),
      byPriority: aggregateByStrategy(tickets, this.priorityStrategy),
      byType: aggregateByStrategy(tickets, this.typeStrategy),
    };
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
