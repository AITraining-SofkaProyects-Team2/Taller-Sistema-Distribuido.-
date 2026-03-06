import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/index'; // Ajustar el import según la estructura real del Query Service

/**
 * TC-035 — Ordenar por fecha ascendente
 * TC-036 — Ordenar por fecha descendente
 * TC-037 — Ordenar por prioridad
 * TC-038 — Ordenar por estado
 * TC-039 — Campo de ordenamiento inválido
 * Historia de Usuario: HU-08
 *
 * Descripción: Verificar el ordenamiento de resultados por diferentes campos y el manejo de errores para campos inválidos.
 * Precondiciones: Existen tickets con diferentes fechas de creación, prioridades y estados.
 * Servicio(s): Query Service (aplicación de sortBy/sortOrder)
 */

describe('HU-08 — Ordenamiento de resultados', () => {
  it('TC-035: debe ordenar los tickets por fecha ascendente (más antiguo primero)', async () => {
    // Given existen tickets con las siguientes fechas de creación:
    // | ticketId | createdAt                |
    // | T-001    | 2026-02-18T10:00:00Z     |
    // | T-002    | 2026-02-15T10:00:00Z     |
    // | T-003    | 2026-02-20T10:00:00Z     |
    // When el operador solicita GET /api/tickets?sortBy=createdAt&sortOrder=asc
    const res = await request(app)
      .get('/api/tickets?sortBy=createdAt&sortOrder=asc')
      .expect(200);
    // Then los tickets se retornan en el orden: "T-002", "T-001", "T-003"
    const ids = res.body.data.map((t: any) => t.ticketId);
    expect(ids).toEqual(['T-002', 'T-001', 'T-003']);
    // Y cada ticket tiene una fecha de creación menor o igual a la del siguiente
    for (let i = 0; i < res.body.data.length - 1; i++) {
      expect(new Date(res.body.data[i].createdAt).getTime()).toBeLessThanOrEqual(
        new Date(res.body.data[i + 1].createdAt).getTime()
      );
    }
  });

  it('TC-036: debe ordenar los tickets por fecha descendente (más reciente primero)', async () => {
    const res = await request(app)
      .get('/api/tickets?sortBy=createdAt&sortOrder=desc')
      .expect(200);
    const ids = res.body.data.map((t: any) => t.ticketId);
    expect(ids).toEqual(['T-003', 'T-001', 'T-002']);
    for (let i = 0; i < res.body.data.length - 1; i++) {
      expect(new Date(res.body.data[i].createdAt).getTime()).toBeGreaterThanOrEqual(
        new Date(res.body.data[i + 1].createdAt).getTime()
      );
    }
  });

  it('TC-037: debe ordenar los tickets por prioridad (HIGH > MEDIUM > LOW > PENDING)', async () => {
    // Given existen tickets con las siguientes prioridades:
    // | ticketId | priority |
    // | T-001    | LOW      |
    // | T-002    | HIGH     |
    // | T-003    | MEDIUM   |
    // | T-004    | PENDING  |
    const res = await request(app)
      .get('/api/tickets?sortBy=priority&sortOrder=desc')
      .expect(200);
    const ids = res.body.data.map((t: any) => t.ticketId);
    expect(ids).toEqual(['T-002', 'T-003', 'T-001', 'T-004']);
    const priorityOrder = ['HIGH', 'MEDIUM', 'LOW', 'PENDING'];
    for (let i = 0; i < res.body.data.length - 1; i++) {
      expect(priorityOrder.indexOf(res.body.data[i].priority)).toBeLessThanOrEqual(
        priorityOrder.indexOf(res.body.data[i + 1].priority)
      );
    }
  });

  it('TC-038: debe ordenar los tickets por estado', async () => {
    // Given existen tickets con los siguientes estados:
    // | ticketId | status      |
    // | T-001    | IN_PROGRESS|
    // | T-002    | RECEIVED   |
    // | T-003    | IN_PROGRESS|
    // | T-004    | RECEIVED   |
    const res = await request(app)
      .get('/api/tickets?sortBy=status&sortOrder=asc')
      .expect(200);
    const ids = res.body.data.map((t: any) => t.ticketId);
    // El orden esperado depende del criterio de ordenamiento de estados definido en el dominio
    // Aquí se asume RECEIVED < IN_PROGRESS
    expect(ids).toEqual(['T-002', 'T-004', 'T-001', 'T-003']);
    const statusOrder = ['RECEIVED', 'IN_PROGRESS'];
    for (let i = 0; i < res.body.data.length - 1; i++) {
      expect(statusOrder.indexOf(res.body.data[i].status)).toBeLessThanOrEqual(
        statusOrder.indexOf(res.body.data[i + 1].status)
      );
    }
  });

  it('TC-039: debe rechazar campo de ordenamiento inválido con HTTP 400', async () => {
    const res = await request(app)
      .get('/api/tickets?sortBy=notAField')
      .expect(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/campo.*ordenamiento.*inválido/i);
  });
});
