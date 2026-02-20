import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/index'; // Ajustar el import según la estructura real del Query Service

/**
 * TC-017 — Filtrar por prioridad sin resultados coincidentes
 * Historia de Usuario: HU-03
 *
 * Descripción: Verificar que el sistema retorna una lista vacía cuando no hay tickets con la prioridad filtrada.
 * Precondiciones: Existen solo tickets con prioridad HIGH y MEDIUM.
 * Servicio(s): Query Service (filtrado sin resultados) + Frontend (renderizado de lista vacía)
 */

describe('TC-017 — Filtrar por prioridad sin resultados coincidentes (HU-03)', () => {
  it('debe retornar lista vacía y totalItems 0 cuando no existen tickets con la prioridad filtrada', async () => {
    // Given existen solo tickets con prioridad HIGH y MEDIUM
    // When el operador solicita GET /api/tickets?priority=PENDING
    const res = await request(app)
      .get('/api/tickets?priority=PENDING')
      .expect(200);
    // Then el campo "data" es un arreglo vacío y totalItems es 0
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
    expect(res.body.pagination.totalItems).toBe(0);
  });
});
/**
 * TC-016 — Filtrar con prioridad inválida
 * Historia de Usuario: HU-03
 *
 * Descripción: Verificar que el sistema rechaza valores de prioridad no pertenecientes al dominio.
 * Precondiciones: Existen tickets en el repositorio.
 * Servicio(s): Query Service (validación de valores de `priority`, HTTP 400)
 *
 * Partición de equivalencia:
 *   - Prioridades del dominio | 'HIGH', 'MEDIUM', 'LOW', 'PENDING' | Válido
 *   - Prioridades inventadas | 'CRITICAL', 'URGENT', 'NORMAL' | Inválido
 *   - Numérico | '1', '2', '3' | Inválido
 *   - Vacío | '' | Inválido
 */

describe('TC-016 — Filtrar con prioridad inválida (HU-03)', () => {
  it('debe rechazar prioridad inventada (CRITICAL) con HTTP 400 y mensaje claro', async () => {
    const res = await request(app)
      .get('/api/tickets?priority=CRITICAL')
      .expect(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/CRITICAL.*prioridad.*válida/i);
    expect(res.body.error).toMatch(/HIGH|MEDIUM|LOW|PENDING/);
  });

  it('debe rechazar prioridad inventada (URGENT) con HTTP 400 y mensaje claro', async () => {
    const res = await request(app)
      .get('/api/tickets?priority=URGENT')
      .expect(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/URGENT.*prioridad.*válida/i);
    expect(res.body.error).toMatch(/HIGH|MEDIUM|LOW|PENDING/);
  });

  it('debe rechazar prioridad numérica (1) con HTTP 400', async () => {
    const res = await request(app)
      .get('/api/tickets?priority=1')
      .expect(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/prioridad.*válida/i);
  });

  it('debe rechazar prioridad vacía con HTTP 400', async () => {
    const res = await request(app)
      .get('/api/tickets?priority=')
      .expect(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/prioridad.*válida/i);
  });
});

/**
 * TC-013 — Filtrar por prioridad válida
 * Historia de Usuario: HU-03
 *
 * Descripción: Verificar que al filtrar por una prioridad válida, solo se retornan tickets con esa prioridad.
 * Precondiciones: Existen tickets con prioridades HIGH, MEDIUM, LOW y PENDING en el repositorio.
 * Servicio(s): Query Service (filtrado por `priority` en query) + Frontend (selector de prioridad, renderizado)
 *
 * Partición de equivalencia:
 *   - Prioridad HIGH | 'HIGH' | Válido
 *   - Prioridad MEDIUM | 'MEDIUM' | Válido
 *   - Prioridad LOW | 'LOW' | Válido
 *   - Prioridad PENDING | 'PENDING' | Válido
 *   - Prioridad en minúsculas | 'high', 'medium' | Inválido
 *   - Prioridad inexistente | 'CRITICAL', 'URGENT' | Inválido
 *
 * Valores límites:
 *   - 'HIGH' | Prioridad más alta | Solo tickets HIGH
 *   - 'PENDING' | Prioridad más baja / sin resolver | Solo tickets PENDING
 */

