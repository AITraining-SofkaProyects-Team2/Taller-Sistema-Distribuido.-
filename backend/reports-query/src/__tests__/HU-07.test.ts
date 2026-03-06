// HU-07: Búsqueda por número de línea
// Como operador, quiero buscar tickets por número de línea para revisar
// todas las quejas asociadas a un cliente específico.

import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { TicketQueryService } from '../services/TicketQueryService';
import { ITicketRepository } from '../repositories/ITicketRepository';
import type { Ticket } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// TC-032 — Buscar por número de línea válido con resultados
// ─────────────────────────────────────────────────────────────────────────────
describe('TC-032 — Buscar por número de línea válido con resultados', () => {
  let mockRepository: ITicketRepository;
  let service: TicketQueryService;

  const VALID_LINE_NUMBER = '0991234567';

  const ticketsForLine: Ticket[] = [
    {
      ticketId: '550e8400-e29b-41d4-a716-446655440001',
      lineNumber: VALID_LINE_NUMBER,
      email: 'client1@example.com',
      type: 'NO_SERVICE',
      description: null,
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      createdAt: '2026-01-01T00:00:00.000Z',
      processedAt: '2026-01-01T01:00:00.000Z',
    },
    {
      ticketId: '550e8400-e29b-41d4-a716-446655440002',
      lineNumber: VALID_LINE_NUMBER,
      email: 'client1@example.com',
      type: 'INTERMITTENT_SERVICE',
      description: null,
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      createdAt: '2026-01-02T00:00:00.000Z',
      processedAt: '2026-01-02T01:00:00.000Z',
    },
    {
      ticketId: '550e8400-e29b-41d4-a716-446655440003',
      lineNumber: VALID_LINE_NUMBER,
      email: 'client1@example.com',
      type: 'SLOW_CONNECTION',
      description: null,
      priority: 'MEDIUM',
      status: 'RECEIVED',
      createdAt: '2026-01-03T00:00:00.000Z',
      processedAt: '2026-01-03T01:00:00.000Z',
    },
  ];

  // ── Partición de equivalencia: número de línea válido (10 dígitos) con resultados ──

  describe('Given existen 3 tickets con lineNumber "0991234567" en el sistema', () => {
    let result: Ticket[];

    beforeAll(async () => {
      mockRepository = {
        findById: vi.fn(),
        findAll: vi.fn(),
        findByLineNumber: vi.fn().mockResolvedValue(ticketsForLine),
        getMetrics: vi.fn(),
      } as unknown as ITicketRepository;
      service = new TicketQueryService(mockRepository);
      result = await service.findByLineNumber(VALID_LINE_NUMBER);
    });

    it('Then retorna un resultado no nulo', () => {
      expect(result).not.toBeNull();
    });

    it('Then retorna un arreglo', () => {
      expect(Array.isArray(result)).toBe(true);
    });

    it('Then retorna exactamente 3 tickets', () => {
      expect(result).toHaveLength(3);
    });

    it('Then todos los tickets tienen lineNumber igual a "0991234567"', () => {
      for (const ticket of result) {
        expect(ticket.lineNumber).toBe(VALID_LINE_NUMBER);
      }
    });

    it('Then el repositorio es invocado exactamente una vez', () => {
      expect(mockRepository.findByLineNumber).toHaveBeenCalledOnce();
    });

    it('Then el repositorio es invocado con el argumento correcto', () => {
      expect(mockRepository.findByLineNumber).toHaveBeenCalledWith(VALID_LINE_NUMBER);
    });

    it('Then el servicio NO lanza excepción (resultado resuelto sin error)', () => {
      expect(result).toBeDefined();
    });

    it('Then cada ticket incluye todos los campos requeridos', () => {
      const REQUIRED_FIELDS = ['ticketId', 'lineNumber', 'type', 'description', 'priority', 'status', 'createdAt', 'processedAt'];
      for (const ticket of result) {
        for (const field of REQUIRED_FIELDS) {
          expect(ticket).toHaveProperty(field);
        }
      }
    });

    // ── Valor límite: longitud exacta de 10 dígitos ───────────────────────────

    it('El número de línea tiene exactamente 10 dígitos (valor límite válido)', () => {
      expect(VALID_LINE_NUMBER).toHaveLength(10);
      expect(result).toHaveLength(3);
    });

    it('Then el método findById del repositorio NO es invocado', () => {
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TC-033 — Buscar por número de línea válido sin resultados
// ─────────────────────────────────────────────────────────────────────────────
describe('TC-033 — Buscar por número de línea válido sin resultados', () => {
  let mockRepository: ITicketRepository;
  let service: TicketQueryService;

  const VALID_LINE_NUMBER_NO_RESULTS = '0880000000';

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findAll: vi.fn(),
      findByLineNumber: vi.fn().mockResolvedValue([]),
      getMetrics: vi.fn(),
    } as unknown as ITicketRepository;

    service = new TicketQueryService(mockRepository);
  });

  describe('Given no existen tickets con el número de línea solicitado', () => {
    it('When se solicita findByLineNumber con un número válido sin coincidencias, Then retorna un arreglo vacío', async () => {
      const result = await service.findByLineNumber(VALID_LINE_NUMBER_NO_RESULTS);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('When se solicita findByLineNumber con un número válido sin coincidencias, Then el repositorio es invocado con el argumento correcto', async () => {
      await service.findByLineNumber(VALID_LINE_NUMBER_NO_RESULTS);
      expect(mockRepository.findByLineNumber).toHaveBeenCalledOnce();
      expect(mockRepository.findByLineNumber).toHaveBeenCalledWith(VALID_LINE_NUMBER_NO_RESULTS);
    });

    it('When se solicita findByLineNumber con un número válido sin coincidencias, Then no lanza excepción', async () => {
      await expect(service.findByLineNumber(VALID_LINE_NUMBER_NO_RESULTS)).resolves.not.toThrow();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TC-034 — Buscar con número de línea inválido
// ─────────────────────────────────────────────────────────────────────────────
describe('TC-034 — Buscar con número de línea inválido', () => {
  let mockRepository: ITicketRepository;
  let service: TicketQueryService;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findAll: vi.fn(),
      findByLineNumber: vi.fn(),
      getMetrics: vi.fn(),
    } as unknown as ITicketRepository;

    service = new TicketQueryService(mockRepository);
  });

  // ── Tabla de decisión ─────────────────────────────────────────────────────
  // | Valor           | Solo dígitos | Longitud 10 | Resultado         |
  // |-----------------|:------------:|:-----------:|-------------------|
  // | "099ABC4567"    |      ✗       |      ✓      | Error validación  |
  // | "099-123-456"   |      ✗       |      ✓      | Error validación  |
  // | "+593991234567" |      ✗       |      ✗      | Error validación  |
  // | "   "           |      ✗       |      ✗      | Error validación  |
  // | "099123456"     |      ✓       |      ✗ (9)  | Error validación  |
  // | "09912345678"   |      ✓       |      ✗ (11) | Error validación  |

  it.each([
    ['099ABC4567',    'con letras'],
    ['099-123-456',   'con guiones'],
    ['+593991234567', 'con prefijo internacional'],
    ['   ',           'solo espacios'],
    ['099123456',     '9 dígitos — límite inferior'],
    ['09912345678',   '11 dígitos — límite superior'],
  ])('When lineNumber es "%s" (%s), Then lanza error y NO invoca el repositorio', async (input) => {
    await expect(service.findByLineNumber(input)).rejects.toThrow();
    expect(mockRepository.findByLineNumber).not.toHaveBeenCalled();
  });
});
