import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

/**
 * HU-09 — Métricas Agregadas
 * 
 * Como supervisor, quiero ver métricas agregadas para obtener una visión global del sistema.
 * El sistema debe proporcionar: total de tickets, distribución por estado, por prioridad y por tipo.
 */

/**
 * TC-040 — Visualizar total de tickets
 * 
 * ID del Test: TC-040
 * ID de la Historia: HU-09
 * Descripción: Verificar que el sistema muestra el total de tickets procesados.
 * Precondiciones: Existen tickets en el repositorio.
 * 
 * Pasos (Gherkin):
 * Given existen 25 tickets procesados en el sistema
 * When el operador solicita GET /api/tickets/metrics
 * Then el código de respuesta es 200
 *   And el campo "totalTickets" es 25
 * 
 * Partición de equivalencia:
 * - Sin tickets: 0 (Válido - totalTickets = 0)
 * - Pocos tickets: 1 a 10 (Válido)
 * - Muchos tickets: 100+ (Válido)
 * 
 * Valores límites:
 * - 0 tickets: Repositorio vacío, totalTickets = 0
 * - 1 ticket: Mínimo con datos, totalTickets = 1
 */

describe('HU-09 — Métricas Agregadas', () => {
  let app: express.Application;

  beforeEach(() => {
    // Crear un nuevo app para cada test
    app = express();
    app.use(express.json());

    // Mock del repositorio de incidentes (inyectado en el servicio)
    const mockIncidentRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    // Servicio de métricas que debería existir
    const metricsService = {
      getTotalTickets: vi.fn(),
      getMetrics: vi.fn(),
    };

    // Controlador provisional que será reemplazado en la implementación
    app.get('/api/tickets/metrics', async (_req, res) => {
      try {
        // Placeholder: esta ruta será implementada en la siguiente fase (GREEN)
        res.status(200).json({
          totalTickets: 0,
          byStatus: {},
          byPriority: {},
          byType: {},
        });
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Exponer el mock para los tests
    (app as any).mockIncidentRepository = mockIncidentRepository;
    (app as any).metricsService = metricsService;
  });

  describe('TC-040 — Visualizar total de tickets', () => {
    describe('Partición de equivalencia: Sin tickets (0)', () => {
      it('debería retornar totalTickets = 0 cuando el repositorio está vacío', async () => {
        // Given: existen 0 tickets procesados en el sistema
        const incidentRepository = (app as any).mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue([]);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "totalTickets" es 0
        expect(response.body).toHaveProperty('totalTickets');
        expect(response.body.totalTickets).toBe(0);
      });
    });

    describe('Partición de equivalencia: Pocos tickets (1-10)', () => {
      it('debería retornar totalTickets = 1 con un único ticket', async () => {
        // Given: existe 1 ticket procesado en el sistema (valor límite mínimo)
        const mockTickets = [
          {
            ticketId: 'ticket-1',
            lineNumber: '123456789',
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          },
        ];

        const incidentRepository = (app as any).mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "totalTickets" es 1
        expect(response.body).toHaveProperty('totalTickets');
        expect(response.body.totalTickets).toBe(1);
      });

      it('debería retornar totalTickets = 5 con múltiples tickets', async () => {
        // Given: existen 5 tickets procesados en el sistema
        const mockTickets = Array.from({ length: 5 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${10000000 + i}`,
          type: 'INTERMITTENT_SERVICE',
          priority: 'MEDIUM',
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = (app as any).mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "totalTickets" es 5
        expect(response.body).toHaveProperty('totalTickets');
        expect(response.body.totalTickets).toBe(5);
      });

      it('debería retornar totalTickets = 10 en el límite superior de la partición', async () => {
        // Given: existen 10 tickets procesados en el sistema
        const mockTickets = Array.from({ length: 10 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${20000000 + i}`,
          type: 'SLOW_CONNECTION',
          priority: 'MEDIUM',
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = (app as any).mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "totalTickets" es 10
        expect(response.body).toHaveProperty('totalTickets');
        expect(response.body.totalTickets).toBe(10);
      });
    });

    describe('Partición de equivalencia: Muchos tickets (100+)', () => {
      it('debería retornar totalTickets = 25 según escenario del test plan', async () => {
        // Given: existen 25 tickets procesados en el sistema (escenario del Gherkin)
        const mockTickets = Array.from({ length: 25 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${30000000 + i}`,
          type: i % 6 === 0 ? 'NO_SERVICE' : i % 6 === 1 ? 'INTERMITTENT_SERVICE' : 'SLOW_CONNECTION',
          priority: i % 3 === 0 ? 'HIGH' : i % 3 === 1 ? 'MEDIUM' : 'LOW',
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = (app as any).mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "totalTickets" es 25
        expect(response.body).toHaveProperty('totalTickets');
        expect(response.body.totalTickets).toBe(25);
      });

      it('debería retornar totalTickets = 100 con cantidad significativa', async () => {
        // Given: existen 100 tickets procesados en el sistema
        const mockTickets = Array.from({ length: 100 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${40000000 + i}`,
          type: 'ROUTER_ISSUE',
          priority: 'LOW',
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = (app as any).mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "totalTickets" es 100
        expect(response.body).toHaveProperty('totalTickets');
        expect(response.body.totalTickets).toBe(100);
      });
    });

    describe('Validación de estructura de respuesta', () => {
      it('debería retornar un objeto JSON con las propiedades esperadas', async () => {
        // Given: existen tickets en el repositorio
        const mockTickets = [
          {
            ticketId: 'ticket-1',
            lineNumber: '123456789',
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          },
        ];

        const incidentRepository = (app as any).mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: la respuesta contiene las propiedades necesarias
        expect(response.body).toHaveProperty('totalTickets');
        expect(typeof response.body.totalTickets).toBe('number');
        expect(response.body.totalTickets).toBeGreaterThanOrEqual(0);
      });

      it('debería retornar totalTickets como número entero no negativo', async () => {
        // Given: existen 0 tickets (caso límite)
        const incidentRepository = (app as any).mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue([]);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: totalTickets es un número entero no negativo
        expect(Number.isInteger(response.body.totalTickets)).toBe(true);
        expect(response.body.totalTickets).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
