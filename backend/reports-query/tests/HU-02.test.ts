import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/index';

/**
 * ID de la Historia de Usuario: HU-02 - Filtro por estado
 * Descripción: El sistema debe permitir filtrar los tickets por su estado actual (RECEIVED, IN_PROGRESS).
 * 
 * Estrategia de Desarrollo: TDD (Etapa: RED)
 * 
 * Este archivo contiene los tests unitarios para la funcionalidad de filtrado por estado
 * en el Query Service. Los tests están diseñados para fallar inicialmente (HTTP 404 o 
 * falta de lógica de filtrado) hasta que se implemente la funcionalidad.
 */

describe('HU-02 - Filtro por estado', () => {

    /**
     * TC-008 — Filtrar por un solo estado válido
     * Descripción: Verificar que al filtrar por un estado válido, solo se retornan tickets con ese estado.
     * Precondiciones: Existen tickets con estado "RECEIVED" y "IN_PROGRESS".
     */
    describe('TC-008 - Un solo estado válido', () => {
        it('Given existen tickets con diferentes estados, When se solicita "RECEIVED", Then solo retorna tickets "RECEIVED"', async () => {
            // Mocking or pre-loading data would happen here in implementation stage
            // For now, we test the endpoint directly expecting it to work when implemented

            const response = await request(app).get('/api/tickets?status=RECEIVED');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            response.body.data.forEach((ticket: any) => {
                expect(ticket.status).toBe('RECEIVED');
            });
            // Partición de equivalencia válida: "RECEIVED"
        });

        it('When se solicita "IN_PROGRESS", Then solo retorna tickets "IN_PROGRESS"', async () => {
            const response = await request(app).get('/api/tickets?status=IN_PROGRESS');

            expect(response.status).toBe(200);
            response.body.data.forEach((ticket: any) => {
                expect(ticket.status).toBe('IN_PROGRESS');
            });
            // Partición de equivalencia válida: "IN_PROGRESS"
        });
    });

    /**
     * TC-009 — Filtrar por múltiples estados simultáneamente
     * Descripción: Verificar que el sistema permite seleccionar múltiples estados.
     * Precondiciones: Existen tickets con ambos estados.
     */
    describe('TC-009 - Múltiples estados', () => {
        it('Given existen tickets "RECEIVED" e "IN_PROGRESS", When se solicitan ambos, Then retorna la unión', async () => {
            const response = await request(app).get('/api/tickets?status=RECEIVED&status=IN_PROGRESS');

            expect(response.status).toBe(200);
            const statuses = response.body.data.map((t: any) => t.status);
            const uniqueStatuses = [...new Set(statuses)];
            expect(uniqueStatuses).toContain('RECEIVED');
            expect(uniqueStatuses).toContain('IN_PROGRESS');
            // Partición de equivalencia: status=RECEIVED&status=IN_PROGRESS
        });
    });

    /**
     * TC-010 — Combinar filtro de estado con otros filtros
     * Descripción: Verificar combinación con lógica AND (estado + prioridad).
     */
    describe('TC-010 - Combinación con otros filtros', () => {
        it('Given tickets variados, When se solicita "IN_PROGRESS" y prioridad "HIGH", Then aplica intersección', async () => {
            const response = await request(app).get('/api/tickets?status=IN_PROGRESS&priority=HIGH');

            expect(response.status).toBe(200);
            response.body.data.forEach((ticket: any) => {
                expect(ticket.status).toBe('IN_PROGRESS');
                expect(ticket.priority).toBe('HIGH');
            });
            // Tabla de Decisión: status=Especificado, priority=Especificado
        });
    });

    /**
     * TC-011 — Filtrar con estado inválido
     * Descripción: Verificar rechazo de valores fuera del dominio.
     */
    describe('TC-011 - Estado inválido', () => {
        it('When se solicita un estado inexistente "CLOSED", Then responde HTTP 400', async () => {
            const response = await request(app).get('/api/tickets?status=CLOSED');

            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/no es un estado válido/i);
            expect(response.body.validValues).toContain('RECEIVED');
            expect(response.body.validValues).toContain('IN_PROGRESS');
            // Partición de equivalencia inválida: "CLOSED"
        });

        it('When se solicita un estado en minúsculas "received", Then responde HTTP 400', async () => {
            const response = await request(app).get('/api/tickets?status=received');
            expect(response.status).toBe(400);
        });
    });

    /**
     * TC-012 — Filtrar por estado sin resultados coincidentes
     * Descripción: Verificar lista vacía cuando no hay coincidencias.
     */
    describe('TC-012 - Sin resultados', () => {
        it('Given solo existen tickets "IN_PROGRESS", When se solicita "RECEIVED", Then retorna data vacía', async () => {
            // Este test requiere un setup específico de datos en la etapa GREEN
            const response = await request(app).get('/api/tickets?status=RECEIVED');

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
            expect(response.body.pagination.totalItems).toBe(0);
        });
    });

});