describe('TC-013 — Filtrar por prioridad válida (HU-03)', () => {
  it('debe retornar solo tickets con prioridad HIGH y totalItems correcto', async () => {
    // Given existen tickets con las siguientes prioridades:
    // | priority | cantidad |
    // | HIGH     | 5        |
    // | MEDIUM   | 8        |
    // | LOW      | 10       |
    // | PENDING  | 2        |
    // (Preparación de datos: se asume que el repositorio está poblado para la prueba E2E)

    // When el operador solicita GET /api/tickets?priority=HIGH
    const res = await request(app)
      .get('/api/tickets?priority=HIGH')
      .expect(200);

    // Then todos los tickets en "data" tienen el campo "priority" igual a "HIGH"
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(5);
    expect(res.body.pagination.totalItems).toBe(5);
    res.body.data.forEach((ticket: any) => {
      expect(ticket.priority).toBe('HIGH');
    });
  });

  it('debe retornar solo tickets con prioridad PENDING y totalItems correcto', async () => {
    const res = await request(app)
      .get('/api/tickets?priority=PENDING')
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination.totalItems).toBe(2);
    res.body.data.forEach((ticket: any) => {
      expect(ticket.priority).toBe('PENDING');
    });
  });

  it('debe retornar solo tickets con prioridad MEDIUM y totalItems correcto', async () => {
    const res = await request(app)
      .get('/api/tickets?priority=MEDIUM')
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(8);
    expect(res.body.pagination.totalItems).toBe(8);
    res.body.data.forEach((ticket: any) => {
      expect(ticket.priority).toBe('MEDIUM');
    });
  });

  it('debe retornar solo tickets con prioridad LOW y totalItems correcto', async () => {
    const res = await request(app)
      .get('/api/tickets?priority=LOW')
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(10);
    expect(res.body.pagination.totalItems).toBe(10);
    res.body.data.forEach((ticket: any) => {
      expect(ticket.priority).toBe('LOW');
    });
  });
});


/**
 * TC-015 — Combinar filtro de prioridad con otros filtros
 * Historia de Usuario: HU-03
 *
 * Descripción: Verificar que el filtro de prioridad se combina correctamente con otros filtros activos.
 * Precondiciones: Existen tickets variados en el repositorio.
 * Servicio(s): Query Service (combinación de filtros múltiples) + Frontend (múltiples selectores)
 *
 * Tabla de Decisión:
 * | priority | status | incidentType | Tickets retornados |
 * |:--------:|:------:|:------------:|:------------------:|
 * | HIGH | IN_PROGRESS | No especificado | T-001, T-002 |
 * | HIGH | No especificado | NO_SERVICE | T-001 |
 * | MEDIUM | IN_PROGRESS | No especificado | T-003 |
 * | No especificado | No especificado | No especificado | T-001, T-002, T-003, T-004 |
 */

describe('TC-015 — Combinar filtro de prioridad con otros filtros (HU-03)', () => {
  it('debe retornar solo tickets con priority HIGH y status IN_PROGRESS', async () => {
    // Given existen tickets con las siguientes combinaciones:
    // | ticketId | priority | status      | type               |
    // | T-001    | HIGH     | IN_PROGRESS | NO_SERVICE         |
    // | T-002    | HIGH     | IN_PROGRESS | SLOW_CONNECTION    |
    // | T-003    | MEDIUM   | IN_PROGRESS | INTERMITTENT_SERVICE |
    // | T-004    | HIGH     | RECEIVED    | OTHER              |
    // (Preparación de datos: se asume que el repositorio está poblado para la prueba E2E)

    // When el operador solicita GET /api/tickets?priority=HIGH&status=IN_PROGRESS
    const res = await request(app)
      .get('/api/tickets?priority=HIGH&status=IN_PROGRESS')
      .expect(200);

    // Then todos los tickets tienen priority "HIGH" y status "IN_PROGRESS"
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination.totalItems).toBe(2);
    res.body.data.forEach((ticket: any) => {
      expect(ticket.priority).toBe('HIGH');
      expect(ticket.status).toBe('IN_PROGRESS');
    });
  });

  it('debe retornar solo tickets con priority HIGH y type NO_SERVICE', async () => {
    const res = await request(app)
      .get('/api/tickets?priority=HIGH&type=NO_SERVICE')
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].priority).toBe('HIGH');
    expect(res.body.data[0].type).toBe('NO_SERVICE');
  });

  it('debe retornar solo tickets con priority MEDIUM y status IN_PROGRESS', async () => {
    const res = await request(app)
      .get('/api/tickets?priority=MEDIUM&status=IN_PROGRESS')
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].priority).toBe('MEDIUM');
    expect(res.body.data[0].status).toBe('IN_PROGRESS');
  });

  it('debe retornar todos los tickets si no hay filtros', async () => {
    const res = await request(app)
      .get('/api/tickets')
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(4);
    const ids = res.body.data.map((t: any) => t.ticketId);
    expect(ids).toEqual(expect.arrayContaining(['T-001', 'T-002', 'T-003', 'T-004']));
  });
});
