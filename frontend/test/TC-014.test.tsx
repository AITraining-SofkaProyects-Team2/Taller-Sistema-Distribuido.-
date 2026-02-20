import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PriorityFilter from '../../src/components/filters/PriorityFilter'; // Ajustar el import según la estructura real del frontend

/**
 * TC-014 — Visualizar prioridades disponibles
 * Historia de Usuario: HU-03
 *
 * Descripción: Verificar que el sistema expone o permite conocer las prioridades disponibles para filtrar.
 * Precondiciones: El sistema está operativo.
 * Servicio(s): Frontend (renderizado de selector/dropdown con todas las prioridades del dominio)
 *
 * Partición de equivalencia:
 *   - Todas las prioridades del dominio | 'HIGH', 'MEDIUM', 'LOW', 'PENDING' | Válido
 *   - Prioridades no existentes | Cualquier valor fuera del enum | No debe mostrarse
 */

describe('TC-014 — Visualizar prioridades disponibles (HU-03)', () => {
  it('debe mostrar todas las opciones de prioridad del dominio en el selector', () => {
    // Given el sistema está operativo
    render(<PriorityFilter />);

    // When el operador accede a la interfaz de filtros de prioridad
    // Then se muestran las siguientes opciones disponibles: "HIGH", "MEDIUM", "LOW", "PENDING"
    const options = screen.getAllByRole('option').map(opt => opt.textContent);
    expect(options).toEqual(expect.arrayContaining(['HIGH', 'MEDIUM', 'LOW', 'PENDING']));
    expect(options.length).toBe(4);
  });

  it('no debe mostrar prioridades fuera del dominio', () => {
    render(<PriorityFilter />);
    const options = screen.getAllByRole('option').map(opt => opt.textContent);
    expect(options).not.toEqual(expect.arrayContaining(['CRITICAL', 'URGENT', 'NORMAL', '']));
  });
});
