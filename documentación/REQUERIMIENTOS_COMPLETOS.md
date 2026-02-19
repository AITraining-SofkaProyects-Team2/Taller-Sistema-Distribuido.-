# 📌 Requerimientos Completos

## Dashboard de Gestion de Reportes - Sistema Distribuido ISP

---

## 1. Alcance y Contexto

### 1.1 Contexto del sistema
- Sistema distribuido orientado a eventos para gestion de quejas ISP.
- Componentes existentes: Frontend (React), Producer (API), Consumer (Worker), RabbitMQ.
- Se agrega persistencia en BD y un microservicio de consultas para el dashboard.

### 1.2 Objetivo de los requerimientos
Definir de forma completa los requerimientos funcionales y no funcionales del dashboard, incluyendo sus restricciones y dependencias.

---

## 2. Requerimientos Funcionales (RF)

### RF-01 Listado de tickets
- El sistema debe listar tickets con paginacion.
- Debe incluir total de resultados y pagina actual.
- Debe soportar configuracion de tamano de pagina.

### RF-02 Filtro por estado
- Debe filtrar por estados permitidos (RECEIVED, IN_PROGRESS).
- Debe permitir combinacion con otros filtros.

### RF-03 Filtro por prioridad
- Debe filtrar por prioridades (HIGH, MEDIUM, LOW, PENDING).
- Debe permitir combinacion con otros filtros.

### RF-04 Filtro por tipo de incidente
- Debe filtrar por todos los tipos definidos en el dominio.
- Debe permitir combinacion con otros filtros.

### RF-05 Filtro por rango de fechas
- Debe filtrar por fecha de creacion dentro de un rango.
- Debe validar que fin >= inicio.

### RF-06 Busqueda por ID
- Debe permitir busqueda exacta por ticketId.
- Si no existe, debe retornar mensaje claro y estado adecuado.

### RF-07 Busqueda por numero de linea
- Debe permitir busqueda por lineNumber.
- Debe retornar lista completa de tickets asociados.

### RF-08 Ordenamiento
- Debe ordenar por fecha, prioridad o estado.
- Debe soportar orden ascendente y descendente.

### RF-09 Metricas agregadas
- Debe mostrar total de tickets.
- Debe mostrar distribucion por estado, prioridad y tipo.
- Debe reflejar datos consistentes con la BD.

### RF-10 Visualizacion grafica
- Debe mostrar graficas basicas de distribucion.
- Debe sincronizarse con filtros activos.

### RF-11 Exportacion (opcional)
- Debe exportar resultados filtrados a CSV.
- Debe respetar filtros activos.

### RF-12 Actualizacion de datos (opcional)
- Debe permitir refresco manual.
- Puede incluir auto-refresh configurable.

### RF-13 Interfaz responsive
- Debe ser usable en desktop y tablet.
- Debe mantener legibilidad y navegacion clara.

---

## 3. Requerimientos No Funcionales (RNF)

### RNF-01 Rendimiento
- Consultas deben responder en < 500ms para 50-80 tickets.

### RNF-02 Calidad de pruebas
- Cobertura objetivo 100% en servicios backend.
- Nuevos endpoints con tests unitarios e integracion.

### RNF-03 Arquitectura y patrones
- Cumplir SOLID y Clean Code.
- Controladores delgados y logica en servicios.
- Error handling centralizado (Chain of Responsibility).

### RNF-04 TypeScript estricto
- Todo codigo nuevo debe compilar en modo estricto.

### RNF-05 Documentacion
- Endpoints con JSDoc o equivalente.

### RNF-06 Validacion de queries
- Validacion y sanitizacion en servicios o utilidades, sin middleware dedicado.

---

## 4. Requerimientos de Datos

### 4.1 Entidades principales
- Ticket/Incident con:
  - ticketId, lineNumber, email, incidentType, description
  - status, priority, createdAt, processedAt

### 4.2 Persistencia
- Se requiere persistencia en base de datos real.
- Debe soportar lectura y escritura.

### 4.3 Consultas
- Indices para filtros por estado, prioridad, tipo, fecha, lineNumber.

---

## 5. Requerimientos de Integracion

### 5.1 Microservicio de consultas
- Debe conectarse a la misma BD del Consumer.
- Debe exponer endpoints:
  - GET /tickets
  - GET /tickets/:id
  - GET /tickets/metrics

### 5.2 Frontend
- Debe consumir endpoints del microservicio de consultas.
- Debe manejar paginacion, filtros y errores.

---

## 6. Criterios de Aceptacion Generales
1. Dashboard muestra tickets y metricas correctas.
2. Filtros combinables funcionan correctamente.
3. Consultas cumplen tiempos de respuesta definidos.
4. Pruebas pasan con cobertura requerida.
5. No se rompe flujo Producer -> RabbitMQ -> Consumer.

---

## 7. Criterios de No Aceptacion
1. No permitir editar o eliminar tickets desde dashboard.
2. No incluir autenticacion en esta fase.
3. No implementar websockets en esta fase.
4. No aceptar cambios sin pruebas.

---

## 8. Supuestos
1. Volumen esperado: 500-1000 tickets.
2. Navegadores modernos soportados.
3. BD compartida entre Consumer y microservicio de consultas.

---

## 9. Restricciones
1. Mantener monorepo existente.
2. No modificar contratos de mensajeria RabbitMQ.
3. Usar stack tecnologico actual.
4. No romper tests existentes.

---

## 10. Fecha
18 de febrero de 2026
