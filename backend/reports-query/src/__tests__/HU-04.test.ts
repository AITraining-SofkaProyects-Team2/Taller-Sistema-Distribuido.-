import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';

/**
 * HISTORIA DE USUARIO: HU-04 - Filtro por tipo de incidente
 * 
 * -----------------------------------------------------------------------------
 * ID Test: TC-018
 * Descripción: Filtrar por tipo de incidente válido
 * Precondiciones: Existen tickets de diferentes tipos de incidente en el repositorio.
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
 * When el operador solicita GET /api/tickets?incidentType=NO_SERVICE
 * Then el código de respuesta es 200
 *   And todos los tickets en "data" tienen el campo "type" igual a "NO_SERVICE"
 *   And el campo "pagination.totalItems" es 3
 * 
 * Partición de equivalencia:
 * - Válidos: NO_SERVICE, INTERMITTENT_SERVICE, SLOW_CONNECTION, ROUTER_ISSUE, BILLING_QUESTION, OTHER
 * - Inválidos: no_service (lowercase), HARDWARE_FAILURE, DNS_ISSUE
 * 
 * Valores límites:
 * - NO_SERVICE: Tipo con prioridad más alta mapeada
 * - OTHER: Tipo que requiere descripción
 * -----------------------------------------------------------------------------
 */

describe('HU-04 - Filtro por tipo de incidente (Query Service)', () => {

    describe('TC-018 - Filtrar por tipo de incidente válido', () => {
        it('debe retornar solo tickets del tipo solicitado (NO_SERVICE)', async () => {
            // Nota: En TDD etapa RED, asumimos que los datos existen o el mock responde según el Given
            const response = await request(app)
                .get('/api/tickets?incidentType=NO_SERVICE')
                .expect(200);

            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.every((t: any) => t.type === 'NO_SERVICE')).toBe(true);
            expect(response.body.pagination.totalItems).toBe(3);
        });

        it('debe retornar solo tickets del tipo solicitado (OTHER)', async () => {
            const response = await request(app)
                .get('/api/tickets?incidentType=OTHER')
                .expect(200);

            expect(response.body.data.every((t: any) => t.type === 'OTHER')).toBe(true);
            expect(response.body.pagination.totalItems).toBe(1);
        });
    });

    /**
     * -----------------------------------------------------------------------------
     * ID Test: TC-020
     * Descripción: Combinar filtro de tipo con estado y prioridad
     * Precondiciones: Existen tickets variados en el repositorio.
     * 
     * Pasos (Gherkin):
     * Given existen tickets con las siguientes combinaciones:
     *   | ticketId | type               | status      | priority |
     *   | T-001    | NO_SERVICE         | IN_PROGRESS | HIGH     |
     *   | T-002    | SLOW_CONNECTION    | IN_PROGRESS | MEDIUM   |
     *   | T-003    | NO_SERVICE         | RECEIVED    | PENDING  |
     *   | T-004    | BILLING_QUESTION   | IN_PROGRESS | LOW      |
     * When el operador solicita GET /api/tickets?incidentType=NO_SERVICE&status=IN_PROGRESS&priority=HIGH
     * Then el código de respuesta es 200
     *   And el campo "pagination.totalItems" es 1
     *   And el ticket retornado es "T-001"
     *   And el ticket tiene type "NO_SERVICE", status "IN_PROGRESS" y priority "HIGH"
     * 
     * Tabla de Decisión:
     * | incidentType | status      | priority | Resultado |
     * |--------------|-------------|----------|-----------|
     * | NO_SERVICE   | IN_PROGRESS | HIGH     | T-001      |
     * | NO_SERVICE   | No espec.   | No espec. | T-001, T-003 |
     * -----------------------------------------------------------------------------
     */
    describe('TC-020 - Combinar filtro de tipo con estado y prioridad', () => {
        it('debe retornar la intersección de los tres filtros (AND)', async () => {
            const response = await request(app)
                .get('/api/tickets?incidentType=NO_SERVICE&status=IN_PROGRESS&priority=HIGH')
                .expect(200);

            expect(response.body.pagination.totalItems).toBe(1);
            expect(response.body.data[0].type).toBe('NO_SERVICE');
            expect(response.body.data[0].status).toBe('IN_PROGRESS');
            expect(response.body.data[0].priority).toBe('HIGH');
        });

        it('debe retornar resultados consistentes con la tabla de decisión (solo tipo)', async () => {
            const response = await request(app)
                .get('/api/tickets?incidentType=NO_SERVICE')
                .expect(200);

            expect(response.body.pagination.totalItems).toBe(2); // Basado en T-001 y T-003
        });
    });

    /**
     * -----------------------------------------------------------------------------
     * ID Test: TC-021
     * Descripción: Filtrar con tipo de incidente inválido
     * Precondiciones: Existen tickets en el repositorio.
     * 
     * Pasos (Gherkin):
     * Given existen tickets procesados en el sistema
     * When el operador solicita GET /api/tickets?incidentType=HARDWARE_FAILURE
     * Then el código de respuesta es 400
     *   And la respuesta contiene un mensaje de error indicando que "HARDWARE_FAILURE" no es un tipo de incidente válido
     * 
     * Partición de equivalencia:
     * - Tipos inventados: HARDWARE_FAILURE, DNS_ISSUE -> Inválido
     * - Valores numéricos: 1, 2 -> Inválido
     * - Cadena vacía: "" -> Inválido
     * -----------------------------------------------------------------------------
     */
    describe('TC-021 - Filtrar con tipo de incidente inválido', () => {
        it('debe retornar 400 cuando el tipo no existe en el dominio', async () => {
            const response = await request(app)
                .get('/api/tickets?incidentType=HARDWARE_FAILURE')
                .expect(400);

            expect(response.body.error).toBeDefined();
            expect(response.body.message).toMatch(/tipo de incidente no es válido/i);
        });

        it('debe retornar 400 cuando el valor es numérico', async () => {
            await request(app)
                .get('/api/tickets?incidentType=123')
                .expect(400);
        });

        it('debe ser sensible a mayúsculas según contrato (no_service es inválido)', async () => {
            await request(app)
                .get('/api/tickets?incidentType=no_service')
                .expect(400);
        });
    });
});
