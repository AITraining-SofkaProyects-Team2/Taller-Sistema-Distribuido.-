import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
// Ajusta la importación de la app según la estructura real del Query Service
import app from '../src/app'; // Suponiendo que el entrypoint es app.ts

/**
 * TC-001 — Listado paginado con tamaño por defecto
 * Historia de Usuario: HU-01
 *
 * Precondiciones:
 *   - Existen al menos 25 tickets procesados en el repositorio del query-service.
 *
 * Pasos (Gherkin):
 *   Given existen 25 tickets procesados en el sistema
 *     And no se especifica el parámetro "limit" en la solicitud
 *   When el operador solicita GET /api/tickets
 *   Then el código de respuesta es 200
 *     And el campo "data" contiene exactamente 20 tickets
 *     And el campo "pagination.page" es 1
 *     And el campo "pagination.limit" es 20
 *     And el campo "pagination.totalItems" es 25
 *     And el campo "pagination.totalPages" es 2
 */

describe('TC-001 — Listado paginado con tamaño por defecto (HU-01)', () => {
  beforeAll(async () => {
    // Aquí deberías poblar el repositorio con 25 tickets de prueba
    // Esto puede requerir acceso directo al repositorio o a un endpoint de test
    // Por ejemplo:
    // await seedTickets(25);
    // O lanzar un script de seed si existe
  });

  it('debe retornar 20 tickets y paginación correcta cuando no se especifica limit', async () => {
    const res = await request(app)
      .get('/api/tickets')
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(20);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(20);
    expect(res.body.pagination.totalItems).toBe(25);
    expect(res.body.pagination.totalPages).toBe(2);
  });
});

/**
 * TC-002 — Listado paginado con tamaño configurable
 * Historia de Usuario: HU-01
 *
 * Precondiciones:
 *   - Existen 50 tickets procesados en el repositorio del query-service.
 *
 * Pasos (Gherkin):
 *   Given existen 50 tickets procesados en el sistema
 *   When el operador solicita GET /api/tickets?limit=10
 *   Then el código de respuesta es 200
 *     And el campo "data" contiene exactamente 10 tickets
 *     And el campo "pagination.limit" es 10
 *     And el campo "pagination.totalPages" es 5
 */

describe('TC-002 — Listado paginado con tamaño configurable (HU-01)', () => {
  beforeAll(async () => {
    // Aquí deberías poblar el repositorio con 50 tickets de prueba
    // await seedTickets(50);
  });

  it('debe retornar 10 tickets y paginación correcta cuando limit=10', async () => {
    const res = await request(app)
      .get('/api/tickets?limit=10')
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(10);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.limit).toBe(10);
    expect(res.body.pagination.totalPages).toBe(5);
  });
});
