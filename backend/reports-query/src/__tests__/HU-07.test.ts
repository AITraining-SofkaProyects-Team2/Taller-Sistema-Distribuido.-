// HU-07: Búsqueda por número de línea
// Como operador, quiero buscar tickets por número de línea para revisar
// todas las quejas asociadas a un cliente específico.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TicketQueryService } from '../services/TicketQueryService';
import { ITicketRepository } from '../repositories/ITicketRepository';
import { Ticket } from '../types/Ticket';

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
      type: 'NO_SERVICE',
      description: null,
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      processedAt: new Date('2026-01-01T01:00:00.000Z'),
    },
    {
      ticketId: '550e8400-e29b-41d4-a716-446655440002',
      lineNumber: VALID_LINE_NUMBER,
      type: 'INTERMITTENT_SERVICE',
      description: null,
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      createdAt: new Date('2026-01-02T00:00:00.000Z'),
      processedAt: new Date('2026-01-02T01:00:00.000Z'),
    },
    {
      ticketId: '550e8400-e29b-41d4-a716-446655440003',
      lineNumber: VALID_LINE_NUMBER,
      type: 'SLOW_CONNECTION',
      description: null,
      priority: 'MEDIUM',
      status: 'RECEIVED',
      createdAt: new Date('2026-01-03T00:00:00.000Z'),
      processedAt: new Date('2026-01-03T01:00:00.000Z'),
    },
  ];

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findAll: vi.fn(),
      findByLineNumber: vi.fn().mockResolvedValue(ticketsForLine),
      getMetrics: vi.fn(),
    } as unknown as ITicketRepository;

    service = new TicketQueryService(mockRepository);
  });

  // ── Partición de equivalencia: número de línea válido (10 dígitos) con resultados ──

  describe('Given existen 3 tickets con lineNumber "0991234567" en el sistema', () => {

    it('When se solicita findByLineNumber("0991234567"), Then retorna un resultado no nulo', async () => {
      const result = await service.findByLineNumber(VALID_LINE_NUMBER);
      expect(result).not.toBeNull();
    });

    it('When se solicita findByLineNumber("0991234567"), Then retorna un arreglo', async () => {
      const result = await service.findByLineNumber(VALID_LINE_NUMBER);
      expect(Array.isArray(result)).toBe(true);
    });

    it('When se solicita findByLineNumber("0991234567"), Then retorna exactamente 3 tickets', async () => {
      const result = await service.findByLineNumber(VALID_LINE_NUMBER);
      expect(result).toHaveLength(3);
    });

    it('When se solicita findByLineNumber("0991234567"), Then todos los tickets tienen lineNumber igual a "0991234567"', async () => {
      const result = await service.findByLineNumber(VALID_LINE_NUMBER);
      for (const ticket of result) {
        expect(ticket.lineNumber).toBe(VALID_LINE_NUMBER);
      }
    });

    it('When se solicita findByLineNumber("0991234567"), Then el repositorio es invocado exactamente una vez', async () => {
      await service.findByLineNumber(VALID_LINE_NUMBER);
      expect(mockRepository.findByLineNumber).toHaveBeenCalledOnce();
    });

    it('When se solicita findByLineNumber("0991234567"), Then el repositorio es invocado con el argumento correcto', async () => {
      await service.findByLineNumber(VALID_LINE_NUMBER);
      expect(mockRepository.findByLineNumber).toHaveBeenCalledWith(VALID_LINE_NUMBER);
    });

    it('When se solicita findByLineNumber("0991234567"), Then el servicio NO lanza excepción', async () => {
      await expect(service.findByLineNumber(VALID_LINE_NUMBER)).resolves.not.toThrow();
    });

    it('When se solicita findByLineNumber("0991234567"), Then cada ticket del resultado incluye todos los campos requeridos', async () => {
      const result = await service.findByLineNumber(VALID_LINE_NUMBER);
      for (const ticket of result) {
        for (const field of ['ticketId', 'lineNumber', 'type', 'description', 'priority', 'status', 'createdAt', 'processedAt']) {
          expect(ticket).toHaveProperty(field);
        }
      }
    });

    // ── Valor límite: longitud exacta de 10 dígitos ───────────────────────────

    it('When se solicita findByLineNumber con exactamente 10 dígitos, Then retorna los tickets correspondientes', async () => {
      // Valor límite: longitud correcta esperada (10 dígitos)
      expect(VALID_LINE_NUMBER).toHaveLength(10);
      const result = await service.findByLineNumber(VALID_LINE_NUMBER);
      expect(result).toHaveLength(3);
    });

    it('When se solicita findByLineNumber("0991234567"), Then el método findById del repositorio NO es invocado', async () => {
      await service.findByLineNumber(VALID_LINE_NUMBER);
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

  // ── Partición de equivalencia: números de línea con letras ────────────────

  describe('Given un lineNumber que contiene letras', () => {
    it('When se solicita findByLineNumber("099ABC4567"), Then el servicio lanza un error de validación', async () => {
      await expect(service.findByLineNumber('099ABC4567')).rejects.toThrow();
    });

    it('When se solicita findByLineNumber("099ABC4567"), Then el repositorio NO es invocado', async () => {
      await service.findByLineNumber('099ABC4567').catch(() => {});
      expect(mockRepository.findByLineNumber).not.toHaveBeenCalled();
    });
  });

  // ── Partición de equivalencia: números de línea con caracteres especiales ─

  describe('Given un lineNumber que contiene guiones', () => {
    it('When se solicita findByLineNumber("099-123-456"), Then el servicio lanza un error de validación', async () => {
      await expect(service.findByLineNumber('099-123-456')).rejects.toThrow();
    });

    it('When se solicita findByLineNumber("099-123-456"), Then el repositorio NO es invocado', async () => {
      await service.findByLineNumber('099-123-456').catch(() => {});
      expect(mockRepository.findByLineNumber).not.toHaveBeenCalled();
    });
  });

  describe('Given un lineNumber que contiene prefijo internacional', () => {
    it('When se solicita findByLineNumber("+593991234567"), Then el servicio lanza un error de validación', async () => {
      await expect(service.findByLineNumber('+593991234567')).rejects.toThrow();
    });

    it('When se solicita findByLineNumber("+593991234567"), Then el repositorio NO es invocado', async () => {
      await service.findByLineNumber('+593991234567').catch(() => {});
      expect(mockRepository.findByLineNumber).not.toHaveBeenCalled();
    });
  });

  // ── Partición de equivalencia: solo espacios ──────────────────────────────

  describe('Given un lineNumber compuesto solo de espacios', () => {
    it('When se solicita findByLineNumber("   "), Then el servicio lanza un error de validación', async () => {
      await expect(service.findByLineNumber('   ')).rejects.toThrow();
    });

    it('When se solicita findByLineNumber("   "), Then el repositorio NO es invocado', async () => {
      await service.findByLineNumber('   ').catch(() => {});
      expect(mockRepository.findByLineNumber).not.toHaveBeenCalled();
    });
  });

  // ── Valores límite: longitud ───────────────────────────────────────────────

  describe('Valores límite de longitud', () => {
    it('When se solicita findByLineNumber con 9 dígitos (por debajo del mínimo), Then lanza error de validación', async () => {
      // Valor límite inferior: 9 dígitos → inválido (se esperan exactamente 10)
      await expect(service.findByLineNumber('099123456')).rejects.toThrow();
    });

    it('When se solicita findByLineNumber con 9 dígitos, Then el repositorio NO es invocado', async () => {
      await service.findByLineNumber('099123456').catch(() => {});
      expect(mockRepository.findByLineNumber).not.toHaveBeenCalled();
    });

    it('When se solicita findByLineNumber con 11 dígitos (por encima del máximo), Then lanza error de validación', async () => {
      // Valor límite superior: 11 dígitos → inválido
      await expect(service.findByLineNumber('09912345678')).rejects.toThrow();
    });

    it('When se solicita findByLineNumber con 11 dígitos, Then el repositorio NO es invocado', async () => {
      await service.findByLineNumber('09912345678').catch(() => {});
      expect(mockRepository.findByLineNumber).not.toHaveBeenCalled();
    });
  });

  // ── Tabla de decisión ─────────────────────────────────────────────────────
  // | Valor           | Solo dígitos | Longitud 10 | Resultado         |
  // |-----------------|:------------:|:-----------:|-------------------|
  // | "0991234567"    |      ✓       |      ✓      | OK (ver TC-032)   |
  // | "099ABC4567"    |      ✗       |      ✓      | Error validación  |
  // | "099-123-456"   |      ✗       |      ✓      | Error validación  |
  // | "+593991234567" |      ✗       |      ✗      | Error validación  |
  // | "   "           |      ✗       |      ✗      | Error validación  |
  // | "099123456"     |      ✓       |      ✗ (9)  | Error validación  |
  // | "09912345678"   |      ✓       |      ✗ (11) | Error validación  |
});
