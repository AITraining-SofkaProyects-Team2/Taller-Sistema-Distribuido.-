# 📋 Documento Final de Análisis de Requerimientos

## Dashboard de Gestión de Reportes - Sistema Distribuido ISP

**Fecha**: 18 de febrero de 2026

---

## 1. Resumen Ejecutivo

Se ha completado un análisis integral de los requerimientos para implementar un **Dashboard de Gestión de Reportes** en el sistema distribuido de quejas ISP. Este documento consolida todas las decisiones arquitectónicas, funcionales y técnicas tomadas durante las 4 fases de análisis y define el scope final para su implementación.

---

## 2. Decisiones Resueltas

### 2.1 Infraestructura y Persistencia
- **Motor de BD**: PostgreSQL
- **Migraciones**: Manual (SQl scripts)
- **Seed inicial**: 10 registros de ejemplo
- **Modelo de datos**: Tabla única `tickets` compartida entre Consumer y microservicio de consultas
- **Indices**: `status`, `priority`, `type`, `createdAt`, `lineNumber`

### 2.2 Arquitectura de Microservicios
- **Nuevo servicio**: Microservicio de consultas (independiente del Producer y Consumer)
- **Despliegue**: Contenedor separado dentro del mismo `docker-compose.yml`
- **Nombre sugerido**: `backend/reports-query` o `backend/dashboard-service`

### 2.3 API REST y Contratos

#### Endpoints
```
GET  /v1/tickets                 # Listar con filtros y paginacion
GET  /v1/tickets/:id            # Obtener por ID
GET  /v1/tickets/metrics        # Metricas agregadas
```

#### Query Parameters (GET /v1/tickets)
- `page` (int, default: 1)
- `pageSize` (int, default: 20, max: 20)
- `status` (enum: RECEIVED, IN_PROGRESS)
- `priority` (enum: HIGH, MEDIUM, LOW, PENDING)
- `type` (enum: NO_SERVICE, INTERMITTENT_SERVICE, SLOW_CONNECTION, ROUTER_ISSUE, BILLING_QUESTION, OTHER)
- `lineNumber` (string)
- `ticketId` (string)
- `dateFrom` (ISO 8601, ej: 2025-01-01T00:00:00Z)
- `dateTo` (ISO 8601, ej: 2025-12-31T23:59:59Z)
- `sortBy` (enum: status, priority, type, lineNumber, ticketId, createdAt, default: createdAt)
- `sortOrder` (enum: asc, desc, default: asc)

#### Response Body (GET /v1/tickets)
```json
{
  "data": [
    {
      "ticketId": "uuid",
      "lineNumber": "string",
      "email": "string",
      "type": "enum",
      "description": "string | null",
      "status": "enum",
      "priority": "enum",
      "createdAt": "ISO 8601",
      "processedAt": "ISO 8601 | null"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### Response Body (GET /v1/tickets/:id)
```json
{
  "ticketId": "uuid",
  "lineNumber": "string",
  "email": "string",
  "type": "enum",
  "description": "string | null",
  "status": "enum",
  "priority": "enum",
  "createdAt": "ISO 8601",
  "processedAt": "ISO 8601 | null"
}
```

#### Response Body (GET /v1/tickets/metrics)
```json
{
  "total": 100,
  "byStatus": {
    "RECEIVED": 30,
    "IN_PROGRESS": 70
  },
  "byPriority": {
    "HIGH": 20,
    "MEDIUM": 50,
    "LOW": 30,
    "PENDING": 0
  },
  "byType": {
    "NO_SERVICE": 15,
    "INTERMITTENT_SERVICE": 25,
    "SLOW_CONNECTION": 20,
    "ROUTER_ISSUE": 20,
    "BILLING_QUESTION": 15,
    "OTHER": 5
  }
}
```

### 2.4 Requerimientos Funcionales Finales

| ID | Requerimiento | Estado |
|----|----|--------|
| RF-01 | Listar tickets con paginación página+pageSize | ✅ Confirmado |
| RF-02 | Filtro por estado | ✅ Confirmado |
| RF-03 | Filtro por prioridad | ✅ Confirmado |
| RF-04 | Filtro por tipo de incidente | ✅ Confirmado |
| RF-05 | Filtro por rango de fechas (createdAt) | ✅ Confirmado |
| RF-06 | Búsqueda por ID | ✅ Confirmado |
| RF-07 | Búsqueda por número de línea | ✅ Confirmado |
| RF-08 | Ordenamiento (6 campos soportados) | ✅ Confirmado |
| RF-09 | Métricas agregadas (respetando filtros) | ✅ Confirmado |
| RF-10 | Visualización gráfica en dashboard | ✅ Confirmado |
| RF-11 | Exportación CSV (opcional) | ⏳ Pendiente implementación |
| RF-12 | Actualización en tiempo real (opcional) | ⏳ Pendiente implementación |
| RF-13 | Responsive design | ✅ Confirmado |

### 2.5 Requerimientos No Funcionales Finales

| ID | Requerimiento | Estado |
|----|----|----|
| RNF-01 | < 500ms para 50-80 tickets | ✅ Confirmado |
| RNF-02 | Cobertura 100% en servicios backend | ✅ Confirmado |
| RNF-03 | SOLID y Clean Code | ✅ Confirmado |
| RNF-04 | TypeScript estricto | ✅ Confirmado |
| RNF-05 | Controladores delgados | ✅ Confirmado |
| RNF-06 | Documentación con JSDoc | ✅ Confirmado |
| RNF-07 | Validación sin middleware dedicado | ✅ Confirmado |
| RNF-08 | Error handling centralizado | ✅ Confirmado |

---

## 3. Estructura del Microservicio de Consultas

```
backend/reports-query/
├── Dockerfile
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── src/
    ├── index.ts
    ├── app.ts
    ├── config/
    │   └── database.ts
    ├── controllers/
    │   ├── tickets.controller.ts
    │   └── tickets.controller.test.ts
    ├── services/
    │   ├── tickets.query.service.ts
    │   └── tickets.query.service.test.ts
    ├── repositories/
    │   ├── ITicketQueryRepository.ts
    │   ├── PostgresTicketRepository.ts
    │   └── PostgresTicketRepository.test.ts
    ├── routes/
    │   └── tickets.routes.ts
    ├── types/
    │   └── index.ts
    ├── utils/
    │   ├── logger.ts
    │   └── typeGuards.ts
    └── migrations/
        └── 001_create_tickets_table.sql
