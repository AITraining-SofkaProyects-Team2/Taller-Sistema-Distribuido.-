/**
 * Utilidades para generación y descarga de archivos CSV
 * HU-11: Exportación de resultados en formato CSV
 */

export interface CSVTicket {
  ticketId: string;
  lineNumber: string;
  type: string;
  description: string | null;
  priority: string;
  status: string;
  createdAt: string;
  processedAt: string | null;
}

/**
 * Genera una cadena CSV a partir de un array de tickets
 * @param tickets Array de tickets a exportar
 * @returns Cadena CSV formateada con headers y datos
 */
export const generateCSV = (tickets: CSVTicket[]): string => {
  const headers = ['ticketId', 'lineNumber', 'type', 'description', 'priority', 'status', 'createdAt', 'processedAt'];
  const csvHeaders = headers.join(',');

  const rows = tickets.map((ticket) => {
    const values = [
      ticket.ticketId,
      ticket.lineNumber,
      ticket.type,
      // Escapar descripción si contiene caracteres especiales
      ticket.description ? `"${ticket.description.replace(/"/g, '""')}"` : '',
      ticket.priority,
      ticket.status,
      ticket.createdAt,
      ticket.processedAt || '',
    ];
    return values.join(',');
  });

  return [csvHeaders, ...rows].join('\n');
};

/**
 * Descarga un archivo CSV en el navegador
 * @param csvData Contenido CSV a descargar
 * @param fileName Nombre del archivo (sin extensión)
 * @param timestamp Si es true, agrega fecha al nombre del archivo
 */
export const downloadCSV = (csvData: string, fileName: string, timestamp = true): void => {
  const timestamp_suffix = timestamp ? `_${new Date().toISOString().split('T')[0]}` : '';
  const finalFileName = `${fileName}${timestamp_suffix}.csv`;

  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = finalFileName;
  link.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Exporta tickets a CSV y dispara descarga
 * @param tickets Array de tickets a exportar
 * @param fileName Nombre del archivo (sin extensión)
 */
export const exportTicketsToCSV = (tickets: CSVTicket[], fileName: string = 'tickets'): void => {
  const csvData = generateCSV(tickets);
  downloadCSV(csvData, fileName, true);
};

/**
 * Valida si hay datos disponibles para exportar
 * @param tickets Array de tickets
 * @param filtersActive Indica si hay filtros activos
 * @returns Mensaje de error si hay problema, null si es válido
 */
export const validateExportData = (tickets: CSVTicket[], filtersActive: boolean): string | null => {
  if (tickets.length === 0) {
    if (filtersActive) {
      return 'No hay resultados que coincidan con los filtros aplicados';
    }
    return 'No hay tickets disponibles para exportar';
  }
  return null;
};
