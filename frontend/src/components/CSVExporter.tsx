import { memo, useCallback } from 'react';
import type { CSVTicket } from '../utils/csv';
import { exportTicketsToCSV, validateExportData } from '../utils/csv';

export interface CSVExporterProps {
  tickets: CSVTicket[];
  filtersActive?: boolean;
  onBeforeExport?: (ticketCount: number) => void;
  onExportError?: (error: Error) => void;
  className?: string;
  buttonClassName?: string;
}

/**
 * CSVExporter — Componente para exportar tickets a CSV
 * 
 * Proporciona un botón para descargar los tickets actuales en formato CSV,
 * respetando los filtros aplicados y mostrando mensajes apropiados.
 * 
 * @component
 */
export const CSVExporter = memo<CSVExporterProps>(
  ({
    tickets,
    filtersActive = false,
    onBeforeExport,
    onExportError,
    className = '',
    buttonClassName = '',
  }) => {
    const handleExport = useCallback(() => {
      try {
        // Validar si hay datos
        const validationMessage = validateExportData(tickets, filtersActive);
        
        if (validationMessage) {
          // Mostrar advertencia pero permitir exportación de solo encabezados
          console.warn(validationMessage);
        }

        // Ejecutar hook antes de exportar
        if (onBeforeExport) {
          onBeforeExport(tickets.length);
        }

        // Exportar a CSV
        exportTicketsToCSV(tickets, 'tickets');
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Error desconocido al exportar');
        console.error('Error en exportación de CSV:', err);
        
        if (onExportError) {
          onExportError(err);
        }
      }
    }, [tickets, filtersActive, onBeforeExport, onExportError]);

    const isDisabled = tickets.length === 0;
    const validationMessage = validateExportData(tickets, filtersActive);

    return (
      <div
        data-testid="csv-exporter"
        className={`csv-exporter ${className}`.trim()}
        role="region"
        aria-label="Herramienta de exportación de tickets"
      >
        <button
          data-testid="export-csv-button"
          onClick={handleExport}
          disabled={isDisabled}
          className={`csv-exporter__button ${buttonClassName}`.trim()}
          title={validationMessage || 'Descargar tickets en formato CSV'}
          aria-label={validationMessage || 'Exportar tickets a CSV'}
        >
          <span className="csv-exporter__icon">📥</span>
          <span className="csv-exporter__text">Exportar CSV</span>
        </button>

        {/* Mostrar indicador de cantidad de tickets */}
        <span
          data-testid="export-ticket-count"
          className="csv-exporter__count"
          aria-live="polite"
        >
          {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
        </span>

        {/* Mostrar mensaje de validación si aplica */}
        {validationMessage && (
          <div
            data-testid="export-validation-message"
            className="csv-exporter__message csv-exporter__message--warning"
            role="status"
            aria-live="assertive"
          >
            ⚠️ {validationMessage}
          </div>
        )}
      </div>
    );
  }
);

CSVExporter.displayName = 'CSVExporter';

export default CSVExporter;
