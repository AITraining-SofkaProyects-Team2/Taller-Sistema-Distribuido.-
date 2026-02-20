// HU-06: Búsqueda por ID de ticket
// Como operador, quiero buscar un ticket por su ID exacto para acceder
// rápidamente a un caso específico. Si no existe, se muestra un mensaje claro.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TicketQueryService } from '../services/TicketQueryService';
import { ITicketRepository } from '../repositories/ITicketRepository';
import { Ticket } from '../types/Ticket';

// ─────────────────────────────────────────────────────────────────────────────
// TC-028 — Buscar por ID de ticket existente
// ─────────────────────────────────────────────────────────────────────────────
describe('TC-028 — Buscar por ID de ticket existente', () => {
  let mockRepository: ITicketRepository;
  let service: TicketQueryService;

  const EXISTING_UUID = '550e8400-e29b-41d4-a716-446655440000';

  const existingTicket: Ticket = {
    ticketId: EXISTING_UUID,
    lineNumber: '0991234567',
    type: 'NO_SERVICE',
    description: null,
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    processedAt: new Date('2026-01-01T01:00:00.000Z'),
  };

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn().mockResolvedValue(existingTicket),
      findAll: vi.fn(),
      findByLineNumber: vi.fn(),
      getMetrics: vi.fn(),
    } as unknown as ITicketRepository;

    service = new TicketQueryService(mockRepository);
  });

  // ── Partición de equivalencia: UUIDv4 válido y existente ──────────────────

  describe('Given existe un ticket con ticketId "550e8400-e29b-41d4-a716-446655440000" en el sistema', () => {
    it('When se solicita findById con ese UUID, Then retorna el ticket (no nulo)', async () => {
      // Given
      const ticketId = EXISTING_UUID;

      // When
      const result = await service.findById(ticketId);

      // Then
      expect(result).not.toBeNull();
    });

    it('When se solicita findById con ese UUID, Then el ticketId del resultado coincide exactamente', async () => {
      // Given
      const ticketId = EXISTING_UUID;

      // When
      const result = await service.findById(ticketId);

      // Then
      expect(result?.ticketId).toBe(EXISTING_UUID);
    });

    it('When se solicita findById, Then la respuesta incluye el campo "ticketId"', async () => {
      const result = await service.findById(EXISTING_UUID);
      expect(result).toHaveProperty('ticketId');
    });

    it('When se solicita findById, Then la respuesta incluye el campo "lineNumber"', async () => {
      const result = await service.findById(EXISTING_UUID);
      expect(result).toHaveProperty('lineNumber');
    });

    it('When se solicita findById, Then la respuesta incluye el campo "type"', async () => {
      const result = await service.findById(EXISTING_UUID);
      expect(result).toHaveProperty('type');
    });

    it('When se solicita findById, Then la respuesta incluye el campo "description"', async () => {
      const result = await service.findById(EXISTING_UUID);
      expect(result).toHaveProperty('description');
    });

    it('When se solicita findById, Then la respuesta incluye el campo "priority"', async () => {
      const result = await service.findById(EXISTING_UUID);
      expect(result).toHaveProperty('priority');
    });

    it('When se solicita findById, Then la respuesta incluye el campo "status"', async () => {
      const result = await service.findById(EXISTING_UUID);
      expect(result).toHaveProperty('status');
    });

    it('When se solicita findById, Then la respuesta incluye el campo "createdAt"', async () => {
      const result = await service.findById(EXISTING_UUID);
      expect(result).toHaveProperty('createdAt');
    });

    it('When se solicita findById, Then la respuesta incluye el campo "processedAt"', async () => {
      const result = await service.findById(EXISTING_UUID);
      expect(result).toHaveProperty('processedAt');
    });

    it('When se solicita findById, Then el repositorio es invocado exactamente una vez con el ID correcto', async () => {
      // When
      await service.findById(EXISTING_UUID);

      // Then
      expect(mockRepository.findById).toHaveBeenCalledOnce();
      expect(mockRepository.findById).toHaveBeenCalledWith(EXISTING_UUID);
    });

    it('When se solicita findById, Then los valores del ticket retornado coinciden con los datos almacenados', async () => {
      // When
      const result = await service.findById(EXISTING_UUID);

      // Then — verificar integridad de datos (partición EP válida)
      expect(result?.ticketId).toBe(existingTicket.ticketId);
      expect(result?.lineNumber).toBe(existingTicket.lineNumber);
      expect(result?.type).toBe(existingTicket.type);
      expect(result?.description).toBeNull();
      expect(result?.priority).toBe(existingTicket.priority);
      expect(result?.status).toBe(existingTicket.status);
      expect(result?.createdAt).toEqual(existingTicket.createdAt);
      expect(result?.processedAt).toEqual(existingTicket.processedAt);
    });

    it('When se solicita findById, Then el servicio NO lanza excepción para un UUID existente', async () => {
      // Then — no debe rechazar
      await expect(service.findById(EXISTING_UUID)).resolves.not.toThrow();
    });
  });
});