```

---

## 4. Cambios en Consumer

El Consumer debe:
1. Conectarse a PostgreSQL en lugar de usar in-memory
2. Implementar repositorio que persistea en BD
3. Mantener los mismos patrones de error handling y validación

---

## 5. Frontend - Componentes del Dashboard

```
frontend/src/pages/Dashboard/
├── DashboardPage.tsx
├── components/
│   ├── TicketsTable.tsx
│   ├── FiltersPanel.tsx
│   ├── MetricsCards.tsx
│   └── ChartsSection.tsx
├── hooks/
│   ├── useTickets.ts
│   ├── useTicketFilters.ts
│   └── useMetrics.ts
└── services/
    └── dashboard.service.ts
```

---

## 6. Integraciones y Dependencias

### Consumer → PostgreSQL
- Escribe tickets procesados
- Lee para consistencia

### Reports Query Service → PostgreSQL
- Lee tickets y métricas
- Sin escritura

### Frontend → Reports Query Service
- Consume endpoints `/v1/tickets`
- Pasa filtros como query params

---

## 7. Criterios de Aceptación Finales

✅ **Cumplimiento general**
1. Dashboard muestra todos los tickets
2. Filtros combinables funcionan correctamente
3. Paginación y ordenamiento operan sin errores
4. Métricas reflejan datos correctos y respetan filtros
5. Todas las consultas responden < 500ms
6. Tests pasan con cobertura 100% en servicios
7. No se rompe flujo Producer → Consumer → BD
8. Código TypeScript estricto sin errores
9. Patrones SOLID respetados

❌ **Restricciones**
1. No modificar registros desde dashboard
2. No implementar autenticación en esta fase
3. No usar websockets
4. No agregar roles/vistas diferentes

---

## 8. Zona Horaria

Los filtros de fecha operan en **hora local** del servidor. Las timestamps se guardan en UTC en la BD y se convierten según corresponda en las queries.

---

## 9. Límites de Rendimiento

- **Max pageSize**: 20 registros por página
- **Max resultados**: 100 tickets por consulta (con paginación forzada)
- **Max campos en ordenamiento**: 1 (sortBy + sortOrder)

---

## 10. Plan de Implementación (Fases Sugeridas)

### Fase 1: Infraestructura
- [ ] Crear servicio `backend/reports-query`
- [ ] Configurar PostgreSQL en docker-compose
- [ ] Crear migraciones y seed

### Fase 2: Backend - Consumer
- [ ] Reemplazar repositorio in-memory por PostgreSQL
- [ ] Implementar persistencia
- [ ] Tests actualizados

### Fase 3: Backend - Reports Query Service
- [ ] Implementar controllers y services
- [ ] Routes REST con versionado
- [ ] Tests unitarios e integración

### Fase 4: Frontend
- [ ] Componentes de dashboard
- [ ] Integración con API
- [ ] Tests y E2E

---

## 11. Checklist de Definition of Done

Para cada cambio:
- [ ] Compila TypeScript estricto
- [ ] Pasa tests (Vitest)
- [ ] Cobertura >= 100% en servicios
- [ ] Respeta patrones SOLID
- [ ] No rompe flujo distribuido
- [ ] Validaciones y error handling implementados
- [ ] Documentado (JSDoc)

---

## 12. Observaciones Finales

1. **Sin logging estructurado ni métricas técnicas**: Mantener logs simples como en el proyecto actual.
2. **Sin autenticación**: Todas las rutas expuestas sin restricción en esta fase.
3. **Zona horaria**: Importante documentar al equipo la consistencia UTC ↔ Local.
4. **Migraciones manuales**: Considerar agregar herramienta (Prisma/TypeORM) en fases posteriores.

---

## 13. Próximos Pasos

1. Validar este documento con el equipo
2. Iniciar implementación según plan en Fase 1
3. Mantener sincronía entre especificación y código
4. Ejecutar tests E2E al finalizar cada fase

---

**Documento generado**: 18 de febrero de 2026  
**Estado**: ✅ Completo y listo para implementación
