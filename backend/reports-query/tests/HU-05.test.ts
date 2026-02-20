import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/index';

/**
 * HU-05 - Filtro por rango de fechas
 * 
 * Este archivo contiene los tests unitarios (de integración de API) para la historia de usuario HU-05.
 * Se sigue el enfoque TDD (Etapa RED), por lo que estos tests fallarán inicialmente debido a que
 * la funcionalidad no está implementada en el Query Service.
 */

describe('HU-05 - Filtro por rango de fechas', () => {

  describe('TC-022 - Query Service + Frontend - Filtrar por rango de fechas válido', () => {
    /**
     * ID del Test: TC-022
     * Descripción: Verificar que al especificar un rango de fechas válido (dateFrom ≤ dateTo), 
     * solo se retornan tickets cuya fecha de creación esté dentro del rango.
     * Pasos (Gherkin):
     *   Given existen tickets con fechas de creación en enero, febrero y marzo 2026
     *   When el operador solicita GET /api/tickets?dateFrom=2026-02-01T00:00:00Z&dateTo=2026-02-28T23:59:59Z
     *   Then el código de respuesta es 200
     *     And el campo "pagination.totalItems" es 3
     *     And los tickets retornados corresponden a febrero
     */
    it('debe filtrar correctamente los tickets dentro de un rango de fechas válido', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .query({ 
          dateFrom: '2026-02-01T00:00:00Z', 
          dateTo: '2026-02-28T23:59:59Z' 
        });

      // RED: Esperamos 200 pero probablemente devuelva algo distinto o no filtre (depende de la implementación actual de index.ts)
      // Actualmente index.ts solo tiene /health, por lo que /api/tickets devolverá 404.
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.pagination.totalItems).toBeGreaterThan(0);
      
      // Verificar que todos los tickets retornados están en el rango
      response.body.data.forEach((ticket: any) => {
        const createdAt = new Date(ticket.createdAt).getTime();
        const from = new Date('2026-02-01T00:00:00Z').getTime();
        const to = new Date('2026-02-28T23:59:59Z').getTime();
        expect(createdAt).toBeGreaterThanOrEqual(from);
        expect(createdAt).toBeLessThanOrEqual(to);
      });
    });
  });

  describe('TC-023 - Query Service + Frontend - Validar que fecha fin sea mayor o igual a fecha inicio', () => {
    /**
     * ID del Test: TC-023
     * Descripción: Verificar que el sistema rechaza un rango donde la fecha de fin es anterior a la fecha de inicio.
     * Pasos (Gherkin):
     *   Given existen tickets procesados en el sistema
     *   When el operador solicita GET /api/tickets?dateFrom=2026-03-01T00:00:00Z&dateTo=2026-02-01T00:00:00Z
     *   Then el código de respuesta es 400
     *     And la respuesta contiene un mensaje de error indicando que "dateTo" debe ser mayor o igual a "dateFrom"
     */
    it('debe rechazar un rango de fechas invertido con HTTP 400', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .query({ 
          dateFrom: '2026-03-01T00:00:00Z', 
          dateTo: '2026-02-01T00:00:00Z' 
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/dateTo.*mayor.*igual.*dateFrom/i);
    });
  });

  describe('TC-024 - Query Service + Frontend - Rango de fechas sin resultados coincidentes', () => {
    /**
     * ID del Test: TC-024
     * Descripción: Verificar que el sistema retorna lista vacía cuando no existen tickets en el rango de fechas especificado.
     * Pasos (Gherkin):
     *   Given existen tickets en enero 2026 (y ninguno en 2027)
     *   When el operador solicita GET /api/tickets?dateFrom=2027-12-01T00:00:00Z&dateTo=2027-12-31T23:59:59Z
     *   Then el código de respuesta es 200
     *     And el campo "data" es un arreglo vacío
     *     And el campo "pagination.totalItems" es 0
     */
    it('debe retornar una lista vacía si no hay resultados en el rango', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .query({ 
          dateFrom: '2027-12-01T00:00:00Z', 
          dateTo: '2027-12-31T23:59:59Z' 
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.totalItems).toBe(0);
    });
  });

  describe('TC-025 - Query Service + Frontend - Filtrar con solo fecha inicio (sin fecha fin)', () => {
    /**
     * ID del Test: TC-025
     * Descripción: Verificar que al especificar solo dateFrom, se retornan todos los tickets desde esa fecha en adelante.
     * Pasos (Gherkin):
     *   Given existen tickets en enero, febrero y marzo 2026
     *   When el operador solicita GET /api/tickets?dateFrom=2026-02-01T00:00:00Z
     *   Then el código de respuesta es 200
     *     And se retornan tickets de febrero y marzo solamente
     */
    it('debe filtrar correctamente usando solo dateFrom', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .query({ 
          dateFrom: '2026-02-01T00:00:00Z' 
        });

      expect(response.status).toBe(200);
      response.body.data.forEach((ticket: any) => {
        const createdAt = new Date(ticket.createdAt).getTime();
        const from = new Date('2026-02-01T00:00:00Z').getTime();
        expect(createdAt).toBeGreaterThanOrEqual(from);
      });
    });
  });

  describe('TC-026 - Query Service + Frontend - Filtrar con solo fecha fin (sin fecha inicio)', () => {
    /**
     * ID del Test: TC-026
     * Descripción: Verificar que al especificar solo dateTo, se retornan todos los tickets hasta esa fecha.
     * Pasos (Gherkin):
     *   Given existen tickets en enero, febrero y marzo 2026
     *   When el operador solicita GET /api/tickets?dateTo=2026-02-28T23:59:59Z
     *   Then el código de respuesta es 200
     *     And se retornan tickets de enero y febrero solamente
     */
    it('debe filtrar correctamente usando solo dateTo', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .query({ 
          dateTo: '2026-02-28T23:59:59Z' 
        });

      expect(response.status).toBe(200);
      response.body.data.forEach((ticket: any) => {
        const createdAt = new Date(ticket.createdAt).getTime();
        const to = new Date('2026-02-28T23:59:59Z').getTime();
        expect(createdAt).toBeLessThanOrEqual(to);
      });
    });
  });

  describe('TC-027 - Query Service + Frontend - Fechas con formato inválido', () => {
    /**
     * ID del Test: TC-027
     * Descripción: Verificar que el sistema rechaza fechas con formato no ISO-8601 con HTTP 400.
     * Pasos (Gherkin):
     *   Given existen tickets en el sistema
     *   When el operador solicita GET /api/tickets?dateFrom=15-02-2026
     *   Then el código de respuesta es 400
     *     And la respuesta indica formato de fecha inválido
     */
    it('debe rechazar formatos de fecha inválidos con HTTP 400', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .query({ 
          dateFrom: '15-02-2026' 
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/formato.*inválido/i);
    });

    it('debe rechazar valores que no son fechas con HTTP 400', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .query({ 
          dateFrom: 'not-a-date' 
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/formato.*inválido/i);
    });
  });

});
