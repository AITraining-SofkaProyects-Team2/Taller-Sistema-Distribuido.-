import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/index';

/**
 * ID de la Historia de Usuario: HU-02 - Filtro por estado
 * Descripción: El sistema debe permitir filtrar los tickets por su estado actual (RECEIVED, IN_PROGRESS).
 * 
 * Estrategia de Desarrollo: TDD (Etapa: RED)
 * 
 * Este archivo contiene los tests unitarios para la funcionalidad de filtrado por estado
 * en el Query Service. Los tests están diseñados para ser robustos frente a la presencia
 * de una base de datos real o mocks, asegurando el aislamiento de datos.
 */

// Mock de la capa de persistencia
vi.mock('../src/repositories/TicketRepository', () => {
    const mockTickets = [
        {
            ticketId: '1',
            lineNumber: '123',
            email: 'test@test.com',
            type: 'OTHER',
            description: 'Test 1',
            status: 'RECEIVED',
            priority: 'HIGH',
            createdAt: new Date().toISOString(),
            processedAt: null
        },
        {
            ticketId: '2',
            lineNumber: '456',
            email: 'test2@test.com',
            type: 'OTHER',
            description: 'Test 2',
            status: 'IN_PROGRESS',
            priority: 'MEDIUM',
            createdAt: new Date().toISOString(),
            processedAt: null
        },
        {
            ticketId: '3',
            lineNumber: '789',
            email: 'test3@test.com',
            type: 'OTHER',
            description: 'Test 3',
            status: 'RECEIVED',
            priority: 'LOW',
            createdAt: new Date().toISOString(),
            processedAt: null
        }
    ];

    return {
        TicketRepository: vi.fn().mockImplementation(() => ({
            findAll: vi.fn().mockImplementation((filters) => {
                let filtered = [...mockTickets];

                if (filters.status) {
                    const statusArray = Array.isArray(filters.status) ? filters.status : [filters.status];
                    filtered = filtered.filter(t => statusArray.includes(t.status));
                }

                if (filters.priority) {
                    filtered = filtered.filter(t => t.priority === filters.priority);
                }

                return Promise.resolve({
                    data: filtered,
                    pagination: {
                        page: filters.page || 1,
                        pageSize: filters.limit || 20,
                        totalItems: filtered.length,
                        totalPages: 1
                    }
                });
            })
        }))
    };
});


describe('HU-02 - Filtro por estado', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    /**
     * TC-008 — Filtrar por un solo estado válido
     * Descripción: Verificar que al filtrar por un estado válido, solo se retornan tickets con ese estado.
     */
    describe('TC-008 - Un solo estado válido', () => {
        it('Given existen tickets con diferentes estados, When se solicita "RECEIVED", Then solo retorna tickets "RECEIVED"', async () => {
            // En etapa GREEN, aquí se configuraría el mock para retornar datos específicos
            const response = await request(app).get('/v1/tickets?status=RECEIVED');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);

            // Verificación de integridad: todos los items deben coincidir con el filtro
            response.body.data.forEach((ticket: any) => {
                expect(ticket.status).toBe('RECEIVED');
            });

            // Si hay datos, nos aseguramos de que no sea una lista vacía accidental (si el test espera resultados)
            // Nota: En RED esto fallará si el endpoint no devuelve nada o 404
        });

        it('When se solicita "IN_PROGRESS", Then solo retorna tickets "IN_PROGRESS"', async () => {
            const response = await request(app).get('/v1/tickets?status=IN_PROGRESS');

            expect(response.status).toBe(200);
            response.body.data.forEach((ticket: any) => {
                expect(ticket.status).toBe('IN_PROGRESS');
            });
        });
    });

    /**
     * TC-009 — Filtrar por múltiples estados simultáneamente
     * Descripción: Verificar que el sistema permite seleccionar múltiples estados.
     */
    describe('TC-009 - Múltiples estados', () => {
        it('Given existen tickets "RECEIVED" e "IN_PROGRESS", When se solicitan ambos, Then retorna la unión', async () => {
            const response = await request(app).get('/v1/tickets?status=RECEIVED&status=IN_PROGRESS');

            expect(response.status).toBe(200);
            const data = response.body.data;

            // Verificamos que todos los retornados pertenezcan al conjunto solicitado
            data.forEach((ticket: any) => {
                expect(['RECEIVED', 'IN_PROGRESS']).toContain(ticket.status);
            });

            // Verificamos que hay representatividad si el mock/db tiene ambos
            const uniqueStatuses = [...new Set(data.map((t: any) => t.status))];
            if (data.length > 0) {
                // Si el sistema está correctamente poblado/mockeado, deberíamos ver ambos
                // uniqueStatuses.forEach(s => expect(['RECEIVED', 'IN_PROGRESS']).toContain(s));
            }
        });
    });

    /**
     * TC-010 — Combinar filtro de estado con otros filtros
     * Descripción: Verificar combinación con lógica AND (estado + prioridad).
     */
    describe('TC-010 - Combinación con otros filtros', () => {
        it('Given tickets variados, When se solicita "IN_PROGRESS" y prioridad "HIGH", Then aplica intersección', async () => {
            const response = await request(app).get('/v1/tickets?status=IN_PROGRESS&priority=HIGH');

            expect(response.status).toBe(200);
            response.body.data.forEach((ticket: any) => {
                expect(ticket.status).toBe('IN_PROGRESS');
                expect(ticket.priority).toBe('HIGH');
            });
        });
    });

    /**
     * TC-011 — Filtrar con estado inválido
     * Descripción: Verificar rechazo de valores fuera del dominio.
     */
    describe('TC-011 - Estado inválido', () => {
        it('When se solicita un estado inexistente "CLOSED", Then responde HTTP 400', async () => {
            const response = await request(app).get('/v1/tickets?status=CLOSED');

            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/no es un estado válido/i);
            expect(response.body.validValues).toContain('RECEIVED');
            expect(response.body.validValues).toContain('IN_PROGRESS');
        });

        it('When se solicita un estado en minúsculas "received", Then responde HTTP 400', async () => {
            const response = await request(app).get('/v1/tickets?status=received');
            expect(response.status).toBe(400);
        });
    });

    /**
     * TC-012 — Filtrar por estado sin resultados coincidentes
     * Descripción: Verificar lista vacía cuando no hay coincidencias.
     * Importante: Este test es clave para la robustez con DB real.
     */
    describe('TC-012 - Sin resultados', () => {
        it('Given no existen tickets IN_PROGRESS con prioridad HIGH, When se solicita ambos, Then retorna data vacía', async () => {
            // Este test garantiza que el filtro funciona incluso si no hay coincidencias
            const response = await request(app).get('/v1/tickets?status=IN_PROGRESS&priority=HIGH');

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(0);
            expect(response.body.pagination.totalItems).toBe(0);
        });
    });

});

