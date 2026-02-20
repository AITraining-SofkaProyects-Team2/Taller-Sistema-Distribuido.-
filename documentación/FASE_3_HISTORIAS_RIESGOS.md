# 🧩 FASE 3: Historias de Usuario y Matriz de Riesgos

## Dashboard de Gestion de Reportes - Sistema Distribuido ISP

---

## 📘 Historias de Usuario (HU)

### HU-01 - Listado de tickets con paginacion
**Como** operador
**Quiero** ver una lista paginada de tickets
**Para** navegar grandes volumenes sin perder rendimiento

**Criterios de aceptacion**
- Se muestran tickets paginados con tamano configurable
- Se indica total de resultados y pagina actual
- El ordenamiento se mantiene entre paginas

---

### HU-02 - Filtro por estado
**Como** operador
**Quiero** filtrar tickets por estado
**Para** priorizar el seguimiento operativo

**Criterios de aceptacion**
- Permite seleccionar uno o varios estados
- Los resultados reflejan solo los estados seleccionados
- El filtro se combina con otros filtros

---

### HU-03 - Filtro por prioridad
**Como** operador
**Quiero** filtrar tickets por prioridad
**Para** identificar incidentes criticos

**Criterios de aceptacion**
- Se muestran prioridades disponibles
- Los resultados reflejan la prioridad seleccionada
- El filtro se combina con otros filtros

---

### HU-04 - Filtro por tipo de incidente
**Como** operador
**Quiero** filtrar por tipo de incidente
**Para** agrupar casos similares

**Criterios de aceptacion**
- Se listan todos los tipos de incidente
- El filtro es combinable con estado y prioridad

---

### HU-05 - Filtro por rango de fechas
**Como** operador
**Quiero** filtrar tickets por rango de fechas
**Para** analizar periodos especificos

**Criterios de aceptacion**
- Permite seleccionar fecha inicio y fin
- Se valida que fin sea mayor o igual a inicio
- Los resultados se restringen al rango

---

### HU-06 - Busqueda por ID de ticket
**Como** operador
**Quiero** buscar un ticket por ID
**Para** acceder rapidamente a un caso

**Criterios de aceptacion**
- Se permite buscar por ID exacto → `TicketQueryService.findById` retorna el ticket (TC-028 ✅ GREEN)
- Si no existe, se muestra mensaje claro → `TicketQueryService.findById` lanza `TicketNotFoundError` con mensaje "Ticket no encontrado" (TC-029 ✅ GREEN)

---

### HU-07 - Busqueda por numero de linea
**Como** operador
**Quiero** buscar tickets por numero de linea
**Para** revisar quejas de un cliente

**Criterios de aceptacion**
- Acepta un numero de linea valido
- Retorna todos los tickets asociados

---

### HU-08 - Ordenamiento de resultados
**Como** operador
**Quiero** ordenar resultados
**Para** revisar prioridades o fechas de forma eficiente

**Criterios de aceptacion**
- Permite ordenar por fecha, prioridad o estado
- Orden ascendente o descendente

---

### HU-09 - Metricas agregadas
**Como** supervisor
**Quiero** ver metricas agregadas
**Para** obtener una vision global del sistema

**Criterios de aceptacion**
- Total de tickets
- Distribucion por estado, prioridad y tipo
- Datos consistentes con el repositorio

---

### HU-10 - Visualizacion grafica
**Como** supervisor
**Quiero** ver graficas de distribucion
**Para** interpretar tendencias rapidamente

**Criterios de aceptacion**
- Graficas de barras o pastel por prioridad y estado
- Actualizacion acorde a filtros activos

---

### HU-11 - Exportacion de resultados (opcional)
**Como** analista
**Quiero** exportar resultados filtrados
**Para** analizarlos fuera del sistema

**Criterios de aceptacion**
- Exporta CSV con columnas basicas
- Respeta filtros activos

---

### HU-12 - Actualizacion manual o en tiempo real (opcional)
**Como** operador
**Quiero** actualizar los datos manualmente o en tiempo real
**Para** ver cambios recientes

**Criterios de aceptacion**
- Opcion de refresco manual
- Si hay auto-refresh, debe ser configurable

---

## 🧠 Analisis de Requerimientos (resumen)

- **RF principales**: listado, filtros, busquedas, ordenamiento, metricas, graficas
- **RF opcionales**: exportacion, actualizacion en tiempo real
- **RNF clave**: performance 50-80 tickets < 500ms, TypeScript estricto, SOLID, pruebas, error handling centralizado

---

## ⚠️ Matriz de Riesgos

| ID | Riesgo | Probabilidad | Impacto | Mitigacion |
|----|--------|--------------|---------|------------|
| R-01 | Acoplamiento entre Consumer y microservicio de consultas | Media | Alta | Definir contrato claro y desacoplar por interfaces |
| R-02 | Degradacion de rendimiento con filtros complejos | Media | Alta | Indices en BD y paginacion obligatoria |
| R-03 | Inconsistencia entre datos de lectura y escritura | Media | Media | Transacciones o estrategia de consistencia eventual |
| R-04 | Crecimiento rapido del volumen de tickets | Media | Alta | Paginacion, limites y limpieza periodica |
| R-05 | Falta de pruebas en nuevos endpoints | Baja | Alta | Cobertura obligatoria en servicios y controladores |
| R-06 | Cambios de contrato no propagados a frontend | Media | Alta | Versionado de DTOs y tests de contrato |
| R-07 | Falta de observabilidad en microservicio nuevo | Media | Media | Logging estructurado y metricas basicas |
| R-08 | Validaciones insuficientes en query params | Media | Media | Validaciones en servicio y type guards |
| R-09 | Ambiguedad en responsabilidad del Query Controller | Media | Media | Definir propietario del endpoint en Fase 4 |
| R-10 | BD no definida (motor, esquema, indices) | Alta | Alta | Definir tecnologia y modelo en Fase 4 |

---

## 📅 Fecha de analisis
18 de febrero de 2026

---

## 🔄 Proximos pasos
- **Fase 4**: Analisis de ambiguedades y validacion
