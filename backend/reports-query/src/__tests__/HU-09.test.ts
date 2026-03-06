import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createApp } from '../index';

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
  let app: any;
  let mockIncidentRepository: any;

  beforeEach(() => {
    // Crear un nuevo mock del repositorio para cada test
    mockIncidentRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    // Inyectar el repositorio mock en la aplicación
    // Esto hace que los tests usen la implementación real de MetricsService
    // con datos mock, validando la lógica de agregación de métricas
    app = createApp(mockIncidentRepository);
  });

  describe('TC-040 — Visualizar total de tickets', () => {
    describe('Partición de equivalencia: Sin tickets (0)', () => {
      it('debería retornar totalTickets = 0 cuando el repositorio está vacío', async () => {
        // Given: existen 0 tickets procesados en el sistema
        const incidentRepository = mockIncidentRepository;
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

        const incidentRepository = mockIncidentRepository;
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

        const incidentRepository = mockIncidentRepository;
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

        const incidentRepository = mockIncidentRepository;
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

        const incidentRepository = mockIncidentRepository;
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

        const incidentRepository = mockIncidentRepository;
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

        const incidentRepository = mockIncidentRepository;
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
        const incidentRepository = mockIncidentRepository;
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

  describe('TC-041 — Distribución por estado', () => {
    /**
     * TC-041 — Distribución por estado
     * 
     * ID del Test: TC-041
     * ID de la Historia: HU-09
     * Descripción: Verificar que las métricas incluyen la distribución de tickets por estado.
     * Precondiciones: Existen tickets con diferentes estados.
     * 
     * Pasos (Gherkin):
     * Given existen tickets con los siguientes estados:
     *   | status      | cantidad |
     *   | RECEIVED    | 10       |
     *   | IN_PROGRESS | 15       |
     * When el operador solicita GET /api/tickets/metrics
     * Then el código de respuesta es 200
     *   And el campo "byStatus.RECEIVED" es 10
     *   And el campo "byStatus.IN_PROGRESS" es 15
     *   And la suma de todos los valores de "byStatus" es igual a "totalTickets"
     * 
     * Partición de equivalencia:
     * - Todos en un solo estado: 25 RECEIVED, 0 IN_PROGRESS (Válido)
     * - Distribución equilibrada: 12 RECEIVED, 13 IN_PROGRESS (Válido)
     * - Sin tickets: 0 en cada estado (Válido)
     */

    describe('Partición de equivalencia: Sin tickets (0)', () => {
      it('debería retornar byStatus con valores 0 cuando el repositorio está vacío', async () => {
        // Given: existen 0 tickets en el sistema
        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue([]);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byStatus" existe
        expect(response.body).toHaveProperty('byStatus');

        // And: byStatus es un objeto
        expect(typeof response.body.byStatus).toBe('object');
      });
    });

    describe('Partición de equivalencia: Todos en un solo estado', () => {
      it('debería retornar byStatus.RECEIVED = 25 cuando todos los tickets están en RECEIVED', async () => {
        // Given: existen 25 tickets todos en estado RECEIVED
        const mockTickets = Array.from({ length: 25 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${50000000 + i}`,
          type: 'NO_SERVICE',
          priority: 'HIGH',
          status: 'RECEIVED',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byStatus.RECEIVED" es 25
        expect(response.body.byStatus).toHaveProperty('RECEIVED');
        expect(response.body.byStatus.RECEIVED).toBe(25);

        // And: el campo "byStatus.IN_PROGRESS" es 0
        expect(response.body.byStatus.IN_PROGRESS).toBe(0);
      });

      it('debería retornar byStatus.IN_PROGRESS = 30 cuando todos los tickets están en IN_PROGRESS', async () => {
        // Given: existen 30 tickets todos en estado IN_PROGRESS
        const mockTickets = Array.from({ length: 30 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${60000000 + i}`,
          type: 'INTERMITTENT_SERVICE',
          priority: 'MEDIUM',
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byStatus.IN_PROGRESS" es 30
        expect(response.body.byStatus).toHaveProperty('IN_PROGRESS');
        expect(response.body.byStatus.IN_PROGRESS).toBe(30);

        // And: el campo "byStatus.RECEIVED" es 0
        expect(response.body.byStatus.RECEIVED).toBe(0);
      });
    });

    describe('Partición de equivalencia: Distribución equilibrada', () => {
      it('debería retornar byStatus con distribución 12 RECEIVED y 13 IN_PROGRESS (escenario del test plan)', async () => {
        // Given: existen tickets con los siguientes estados:
        // RECEIVED: 12, IN_PROGRESS: 13
        const mockTickets = [
          ...Array.from({ length: 12 }, (_, i) => ({
            ticketId: `ticket-received-${i + 1}`,
            lineNumber: `${70000000 + i}`,
            type: 'SLOW_CONNECTION',
            priority: 'MEDIUM',
            status: 'RECEIVED',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 13 }, (_, i) => ({
            ticketId: `ticket-inprogress-${i + 1}`,
            lineNumber: `${70000100 + i}`,
            type: 'ROUTER_ISSUE',
            priority: 'LOW',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byStatus.RECEIVED" es 12
        expect(response.body.byStatus.RECEIVED).toBe(12);

        // And: el campo "byStatus.IN_PROGRESS" es 13
        expect(response.body.byStatus.IN_PROGRESS).toBe(13);

        // And: la suma de todos los valores de "byStatus" es igual a "totalTickets"
        const totalByStatus = Object.values(response.body.byStatus).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByStatus).toBe(response.body.totalTickets);
        expect(totalByStatus).toBe(25);
      });

      it('debería retornar distribución equilibrada con 10 RECEIVED y 10 IN_PROGRESS', async () => {
        // Given: existen 20 tickets distribuidos equitativamente
        const mockTickets = [
          ...Array.from({ length: 10 }, (_, i) => ({
            ticketId: `ticket-received-${i + 1}`,
            lineNumber: `${80000000 + i}`,
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'RECEIVED',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 10 }, (_, i) => ({
            ticketId: `ticket-inprogress-${i + 1}`,
            lineNumber: `${80000100 + i}`,
            type: 'BILLING_QUESTION',
            priority: 'LOW',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: distribución equilibrada
        expect(response.body.byStatus.RECEIVED).toBe(10);
        expect(response.body.byStatus.IN_PROGRESS).toBe(10);

        // And: la suma es igual a totalTickets
        const totalByStatus = response.body.byStatus.RECEIVED + response.body.byStatus.IN_PROGRESS;
        expect(totalByStatus).toBe(response.body.totalTickets);
        expect(totalByStatus).toBe(20);
      });
    });

    describe('Validación de consistencia de métricas', () => {
      it('debería garantizar que la suma de byStatus es igual a totalTickets', async () => {
        // Given: existen tickets variados con diferentes estados
        const mockTickets = [
          ...Array.from({ length: 7 }, (_, i) => ({
            ticketId: `ticket-${i + 1}`,
            lineNumber: `${90000000 + i}`,
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'RECEIVED',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 18 }, (_, i) => ({
            ticketId: `ticket-${i + 8}`,
            lineNumber: `${90001000 + i}`,
            type: 'INTERMITTENT_SERVICE',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: la suma de todos los valores de "byStatus" es igual a "totalTickets"
        const totalByStatus = Object.values(response.body.byStatus).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByStatus).toBe(response.body.totalTickets);
        expect(totalByStatus).toBe(25);
      });

      it('debería retornar byStatus como un objeto con estructura consistente', async () => {
        // Given: existen tickets en el repositorio
        const mockTickets = [
          {
            ticketId: 'ticket-1',
            lineNumber: '001',
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'RECEIVED',
            createdAt: new Date().toISOString(),
          },
          {
            ticketId: 'ticket-2',
            lineNumber: '002',
            type: 'SLOW_CONNECTION',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          },
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: byStatus es un objeto con propiedades de estado
        expect(response.body.byStatus).toHaveProperty('RECEIVED');
        expect(response.body.byStatus).toHaveProperty('IN_PROGRESS');

        // And: todos los valores son números no negativos
        Object.values(response.body.byStatus).forEach((value) => {
          expect(typeof value).toBe('number');
          expect(value as number).toBeGreaterThanOrEqual(0);
        });
      });

      it('debería manejar un único ticket correctamente en la distribución por estado', async () => {
        // Given: existe 1 ticket (valor límite mínimo) en estado RECEIVED
        const mockTickets = [
          {
            ticketId: 'ticket-1',
            lineNumber: '111111111',
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'RECEIVED',
            createdAt: new Date().toISOString(),
          },
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: byStatus.RECEIVED es 1
        expect(response.body.byStatus.RECEIVED).toBe(1);

        // And: la suma es igual a totalTickets que debe ser 1
        const totalByStatus = Object.values(response.body.byStatus).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByStatus).toBe(1);
        expect(totalByStatus).toBe(response.body.totalTickets);
      });
    });
  });

  describe('TC-042 — Distribución por prioridad', () => {
    /**
     * TC-042 — Distribución por prioridad
     * 
     * ID del Test: TC-042
     * ID de la Historia: HU-09
     * Descripción: Verificar que las métricas incluyen la distribución de tickets por prioridad.
     * Precondiciones: Existen tickets con diferentes prioridades.
     * 
     * Pasos (Gherkin):
     * Given existen tickets con las siguientes prioridades:
     *   | priority | cantidad |
     *   | HIGH     | 5        |
     *   | MEDIUM   | 8        |
     *   | LOW      | 10       |
     *   | PENDING  | 2        |
     * When el operador solicita GET /api/tickets/metrics
     * Then el código de respuesta es 200
     *   And el campo "byPriority.HIGH" es 5
     *   And el campo "byPriority.MEDIUM" es 8
     *   And el campo "byPriority.LOW" es 10
     *   And el campo "byPriority.PENDING" es 2
     *   And la suma de todos los valores de "byPriority" es igual a "totalTickets"
     * 
     * Partición de equivalencia:
     * - Sin tickets: 0 en cada prioridad (Válido)
     * - Todos en una sola prioridad: 25 HIGH, 0 MEDIUM, 0 LOW, 0 PENDING (Válido)
     * - Distribución equilibrada: 5 HIGH, 8 MEDIUM, 10 LOW, 2 PENDING (Escenario del test plan)
     */

    describe('Partición de equivalencia: Sin tickets (0)', () => {
      it('debería retornar byPriority con valores 0 cuando el repositorio está vacío', async () => {
        // Given: existen 0 tickets en el sistema
        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue([]);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byPriority" existe
        expect(response.body).toHaveProperty('byPriority');

        // And: byPriority es un objeto
        expect(typeof response.body.byPriority).toBe('object');
      });
    });

    describe('Partición de equivalencia: Todos en una sola prioridad', () => {
      it('debería retornar byPriority.HIGH = 25 cuando todos los tickets son HIGH', async () => {
        // Given: existen 25 tickets todos con prioridad HIGH
        const mockTickets = Array.from({ length: 25 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${100000000 + i}`,
          type: 'NO_SERVICE',
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byPriority.HIGH" es 25
        expect(response.body.byPriority).toHaveProperty('HIGH');
        expect(response.body.byPriority.HIGH).toBe(25);

        // And: otros tienen valor 0
        expect(response.body.byPriority.MEDIUM).toBe(0);
        expect(response.body.byPriority.LOW).toBe(0);
        expect(response.body.byPriority.PENDING).toBe(0);
      });

      it('debería retornar byPriority.MEDIUM = 20 cuando todos los tickets son MEDIUM', async () => {
        // Given: existen 20 tickets todos con prioridad MEDIUM
        const mockTickets = Array.from({ length: 20 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${110000000 + i}`,
          type: 'INTERMITTENT_SERVICE',
          priority: 'MEDIUM',
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byPriority.MEDIUM" es 20
        expect(response.body.byPriority.MEDIUM).toBe(20);

        // And: otros tienen valor 0
        expect(response.body.byPriority.HIGH).toBe(0);
        expect(response.body.byPriority.LOW).toBe(0);
        expect(response.body.byPriority.PENDING).toBe(0);
      });

      it('debería retornar byPriority.LOW = 15 cuando todos los tickets son LOW', async () => {
        // Given: existen 15 tickets todos con prioridad LOW
        const mockTickets = Array.from({ length: 15 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${120000000 + i}`,
          type: 'ROUTER_ISSUE',
          priority: 'LOW',
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byPriority.LOW" es 15
        expect(response.body.byPriority.LOW).toBe(15);

        // And: otros tienen valor 0
        expect(response.body.byPriority.HIGH).toBe(0);
        expect(response.body.byPriority.MEDIUM).toBe(0);
        expect(response.body.byPriority.PENDING).toBe(0);
      });

      it('debería retornar byPriority.PENDING = 10 cuando todos los tickets son PENDING', async () => {
        // Given: existen 10 tickets todos con prioridad PENDING
        const mockTickets = Array.from({ length: 10 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${130000000 + i}`,
          type: 'OTHER',
          priority: 'PENDING',
          status: 'RECEIVED',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byPriority.PENDING" es 10
        expect(response.body.byPriority.PENDING).toBe(10);

        // And: otros tienen valor 0
        expect(response.body.byPriority.HIGH).toBe(0);
        expect(response.body.byPriority.MEDIUM).toBe(0);
        expect(response.body.byPriority.LOW).toBe(0);
      });
    });

    describe('Partición de equivalencia: Distribución equilibrada', () => {
      it('debería retornar distribución 5 HIGH, 8 MEDIUM, 10 LOW, 2 PENDING (escenario del test plan)', async () => {
        // Given: existen tickets con las siguientes prioridades:
        // HIGH: 5, MEDIUM: 8, LOW: 10, PENDING: 2
        const mockTickets = [
          ...Array.from({ length: 5 }, (_, i) => ({
            ticketId: `ticket-high-${i + 1}`,
            lineNumber: `${140000000 + i}`,
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 8 }, (_, i) => ({
            ticketId: `ticket-medium-${i + 1}`,
            lineNumber: `${140000100 + i}`,
            type: 'INTERMITTENT_SERVICE',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 10 }, (_, i) => ({
            ticketId: `ticket-low-${i + 1}`,
            lineNumber: `${140000200 + i}`,
            type: 'SLOW_CONNECTION',
            priority: 'LOW',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 2 }, (_, i) => ({
            ticketId: `ticket-pending-${i + 1}`,
            lineNumber: `${140000300 + i}`,
            type: 'OTHER',
            priority: 'PENDING',
            status: 'RECEIVED',
            createdAt: new Date().toISOString(),
          })),
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byPriority.HIGH" es 5
        expect(response.body.byPriority.HIGH).toBe(5);

        // And: el campo "byPriority.MEDIUM" es 8
        expect(response.body.byPriority.MEDIUM).toBe(8);

        // And: el campo "byPriority.LOW" es 10
        expect(response.body.byPriority.LOW).toBe(10);

        // And: el campo "byPriority.PENDING" es 2
        expect(response.body.byPriority.PENDING).toBe(2);

        // And: la suma de todos los valores de "byPriority" es igual a "totalTickets"
        const totalByPriority = Object.values(response.body.byPriority).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByPriority).toBe(response.body.totalTickets);
        expect(totalByPriority).toBe(25);
      });

      it('debería retornar distribución equilibrada multiprioridad 6-6-6-6 (24 tickets)', async () => {
        // Given: existen 24 tickets distribuidos equitativamente entre 4 prioridades
        const mockTickets = [
          ...Array.from({ length: 6 }, (_, i) => ({
            ticketId: `ticket-high-${i + 1}`,
            lineNumber: `${150000000 + i}`,
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 6 }, (_, i) => ({
            ticketId: `ticket-medium-${i + 1}`,
            lineNumber: `${150000100 + i}`,
            type: 'INTERMITTENT_SERVICE',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 6 }, (_, i) => ({
            ticketId: `ticket-low-${i + 1}`,
            lineNumber: `${150000200 + i}`,
            type: 'SLOW_CONNECTION',
            priority: 'LOW',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 6 }, (_, i) => ({
            ticketId: `ticket-pending-${i + 1}`,
            lineNumber: `${150000300 + i}`,
            type: 'OTHER',
            priority: 'PENDING',
            status: 'RECEIVED',
            createdAt: new Date().toISOString(),
          })),
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: distribución equilibrada
        expect(response.body.byPriority.HIGH).toBe(6);
        expect(response.body.byPriority.MEDIUM).toBe(6);
        expect(response.body.byPriority.LOW).toBe(6);
        expect(response.body.byPriority.PENDING).toBe(6);

        // And: la suma es igual a totalTickets
        const totalByPriority = Object.values(response.body.byPriority).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByPriority).toBe(response.body.totalTickets);
        expect(totalByPriority).toBe(24);
      });
    });

    describe('Validación de consistencia de métricas por prioridad', () => {
      it('debería garantizar que la suma de byPriority es igual a totalTickets', async () => {
        // Given: existen tickets variados con diferentes prioridades
        const mockTickets = [
          ...Array.from({ length: 3 }, (_, i) => ({
            ticketId: `ticket-${i + 1}`,
            lineNumber: `${160000000 + i}`,
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 7 }, (_, i) => ({
            ticketId: `ticket-${i + 4}`,
            lineNumber: `${160001000 + i}`,
            type: 'INTERMITTENT_SERVICE',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 12 }, (_, i) => ({
            ticketId: `ticket-${i + 11}`,
            lineNumber: `${160002000 + i}`,
            type: 'SLOW_CONNECTION',
            priority: 'LOW',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 3 }, (_, i) => ({
            ticketId: `ticket-${i + 23}`,
            lineNumber: `${160003000 + i}`,
            type: 'OTHER',
            priority: 'PENDING',
            status: 'RECEIVED',
            createdAt: new Date().toISOString(),
          })),
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: la suma de todos los valores de "byPriority" es igual a "totalTickets"
        const totalByPriority = Object.values(response.body.byPriority).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByPriority).toBe(response.body.totalTickets);
        expect(totalByPriority).toBe(25);
      });

      it('debería retornar byPriority como un objeto con estructura consistente', async () => {
        // Given: existen tickets en el repositorio
        const mockTickets = [
          {
            ticketId: 'ticket-1',
            lineNumber: '001',
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          },
          {
            ticketId: 'ticket-2',
            lineNumber: '002',
            type: 'SLOW_CONNECTION',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          },
          {
            ticketId: 'ticket-3',
            lineNumber: '003',
            type: 'ROUTER_ISSUE',
            priority: 'LOW',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          },
          {
            ticketId: 'ticket-4',
            lineNumber: '004',
            type: 'OTHER',
            priority: 'PENDING',
            status: 'RECEIVED',
            createdAt: new Date().toISOString(),
          },
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: byPriority es un objeto con propiedades de prioridad
        expect(response.body.byPriority).toHaveProperty('HIGH');
        expect(response.body.byPriority).toHaveProperty('MEDIUM');
        expect(response.body.byPriority).toHaveProperty('LOW');
        expect(response.body.byPriority).toHaveProperty('PENDING');

        // And: todos los valores son números no negativos
        Object.values(response.body.byPriority).forEach((value) => {
          expect(typeof value).toBe('number');
          expect(value as number).toBeGreaterThanOrEqual(0);
        });
      });

      it('debería manejar un único ticket correctamente en la distribución por prioridad', async () => {
        // Given: existe 1 ticket (valor límite mínimo) con prioridad HIGH
        const mockTickets = [
          {
            ticketId: 'ticket-1',
            lineNumber: '222222222',
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          },
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: byPriority.HIGH es 1
        expect(response.body.byPriority.HIGH).toBe(1);

        // And: la suma es igual a totalTickets que debe ser 1
        const totalByPriority = Object.values(response.body.byPriority).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByPriority).toBe(1);
        expect(totalByPriority).toBe(response.body.totalTickets);
      });
    });
  });

  describe('TC-043 — Distribución por tipo de incidente', () => {
    /**
     * TC-043 — Distribución por tipo de incidente
     * 
     * ID del Test: TC-043
     * ID de la Historia: HU-09
     * Descripción: Verificar que las métricas incluyen la distribución de tickets por tipo de incidente.
     * Precondiciones: Existen tickets de diferentes tipos.
     * 
     * Pasos (Gherkin):
     * Given existen tickets con los siguientes tipos:
     *   | type                  | cantidad |
     *   | NO_SERVICE            | 3        |
     *   | INTERMITTENT_SERVICE  | 4        |
     *   | SLOW_CONNECTION       | 2        |
     *   | ROUTER_ISSUE          | 5        |
     *   | BILLING_QUESTION      | 3        |
     *   | OTHER                 | 1        |
     * When el operador solicita GET /api/tickets/metrics
     * Then el código de respuesta es 200
     *   And el campo "byType.NO_SERVICE" es 3
     *   And el campo "byType.INTERMITTENT_SERVICE" es 4
     *   And el campo "byType.SLOW_CONNECTION" es 2
     *   And el campo "byType.ROUTER_ISSUE" es 5
     *   And el campo "byType.BILLING_QUESTION" es 3
     *   And el campo "byType.OTHER" es 1
     *   And la suma de todos los valores de "byType" es igual a "totalTickets"
     * 
     * Partición de equivalencia:
     * - Sin tickets: 0 en cada tipo (Válido)
     * - Todos en un solo tipo: 18 NO_SERVICE, 0 otros (Válido)
     * - Distribución completa: 3-4-2-5-3-1 (Escenario del test plan)
     */

    describe('Partición de equivalencia: Sin tickets (0)', () => {
      it('debería retornar byType con valores 0 cuando el repositorio está vacío', async () => {
        // Given: existen 0 tickets en el sistema
        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue([]);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byType" existe
        expect(response.body).toHaveProperty('byType');

        // And: byType es un objeto
        expect(typeof response.body.byType).toBe('object');
      });
    });

    describe('Partición de equivalencia: Todos en un solo tipo', () => {
      it('debería retornar byType.NO_SERVICE = 18 cuando todos los tickets son NO_SERVICE', async () => {
        // Given: existen 18 tickets todos del tipo NO_SERVICE
        const mockTickets = Array.from({ length: 18 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${170000000 + i}`,
          type: 'NO_SERVICE',
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byType.NO_SERVICE" es 18
        expect(response.body.byType).toHaveProperty('NO_SERVICE');
        expect(response.body.byType.NO_SERVICE).toBe(18);

        // And: otros tipos tienen valor 0
        expect(response.body.byType.INTERMITTENT_SERVICE).toBe(0);
        expect(response.body.byType.SLOW_CONNECTION).toBe(0);
        expect(response.body.byType.ROUTER_ISSUE).toBe(0);
        expect(response.body.byType.BILLING_QUESTION).toBe(0);
        expect(response.body.byType.OTHER).toBe(0);
      });

      it('debería retornar byType.INTERMITTENT_SERVICE = 15 cuando todos los tickets son INTERMITTENT_SERVICE', async () => {
        // Given: existen 15 tickets todos del tipo INTERMITTENT_SERVICE
        const mockTickets = Array.from({ length: 15 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${180000000 + i}`,
          type: 'INTERMITTENT_SERVICE',
          priority: 'MEDIUM',
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byType.INTERMITTENT_SERVICE" es 15
        expect(response.body.byType.INTERMITTENT_SERVICE).toBe(15);

        // And: otros tipos tienen valor 0
        expect(response.body.byType.NO_SERVICE).toBe(0);
        expect(response.body.byType.SLOW_CONNECTION).toBe(0);
        expect(response.body.byType.ROUTER_ISSUE).toBe(0);
        expect(response.body.byType.BILLING_QUESTION).toBe(0);
        expect(response.body.byType.OTHER).toBe(0);
      });

      it('debería retornar byType.SLOW_CONNECTION = 12 cuando todos los tickets son SLOW_CONNECTION', async () => {
        // Given: existen 12 tickets todos del tipo SLOW_CONNECTION
        const mockTickets = Array.from({ length: 12 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${190000000 + i}`,
          type: 'SLOW_CONNECTION',
          priority: 'MEDIUM',
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byType.SLOW_CONNECTION" es 12
        expect(response.body.byType.SLOW_CONNECTION).toBe(12);

        // And: otros tipos tienen valor 0
        expect(response.body.byType.NO_SERVICE).toBe(0);
        expect(response.body.byType.INTERMITTENT_SERVICE).toBe(0);
        expect(response.body.byType.ROUTER_ISSUE).toBe(0);
        expect(response.body.byType.BILLING_QUESTION).toBe(0);
        expect(response.body.byType.OTHER).toBe(0);
      });

      it('debería retornar byType.ROUTER_ISSUE = 20 cuando todos los tickets son ROUTER_ISSUE', async () => {
        // Given: existen 20 tickets todos del tipo ROUTER_ISSUE
        const mockTickets = Array.from({ length: 20 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${200000000 + i}`,
          type: 'ROUTER_ISSUE',
          priority: 'LOW',
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byType.ROUTER_ISSUE" es 20
        expect(response.body.byType.ROUTER_ISSUE).toBe(20);

        // And: otros tipos tienen valor 0
        expect(response.body.byType.NO_SERVICE).toBe(0);
        expect(response.body.byType.INTERMITTENT_SERVICE).toBe(0);
        expect(response.body.byType.SLOW_CONNECTION).toBe(0);
        expect(response.body.byType.BILLING_QUESTION).toBe(0);
        expect(response.body.byType.OTHER).toBe(0);
      });

      it('debería retornar byType.BILLING_QUESTION = 8 cuando todos los tickets son BILLING_QUESTION', async () => {
        // Given: existen 8 tickets todos del tipo BILLING_QUESTION
        const mockTickets = Array.from({ length: 8 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${210000000 + i}`,
          type: 'BILLING_QUESTION',
          priority: 'LOW',
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byType.BILLING_QUESTION" es 8
        expect(response.body.byType.BILLING_QUESTION).toBe(8);

        // And: otros tipos tienen valor 0
        expect(response.body.byType.NO_SERVICE).toBe(0);
        expect(response.body.byType.INTERMITTENT_SERVICE).toBe(0);
        expect(response.body.byType.SLOW_CONNECTION).toBe(0);
        expect(response.body.byType.ROUTER_ISSUE).toBe(0);
        expect(response.body.byType.OTHER).toBe(0);
      });

      it('debería retornar byType.OTHER = 5 cuando todos los tickets son OTHER', async () => {
        // Given: existen 5 tickets todos del tipo OTHER
        const mockTickets = Array.from({ length: 5 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${220000000 + i}`,
          type: 'OTHER',
          priority: 'PENDING',
          status: 'RECEIVED',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byType.OTHER" es 5
        expect(response.body.byType.OTHER).toBe(5);

        // And: otros tipos tienen valor 0
        expect(response.body.byType.NO_SERVICE).toBe(0);
        expect(response.body.byType.INTERMITTENT_SERVICE).toBe(0);
        expect(response.body.byType.SLOW_CONNECTION).toBe(0);
        expect(response.body.byType.ROUTER_ISSUE).toBe(0);
        expect(response.body.byType.BILLING_QUESTION).toBe(0);
      });
    });

    describe('Partición de equivalencia: Distribución completa de tipos', () => {
      it('debería retornar distribución completa 3-4-2-5-3-1 (escenario del test plan)', async () => {
        // Given: existen tickets con los siguientes tipos:
        // NO_SERVICE: 3, INTERMITTENT_SERVICE: 4, SLOW_CONNECTION: 2, ROUTER_ISSUE: 5, BILLING_QUESTION: 3, OTHER: 1
        const mockTickets = [
          ...Array.from({ length: 3 }, (_, i) => ({
            ticketId: `ticket-no-service-${i + 1}`,
            lineNumber: `${230000000 + i}`,
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 4 }, (_, i) => ({
            ticketId: `ticket-intermittent-${i + 1}`,
            lineNumber: `${230000100 + i}`,
            type: 'INTERMITTENT_SERVICE',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 2 }, (_, i) => ({
            ticketId: `ticket-slow-${i + 1}`,
            lineNumber: `${230000200 + i}`,
            type: 'SLOW_CONNECTION',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 5 }, (_, i) => ({
            ticketId: `ticket-router-${i + 1}`,
            lineNumber: `${230000300 + i}`,
            type: 'ROUTER_ISSUE',
            priority: 'LOW',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 3 }, (_, i) => ({
            ticketId: `ticket-billing-${i + 1}`,
            lineNumber: `${230000400 + i}`,
            type: 'BILLING_QUESTION',
            priority: 'LOW',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          {
            ticketId: 'ticket-other-1',
            lineNumber: '230000500',
            type: 'OTHER',
            priority: 'PENDING',
            status: 'RECEIVED',
            createdAt: new Date().toISOString(),
          },
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: el campo "byType.NO_SERVICE" es 3
        expect(response.body.byType.NO_SERVICE).toBe(3);

        // And: el campo "byType.INTERMITTENT_SERVICE" es 4
        expect(response.body.byType.INTERMITTENT_SERVICE).toBe(4);

        // And: el campo "byType.SLOW_CONNECTION" es 2
        expect(response.body.byType.SLOW_CONNECTION).toBe(2);

        // And: el campo "byType.ROUTER_ISSUE" es 5
        expect(response.body.byType.ROUTER_ISSUE).toBe(5);

        // And: el campo "byType.BILLING_QUESTION" es 3
        expect(response.body.byType.BILLING_QUESTION).toBe(3);

        // And: el campo "byType.OTHER" es 1
        expect(response.body.byType.OTHER).toBe(1);

        // And: la suma de todos los valores de "byType" es igual a "totalTickets"
        const totalByType = Object.values(response.body.byType).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByType).toBe(response.body.totalTickets);
        expect(totalByType).toBe(18);
      });

      it('debería retornar distribución equilibrada multitipos 3-3-3-3-3-3 (18 tickets)', async () => {
        // Given: existen 18 tickets distribuidos equitativamente entre 6 tipos
        const mockTickets = [
          ...Array.from({ length: 3 }, (_, i) => ({
            ticketId: `ticket-no-service-${i + 1}`,
            lineNumber: `${240000000 + i}`,
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 3 }, (_, i) => ({
            ticketId: `ticket-intermittent-${i + 1}`,
            lineNumber: `${240000100 + i}`,
            type: 'INTERMITTENT_SERVICE',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 3 }, (_, i) => ({
            ticketId: `ticket-slow-${i + 1}`,
            lineNumber: `${240000200 + i}`,
            type: 'SLOW_CONNECTION',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 3 }, (_, i) => ({
            ticketId: `ticket-router-${i + 1}`,
            lineNumber: `${240000300 + i}`,
            type: 'ROUTER_ISSUE',
            priority: 'LOW',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 3 }, (_, i) => ({
            ticketId: `ticket-billing-${i + 1}`,
            lineNumber: `${240000400 + i}`,
            type: 'BILLING_QUESTION',
            priority: 'LOW',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 3 }, (_, i) => ({
            ticketId: `ticket-other-${i + 1}`,
            lineNumber: `${240000500 + i}`,
            type: 'OTHER',
            priority: 'PENDING',
            status: 'RECEIVED',
            createdAt: new Date().toISOString(),
          })),
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: distribución equilibrada
        expect(response.body.byType.NO_SERVICE).toBe(3);
        expect(response.body.byType.INTERMITTENT_SERVICE).toBe(3);
        expect(response.body.byType.SLOW_CONNECTION).toBe(3);
        expect(response.body.byType.ROUTER_ISSUE).toBe(3);
        expect(response.body.byType.BILLING_QUESTION).toBe(3);
        expect(response.body.byType.OTHER).toBe(3);

        // And: la suma es igual a totalTickets
        const totalByType = Object.values(response.body.byType).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByType).toBe(response.body.totalTickets);
        expect(totalByType).toBe(18);
      });
    });

    describe('Validación de consistencia de métricas por tipo', () => {
      it('debería garantizar que la suma de byType es igual a totalTickets', async () => {
        // Given: existen tickets variados con diferentes tipos
        const mockTickets = [
          ...Array.from({ length: 2 }, (_, i) => ({
            ticketId: `ticket-${i + 1}`,
            lineNumber: `${250000000 + i}`,
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 6 }, (_, i) => ({
            ticketId: `ticket-${i + 3}`,
            lineNumber: `${250001000 + i}`,
            type: 'INTERMITTENT_SERVICE',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 4 }, (_, i) => ({
            ticketId: `ticket-${i + 9}`,
            lineNumber: `${250002000 + i}`,
            type: 'SLOW_CONNECTION',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 5 }, (_, i) => ({
            ticketId: `ticket-${i + 13}`,
            lineNumber: `${250003000 + i}`,
            type: 'ROUTER_ISSUE',
            priority: 'LOW',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 1 }, (_, i) => ({
            ticketId: `ticket-${i + 18}`,
            lineNumber: '250004000',
            type: 'OTHER',
            priority: 'PENDING',
            status: 'RECEIVED',
            createdAt: new Date().toISOString(),
          })),
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: la suma de todos los valores de "byType" es igual a "totalTickets"
        const totalByType = Object.values(response.body.byType).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByType).toBe(response.body.totalTickets);
        expect(totalByType).toBe(18);
      });

      it('debería retornar byType como un objeto con propiedades para cada tipo de incidente', async () => {
        // Given: existen tickets en el repositorio
        const mockTickets = [
          {
            ticketId: 'ticket-1',
            lineNumber: '001',
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          },
          {
            ticketId: 'ticket-2',
            lineNumber: '002',
            type: 'INTERMITTENT_SERVICE',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          },
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: byType es un objeto con propiedades para cada tipo
        expect(response.body.byType).toHaveProperty('NO_SERVICE');
        expect(response.body.byType).toHaveProperty('INTERMITTENT_SERVICE');
        expect(response.body.byType).toHaveProperty('SLOW_CONNECTION');
        expect(response.body.byType).toHaveProperty('ROUTER_ISSUE');
        expect(response.body.byType).toHaveProperty('BILLING_QUESTION');
        expect(response.body.byType).toHaveProperty('OTHER');

        // And: todos los valores son números no negativos
        Object.values(response.body.byType).forEach((value) => {
          expect(typeof value).toBe('number');
          expect(value as number).toBeGreaterThanOrEqual(0);
        });
      });

      it('debería manejar un único ticket correctamente en la distribución por tipo', async () => {
        // Given: existe 1 ticket (valor límite mínimo) del tipo NO_SERVICE
        const mockTickets = [
          {
            ticketId: 'ticket-1',
            lineNumber: '333333333',
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          },
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const response = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el código de respuesta es 200
        expect(response.status).toBe(200);

        // And: byType.NO_SERVICE es 1
        expect(response.body.byType.NO_SERVICE).toBe(1);

        // And: la suma es igual a totalTickets que debe ser 1
        const totalByType = Object.values(response.body.byType).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByType).toBe(1);
        expect(totalByType).toBe(response.body.totalTickets);
      });
    });
  });

  describe('TC-044 — Consistencia de métricas con el repositorio', () => {
    /**
     * TC-044 — Consistencia de métricas con el repositorio
     * 
     * ID del Test: TC-044
     * ID de la Historia: HU-09
     * Descripción: Verificar que las métricas agregadas son consistentes con los datos reales del repositorio y el listado paginado.
     * Precondiciones: Existen tickets en el repositorio.
     * 
     * Pasos (Gherkin):
     * Given existen 25 tickets procesados en el sistema
     * When el operador solicita GET /api/tickets/metrics
     *   And luego solicita GET /api/tickets?page=1&limit=100
     * Then el campo "totalTickets" de las métricas es igual al campo "pagination.totalItems" del listado
     *   And la suma de "byStatus" coincide con el conteo manual de estados del listado
     *   And la suma de "byPriority" coincide con el conteo manual de prioridades del listado
     *   And la suma de "byType" coincide con el conteo manual de tipos del listado
     * 
     * Partición de equivalencia:
     * - Sin tickets: 0 tickets (Válido)
     * - Pocos tickets: 1-10 (Válido)
     * - Cantidad media: 20-30 (Válido - Escenario del test plan es 25)
     * - Muchos tickets: 100+ (Válido)
     */

    describe('Partición de equivalencia: Sin tickets (0)', () => {
      it('debería retornar métricas consistentes cuando el repositorio está vacío', async () => {
        // Given: existen 0 tickets en el sistema
        const mockTickets: any[] = [];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const metricsResponse = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: las métricas son consistentes (totalTickets = 0)
        expect(metricsResponse.status).toBe(200);
        expect(metricsResponse.body.totalTickets).toBe(0);

        // And: la suma de byStatus es igual a totalTickets
        const totalByStatus = Object.values(metricsResponse.body.byStatus).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByStatus).toBe(metricsResponse.body.totalTickets);

        // And: la suma de byPriority es igual a totalTickets
        const totalByPriority = Object.values(metricsResponse.body.byPriority).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByPriority).toBe(metricsResponse.body.totalTickets);

        // And: la suma de byType es igual a totalTickets
        const totalByType = Object.values(metricsResponse.body.byType).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByType).toBe(metricsResponse.body.totalTickets);
      });
    });

    describe('Partición de equivalencia: Pocos tickets (1-10)', () => {
      it('debería retornar métricas consistentes con 5 tickets variados', async () => {
        // Given: existen 5 tickets procesados en el sistema
        const mockTickets = [
          {
            ticketId: 'ticket-1',
            lineNumber: '001',
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'RECEIVED',
            createdAt: new Date().toISOString(),
          },
          {
            ticketId: 'ticket-2',
            lineNumber: '002',
            type: 'INTERMITTENT_SERVICE',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          },
          {
            ticketId: 'ticket-3',
            lineNumber: '003',
            type: 'SLOW_CONNECTION',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          },
          {
            ticketId: 'ticket-4',
            lineNumber: '004',
            type: 'ROUTER_ISSUE',
            priority: 'LOW',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          },
          {
            ticketId: 'ticket-5',
            lineNumber: '005',
            type: 'BILLING_QUESTION',
            priority: 'LOW',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          },
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const metricsResponse = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: totalTickets es 5
        expect(metricsResponse.status).toBe(200);
        expect(metricsResponse.body.totalTickets).toBe(5);

        // And: la suma de byStatus coincide con totalTickets
        const totalByStatus = Object.values(metricsResponse.body.byStatus).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByStatus).toBe(metricsResponse.body.totalTickets);

        // And: la suma de byPriority coincide con totalTickets
        const totalByPriority = Object.values(metricsResponse.body.byPriority).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByPriority).toBe(metricsResponse.body.totalTickets);

        // And: la suma de byType coincide con totalTickets
        const totalByType = Object.values(metricsResponse.body.byType).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByType).toBe(metricsResponse.body.totalTickets);
      });

      it('debería retornar métricas consistentes con 10 tickets', async () => {
        // Given: existen 10 tickets procesados en el sistema
        const mockTickets = Array.from({ length: 10 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${260000000 + i}`,
          type: i % 2 === 0 ? 'NO_SERVICE' : 'INTERMITTENT_SERVICE',
          priority: i % 2 === 0 ? 'HIGH' : 'MEDIUM',
          status: i % 2 === 0 ? 'RECEIVED' : 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const metricsResponse = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: totalTickets es 10
        expect(metricsResponse.status).toBe(200);
        expect(metricsResponse.body.totalTickets).toBe(10);

        // And: todas las distribuciones suman a totalTickets
        const totalByStatus = Object.values(metricsResponse.body.byStatus).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByStatus).toBe(10);

        const totalByPriority = Object.values(metricsResponse.body.byPriority).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByPriority).toBe(10);

        const totalByType = Object.values(metricsResponse.body.byType).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByType).toBe(10);
      });
    });

    describe('Partición de equivalencia: Cantidad media (20-30)', () => {
      it('debería retornar métricas consistentes con 25 tickets (escenario del test plan)', async () => {
        // Given: existen 25 tickets procesados en el sistema
        const mockTickets = [
          ...Array.from({ length: 5 }, (_, i) => ({
            ticketId: `ticket-${i + 1}`,
            lineNumber: `${270000000 + i}`,
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 8 }, (_, i) => ({
            ticketId: `ticket-${i + 6}`,
            lineNumber: `${270000100 + i}`,
            type: 'INTERMITTENT_SERVICE',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 7 }, (_, i) => ({
            ticketId: `ticket-${i + 14}`,
            lineNumber: `${270000200 + i}`,
            type: 'SLOW_CONNECTION',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 3 }, (_, i) => ({
            ticketId: `ticket-${i + 21}`,
            lineNumber: `${270000300 + i}`,
            type: 'ROUTER_ISSUE',
            priority: 'LOW',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 2 }, (_, i) => ({
            ticketId: `ticket-${i + 24}`,
            lineNumber: `${270000400 + i}`,
            type: 'OTHER',
            priority: 'PENDING',
            status: 'RECEIVED',
            createdAt: new Date().toISOString(),
          })),
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const metricsResponse = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: totalTickets es 25
        expect(metricsResponse.status).toBe(200);
        expect(metricsResponse.body.totalTickets).toBe(25);

        // And: la suma de "byStatus" coincide con totalTickets
        const totalByStatus = Object.values(metricsResponse.body.byStatus).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByStatus).toBe(25);

        // And: la suma de "byPriority" coincide con totalTickets
        const totalByPriority = Object.values(metricsResponse.body.byPriority).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByPriority).toBe(25);

        // And: la suma de "byType" coincide con totalTickets
        const totalByType = Object.values(metricsResponse.body.byType).reduce((acc: number, val) => acc + (val as number), 0);
        expect(totalByType).toBe(25);
      });

      it('debería retornar métricas consistentes con 20 tickets', async () => {
        // Given: existen 20 tickets procesados en el sistema
        const mockTickets = Array.from({ length: 20 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${280000000 + i}`,
          type: 'NO_SERVICE',
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const metricsResponse = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: totalTickets es 20
        expect(metricsResponse.status).toBe(200);
        expect(metricsResponse.body.totalTickets).toBe(20);

        // And: todas las sumas coinciden
        const totalByStatus = Object.values(metricsResponse.body.byStatus).reduce((acc: number, val) => acc + (val as number), 0);
        const totalByPriority = Object.values(metricsResponse.body.byPriority).reduce((acc: number, val) => acc + (val as number), 0);
        const totalByType = Object.values(metricsResponse.body.byType).reduce((acc: number, val) => acc + (val as number), 0);

        expect(totalByStatus).toBe(20);
        expect(totalByPriority).toBe(20);
        expect(totalByType).toBe(20);
      });
    });

    describe('Partición de equivalencia: Muchos tickets (100+)', () => {
      it('debería retornar métricas consistentes con 100 tickets', async () => {
        // Given: existen 100 tickets procesados en el sistema
        const mockTickets = Array.from({ length: 100 }, (_, i) => ({
          ticketId: `ticket-${i + 1}`,
          lineNumber: `${290000000 + i}`,
          type: i % 6 === 0 ? 'NO_SERVICE' : i % 6 === 1 ? 'INTERMITTENT_SERVICE' : i % 6 === 2 ? 'SLOW_CONNECTION' : i % 6 === 3 ? 'ROUTER_ISSUE' : i % 6 === 4 ? 'BILLING_QUESTION' : 'OTHER',
          priority: i % 4 === 0 ? 'HIGH' : i % 4 === 1 ? 'MEDIUM' : i % 4 === 2 ? 'LOW' : 'PENDING',
          status: i % 2 === 0 ? 'RECEIVED' : 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
        }));

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const metricsResponse = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: totalTickets es 100
        expect(metricsResponse.status).toBe(200);
        expect(metricsResponse.body.totalTickets).toBe(100);

        // And: todas las sumas son consistentes con totalTickets
        const totalByStatus = Object.values(metricsResponse.body.byStatus).reduce((acc: number, val) => acc + (val as number), 0);
        const totalByPriority = Object.values(metricsResponse.body.byPriority).reduce((acc: number, val) => acc + (val as number), 0);
        const totalByType = Object.values(metricsResponse.body.byType).reduce((acc: number, val) => acc + (val as number), 0);

        expect(totalByStatus).toBe(100);
        expect(totalByPriority).toBe(100);
        expect(totalByType).toBe(100);
      });
    });

    describe('Validación de consistencia de conteos agregados', () => {
      it('debería confirmar que cada métrica se cuenta una sola vez', async () => {
        // Given: existen 15 tickets variados
        const mockTickets = [
          ...Array.from({ length: 8 }, (_, i) => ({
            ticketId: `ticket-${i + 1}`,
            lineNumber: `${300000000 + i}`,
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 7 }, (_, i) => ({
            ticketId: `ticket-${i + 9}`,
            lineNumber: `${300000100 + i}`,
            type: 'BILLING_QUESTION',
            priority: 'LOW',
            status: 'RECEIVED',
            createdAt: new Date().toISOString(),
          })),
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const metricsResponse = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: el total de tickets es 15
        expect(metricsResponse.body.totalTickets).toBe(15);

        // And: cada categoría suma exactamente 15 (sin duplicados)
        const totalByStatus = Object.values(metricsResponse.body.byStatus).reduce((acc: number, val) => acc + (val as number), 0);
        const totalByPriority = Object.values(metricsResponse.body.byPriority).reduce((acc: number, val) => acc + (val as number), 0);
        const totalByType = Object.values(metricsResponse.body.byType).reduce((acc: number, val) => acc + (val as number), 0);

        expect(totalByStatus).toBe(15);
        expect(totalByPriority).toBe(15);
        expect(totalByType).toBe(15);

        // And: no hay descuadres en los conteos
        expect(totalByStatus).toBe(metricsResponse.body.totalTickets);
        expect(totalByPriority).toBe(metricsResponse.body.totalTickets);
        expect(totalByType).toBe(metricsResponse.body.totalTickets);
      });

      it('debería garantizar que cada distribución es independently accuracy', async () => {
        // Given: existen 12 tickets con distribuciones variadas
        const mockTickets = [
          ...Array.from({ length: 5 }, (_, i) => ({
            ticketId: `ticket-status-received-${i + 1}`,
            lineNumber: `${310000000 + i}`,
            type: 'NO_SERVICE',
            priority: 'HIGH',
            status: 'RECEIVED',
            createdAt: new Date().toISOString(),
          })),
          ...Array.from({ length: 7 }, (_, i) => ({
            ticketId: `ticket-status-inprogress-${i + 1}`,
            lineNumber: `${310000100 + i}`,
            type: 'SLOW_CONNECTION',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          })),
        ];

        const incidentRepository = mockIncidentRepository;
        incidentRepository.findAll.mockResolvedValue(mockTickets);

        // When: el operador solicita GET /api/tickets/metrics
        const metricsResponse = await request(app)
          .get('/api/tickets/metrics')
          .expect('Content-Type', /json/);

        // Then: totalTickets es 12
        expect(metricsResponse.body.totalTickets).toBe(12);

        // And: byStatus.RECEIVED es 5 y byStatus.IN_PROGRESS es 7
        expect(metricsResponse.body.byStatus.RECEIVED).toBe(5);
        expect(metricsResponse.body.byStatus.IN_PROGRESS).toBe(7);

        // And: byPriority.HIGH es 5 y byPriority.MEDIUM es 7
        expect(metricsResponse.body.byPriority.HIGH).toBe(5);
        expect(metricsResponse.body.byPriority.MEDIUM).toBe(7);

        // And: byType.NO_SERVICE es 5 y byType.SLOW_CONNECTION es 7
        expect(metricsResponse.body.byType.NO_SERVICE).toBe(5);
        expect(metricsResponse.body.byType.SLOW_CONNECTION).toBe(7);
      });
    });
  });
});
