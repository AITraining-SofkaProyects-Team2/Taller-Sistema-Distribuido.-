import express from 'express';
import { MetricsService, IncidentRepository } from './services/metricsService';
import { TicketRepository } from './repositories/TicketRepository';
import ticketRoutes from './routes/tickets.routes';

/**
 * Crea la aplicación Express con las rutas configuradas
 * @param incidentRepository - Repositorio de incidentes a usar
 * @returns Instancia de Express configurada
 */
export function createApp(incidentRepository?: IncidentRepository) {
  const app = express();
  app.use(express.json());

  // Si no se proporciona repositorio, crear uno apropiado según el entorno.
  // En tests usamos un stub in-memory; en ejecución normal usamos `TicketRepository` (Postgres).
  let repo: IncidentRepository;
  if (incidentRepository) {
    repo = incidentRepository;
  } else if (process.env.NODE_ENV === 'test') {
    repo = {
      async findAll() {
        return [];
      },
      async findById(_id: string) {
        return null;
      },
      async create(_ticket) {
        throw new Error('Not implemented');
      },
      async update(_id: string, _ticket) {
        throw new Error('Not implemented');
      },
    };
  } else {
    // En entorno real, usar la implementación que conecta a Postgres
    repo = new TicketRepository();
  }




// Test-only endpoints (no-op stubs for env compatibility)
if (process.env.NODE_ENV === 'test') {
  app.post('/__test__/seed', (_req, res) => res.status(204).end());
  app.post('/__test__/clear', (_req, res) => res.status(204).end());
}

app.use('/api/tickets', ticketRoutes);

  // Instanciar servicio de métricas con el repositorio
  const metricsService = new MetricsService(repo);

  // Rutas de salud
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Ruta de métricas agregadas
  app.get('/api/tickets/metrics', async (_req, res) => {
    try {
      const metrics = await metricsService.getMetrics();
      res.status(200).json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return app;
}

// Crear app por defecto para ejecución standalone
const app = createApp();

export default app;


if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Reports Query service listening on port ${PORT}`);
  });
}