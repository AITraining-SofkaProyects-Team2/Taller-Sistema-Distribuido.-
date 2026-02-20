# 🧪 Plan de Pruebas - Dashboard de Gestión de Reportes (Sistema Distribuido ISP)

**Fecha de creación**: 18 de febrero de 2026
**Basado en**: [FASE_3_HISTORIAS_RIESGOS.md](./FASE_3_HISTORIAS_RIESGOS.md)

---

## 📋 Índice de Tests

| Completado | ID Test | Historia | Servicios afectados | Descripción |
|:----------:|---------|-|---------|-------------|
| [ ] | [TC-001](#TC-001---Listado-paginado-con-tamaño-por-defecto) | HU-01 | Query Service + Frontend | Listado paginado con tamaño por defecto |
| [ ] | [TC-002](#TC-002---Listado-paginado-con-tamaño-configurable) | HU-01 | Query Service + Frontend | Listado paginado con tamaño configurable |
| [ ] | [TC-003](#TC-003---Indicación-de-total-de-resultados-y-página-actual) | HU-01 | Query Service + Frontend | Indicación de total de resultados y página actual |
| [ ] | [TC-004](#TC-004---Ordenamiento-consistente-entre-páginas) | HU-01 | Query Service + Frontend | Ordenamiento consistente entre páginas |
| [ ] | [TC-005](#TC-005---Lista-vacía-cuando-no-hay-tickets) | HU-01 | Query Service + Frontend | Lista vacía cuando no hay tickets |
| [ ] | [TC-006](#TC-006---Solicitar-página-fuera-de-rango) | HU-01 | Query Service + Frontend | Solicitar página fuera de rango |
| [ ] | [TC-007](#TC-007---Tamaño-de-página-con-valores-inválidos) | HU-01 | Query Service + Frontend | Tamaño de página con valores inválidos |
| [ ] | [TC-008](#TC-008---Filtrar-por-un-solo-estado-válido) | HU-02 | Query Service + Frontend | Filtrar por un solo estado válido |
| [ ] | [TC-009](#TC-009---Filtrar-por-múltiples-estados-simultáneamente) | HU-02 | Query Service + Frontend | Filtrar por múltiples estados simultáneamente |
| [ ] | [TC-010](#TC-010---Combinar-filtro-de-estado-con-otros-filtros) | HU-02 | Query Service + Frontend | Combinar filtro de estado con otros filtros |
| [ ] | [TC-011](#TC-011---Filtrar-con-estado-inválido) | HU-02 | Query Service + Frontend | Filtrar con estado inválido |
| [ ] | [TC-012](#TC-012---Filtrar-por-estado-sin-resultados-coincidentes) | HU-02 | Query Service + Frontend | Filtrar por estado sin resultados coincidentes |
| [ ] | [TC-013](#TC-013---Filtrar-por-prioridad-válida) | HU-03 | Query Service + Frontend | Filtrar por prioridad válida |
| [ ] | [TC-014](#TC-014---Visualizar-prioridades-disponibles) | HU-03 | Query Service + Frontend | Visualizar prioridades disponibles |
| [ ] | [TC-015](#TC-015---Combinar-filtro-de-prioridad-con-otros-filtros) | HU-03 | Query Service + Frontend | Combinar filtro de prioridad con otros filtros |
| [ ] | [TC-016](#TC-016---Filtrar-con-prioridad-inválida) | HU-03 | Query Service + Frontend | Filtrar con prioridad inválida |
| [ ] | [TC-017](#TC-017---Filtrar-por-prioridad-sin-resultados-coincidentes) | HU-03 | Query Service + Frontend | Filtrar por prioridad sin resultados coincidentes |
| [ ] | [TC-018](#TC-018---Filtrar-por-tipo-de-incidencia-válida) | HU-04 | Query Service + Frontend | Filtrar por tipo de incidente válido |
| [ ] | [TC-019](#TC-019---Listar-todos-los-tipos-de-incidencia-disponibles) | HU-04 | Query Service + Frontend | Listar todos los tipos de incidente disponibles |
| [ ] | [TC-020](#TC-020---Combinar-filtro-de-tipo-con-estado-y-prioridad) | HU-04 | Query Service + Frontend | Combinar filtro de tipo con estado y prioridad |
| [ ] | [TC-021](#TC-021---Filtrar-con-tipo-de-incidencia-inválido) | HU-04 | Query Service + Frontend | Filtrar con tipo de incidente inválido |
| [ ] | [TC-022](#TC-022---Filtrar-por-rango-de-fechas-válido) | HU-05 | Query Service + Frontend | Filtrar por rango de fechas válido |
| [ ] | [TC-023](#TC-023---Validar-que-fecha-fin-sea-mayor-o-igual-a-fecha-inicio) | HU-05 | Query Service + Frontend | Validar que fecha fin sea mayor o igual a fecha inicio |
| [ ] | [TC-024](#TC-024---Rango-de-fechas-sin-resultados-coincidentes) | HU-05 | Query Service + Frontend | Rango de fechas sin resultados coincidentes |
| [ ] | [TC-025](#TC-025---Filtrar-con-solo-fecha-inicio-sin-fecha-fin) | HU-05 | Query Service + Frontend | Filtrar con solo fecha inicio (sin fecha fin) |
| [ ] | [TC-026](#TC-026---Filtrar-con-solo-fecha-fin-sin-fecha-inicio) | HU-05 | Query Service + Frontend | Filtrar con solo fecha fin (sin fecha inicio) |
| [ ] | [TC-027](#TC-027---Fechas-con-formato-inválido) | HU-05 | Query Service + Frontend | Fechas con formato inválido |
| [GREEN] | [TC-028](#TC-028---Buscar-por-ID-de-ticket-existente) | HU-06 | Query Service + Frontend | Buscar por ID de ticket existente |
| [GREEN] | [TC-029](#TC-029---Buscar-por-ID-de-ticket-inexistente) | HU-06 | Query Service + Frontend | Buscar por ID de ticket inexistente |
| [GREEN] | [TC-030](#TC-030---Buscar-con-ID-en-formato-inválido) | HU-06 | Query Service + Frontend | Buscar con ID en formato inválido |
| [ ] | [TC-031](#TC-031---Buscar-con-ID-vacío) | HU-06 | Query Service + Frontend | Buscar con ID vacío |
| [ ] | [TC-032](#TC-032---Buscar-por-número-de-línea-válido-con-resultados) | HU-07 | Query Service + Frontend | Buscar por número de línea válido con resultados |
| [ ] | [TC-033](#TC-033---Buscar-por-número-de-línea-válido-sin-resultados) | HU-07 | Query Service + Frontend | Buscar por número de línea válido sin resultados |
| [ ] | [TC-034](#TC-034---Buscar-con-número-de-línea-inválido) | HU-07 | Query Service + Frontend | Buscar con número de línea inválido |
| [ ] | [TC-035](#TC-035---Ordenar-por-fecha-ascendente) | HU-08 | Query Service + Frontend | Ordenar por fecha ascendente |
| [ ] | [TC-036](#TC-036---Ordenar-por-fecha-descendente) | HU-08 | Query Service + Frontend | Ordenar por fecha descendente |
| [ ] | [TC-037](#TC-037---Ordenar-por-prioridad) | HU-08 | Query Service + Frontend | Ordenar por prioridad |
| [ ] | [TC-038](#TC-038---Ordenar-por-estado) | HU-08 | Query Service + Frontend | Ordenar por estado |
| [ ] | [TC-039](#TC-039---Campo-de-ordenamiento-inválido) | HU-08 | Query Service + Frontend | Campo de ordenamiento inválido |
| [ ] | [TC-040](#TC-040---Visualizar-total-de-tickets) | HU-09 | Query Service + Frontend | Visualizar total de tickets |
| [ ] | [TC-041](#TC-041---Distribución-por-estado) | HU-09 | Query Service + Frontend | Distribución por estado |
| [ ] | [TC-042](#TC-042---Distribución-por-prioridad) | HU-09 | Query Service + Frontend | Distribución por prioridad |
| [ ] | [TC-043](#TC-043---Distribución-por-tipo-de-incidente) | HU-09 | Query Service + Frontend | Distribución por tipo de incidente |
| [ ] | [TC-044](#TC-044---Consistencia-de-métricas-con-el-repositorio) | HU-09 | Query Service + Frontend | Consistencia de métricas con el repositorio |
| [ ] | [TC-045](#TC-045---Gráfica-de-distribución-por-prioridad) | HU-10 | Query Service + Frontend | Gráfica de distribución por prioridad |
| [ ] | [TC-046](#TC-046---Gráfica-de-distribución-por-estado) | HU-10 | Query Service + Frontend | Gráfica de distribución por estado |
| [ ] | [TC-047](#TC-047---Actualización-de-gráficas-con-filtros-activos) | HU-10 | Query Service + Frontend | Actualización de gráficas con filtros activos |
| [ ] | [TC-048](#TC-048---Exportar-CSV-con-columnas-básicas) | HU-11 | Frontend | Exportar CSV con columnas básicas |
| [ ] | [TC-049](#TC-049---Exportar-respetando-filtros-activos) | HU-11 | Frontend | Exportar respetando filtros activos |
| [ ] | [TC-050](#TC-050---Exportar-cuando-no-hay-resultados) | HU-11 | Frontend | Exportar cuando no hay resultados |
| [ ] | [TC-051](#TC-051---Refresco-manual-de-datos) | HU-12 | Query Service + Frontend | Refresco manual de datos |
| [ ] | [TC-052](#TC-052---Auto-refresh-configurable) | HU-12 | Query Service + Frontend | Auto-refresh configurable |
| [ ] | [TC-053](#TC-053---Desactivar-auto-refresh) | HU-12 | Query Service + Frontend | Desactivar auto-refresh */



---

## 🏗️ Arquitectura del Sistema

### Servicios Involucrados

El sistema distribuido de gestión de quejas ISP consta de los siguientes servicios:

| Servicio | Descripción | Puerto | Responsabilidad en Tests |
|----------|-------------|:------:|------------------------|
| **Frontend** | Aplicación React + Vite | 80 | Tests de UI, interacción de usuario, visualización de datos, exportación CSV, gráficas |
| **Producer** | API Express de ingreso de quejas | 3000 | Validación de requests, publicación a RabbitMQ (no involucrado en dashboard) |
| **Consumer** | Worker de procesamiento de mensajes | 3001 (health) | Priorización de tickets, persistencia inicial (no involucrado directamente en dashboard) |
| **Query Service** | Microservicio de consultas (nuevo) | 3002 | API REST de consultas (`GET /api/tickets`), filtros, paginación, búsquedas, métricas agregadas |

### Mapeo de Historias de Usuario a Servicios

| Historia | Descripción | Servicios Involucrados |
|----------|-------------|------------------------|
| **HU-01 a HU-08** | Listado, filtros, búsquedas, ordenamiento | **Query Service** (backend) + **Frontend** (visualización) |
| **HU-09** | Métricas agregadas | **Query Service** (endpoint `/api/tickets/metrics`) + **Frontend** (visualización) |
| **HU-10** | Visualización gráfica | **Frontend** (renderizado) + **Query Service** (datos) |
| **HU-11** | Exportación CSV | **Frontend** (generación de archivo) |
| **HU-12** | Actualización de datos | **Frontend** (refresh manual/auto) + **Query Service** (datos actualizados) |

---

## Valores de referencia del dominio

**Tipos de incidente válidos**: `NO_SERVICE`, `INTERMITTENT_SERVICE`, `SLOW_CONNECTION`, `ROUTER_ISSUE`, `BILLING_QUESTION`, `OTHER`

**Prioridades válidas**: `HIGH`, `MEDIUM`, `LOW`, `PENDING`

**Estados válidos**: `RECEIVED`, `IN_PROGRESS`

**Formato ID de ticket**: UUIDv4 (ej: `550e8400-e29b-41d4-a716-446655440000`)

**Formato fecha**: ISO-8601 (ej: `2026-02-18T10:00:00Z`)

---

## HU-01 - Listado de tickets con paginación

---

### TC-001 - Listado paginado con tamaño por defecto

- **ID del Test**: TC-001
- **ID de la Historia de Usuario**: HU-01
- **Descripción**: Verificar que el sistema retorna una lista paginada de tickets con el tamaño de página por defecto (20) cuando no se especifica el parámetro `limit`.
- **Precondiciones**: Existen al menos 25 tickets procesados en el repositorio del query-service.
- **Servicio(s)**: **Query Service** (validación de params, lógica de paginación, respuesta JSON) + **Frontend** (renderizado de tabla y controles)

**Pasos (Gherkin)**:
```gherkin
Given existen 25 tickets procesados en el sistema
  And no se especifica el parámetro "limit" en la solicitud
When el operador solicita GET /api/tickets
Then el código de respuesta es 200
  And el campo "data" contiene exactamente 20 tickets
  And el campo "pagination.page" es 1
  And el campo "pagination.limit" es 20
  And el campo "pagination.totalItems" es 25
  And el campo "pagination.totalPages" es 2
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| Sin parámetro limit | (omitido) | Válido |
| limit = 20 (explícito) | `20` | Válido |
| limit con valor válido | `10`, `50`, `100` | Válido |
| limit = 0 | `0` | Inválido |
| limit negativo | `-1`, `-10` | Inválido |
| limit > máximo | `101`, `500` | Inválido |
| limit no numérico | `abc`, `null` | Inválido |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| `limit=1` | Mínimo válido | 1 ticket por página |
| `limit=100` | Máximo válido | 100 tickets por página |
| `limit=0` | Justo debajo del mínimo | HTTP 400 |
| `limit=101` | Justo encima del máximo | HTTP 400 |

**Tabla de Decisión**:
| limit especificado | Valor válido | Resultado |
|:------------------:|:------------:|-----------|
| No | N/A | Usa default (20), HTTP 200 |
| Sí | Sí (1-100) | Usa valor dado, HTTP 200 |
| Sí | No (≤0, >100, NaN) | HTTP 400, mensaje de error |

---

### TC-002 - Listado paginado con tamaño configurable

- **ID del Test**: TC-002
- **ID de la Historia de Usuario**: HU-01
- **Descripción**: Verificar que el operador puede configurar la cantidad de tickets por página mediante el parámetro `limit`.
- **Precondiciones**: Existen 50 tickets procesados en el repositorio.
- **Servicio(s)**: **Query Service** (validación de `limit`, aplicación de paginación) + **Frontend** (control de tamaño de página)

**Pasos (Gherkin)**:
```gherkin
Given existen 50 tickets procesados en el sistema
When el operador solicita GET /api/tickets?limit=10
Then el código de respuesta es 200
  And el campo "data" contiene exactamente 10 tickets
  And el campo "pagination.limit" es 10
  And el campo "pagination.totalPages" es 5
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| Tamaños pequeños | `1`, `5`, `10` | Válido |
| Tamaño mediano (default) | `20` | Válido |
| Tamaños grandes | `50`, `100` | Válido |
| Tamaño excesivo | `101`, `1000` | Inválido |
| Tamaño cero o negativo | `0`, `-5` | Inválido |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| `limit=1` | Mínimo aceptable | 1 ticket, totalPages = 50 |
| `limit=50` | Exacto al total | 50 tickets, totalPages = 1 |
| `limit=100` | Máximo aceptable | 50 tickets (todos), totalPages = 1 |

---

### TC-003 - Indicación de total de resultados y página actual

- **ID del Test**: TC-003
- **ID de la Historia de Usuario**: HU-01
- **Descripción**: Verificar que la respuesta incluye correctamente el total de resultados y la página actual en la metadata de paginación.
- **Precondiciones**: Existen 55 tickets procesados en el repositorio.
- **Servicio(s)**: **Query Service** (cálculo de totalItems, totalPages, metadata) + **Frontend** (visualización de metadata)

**Pasos (Gherkin)**:
```gherkin
Given existen 55 tickets procesados en el sistema
When el operador solicita GET /api/tickets?page=3&limit=20
Then el código de respuesta es 200
  And el campo "data" contiene exactamente 15 tickets
  And el campo "pagination.page" es 3
  And el campo "pagination.totalItems" es 55
  And el campo "pagination.totalPages" es 3
```

**Partición de equivalencia**:
| Grupo | Valores de page | Tipo |
|-------|-----------------|------|
| Primera página | `1` | Válido |
| Página intermedia | `2`, `3` | Válido |
| Última página (parcial) | `3` (con 55 items y limit 20) | Válido |
| Página fuera de rango | `4`, `100` (> totalPages) | Válido (retorna data vacía) |
| Página cero | `0` | Inválido |
| Página negativa | `-1` | Inválido |
| Página no numérica | `abc` | Inválido |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| `page=1` | Primera página | data con 20 items |
| `page=3` | Última página con 55 items | data con 15 items |
| `page=4` | Justo fuera de rango | data vacía, totalItems = 55 |
| `page=0` | Debajo del mínimo | HTTP 400 |

---

### TC-004 - Ordenamiento consistente entre páginas

- **ID del Test**: TC-004
- **ID de la Historia de Usuario**: HU-01
- **Descripción**: Verificar que el ordenamiento se mantiene consistente al navegar entre diferentes páginas.
- **Precondiciones**: Existen 30 tickets con diferentes fechas de creación en el repositorio.
- **Servicio(s)**: **Query Service** (aplicación de sortBy/sortOrder consistente) + **Frontend** (navegación entre páginas)

**Pasos (Gherkin**:
```gherkin
Given existen 30 tickets procesados con fechas de creación distintas
When el operador solicita GET /api/tickets?page=1&limit=10&sortBy=createdAt&sortOrder=desc
  And luego solicita GET /api/tickets?page=2&limit=10&sortBy=createdAt&sortOrder=desc
Then el código de respuesta es 200 en ambas solicitudes
  And el último ticket de la página 1 tiene una fecha de creación mayor o igual al primer ticket de la página 2
  And no hay tickets duplicados entre la página 1 y la página 2
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| sortBy válidos | `createdAt`, `priority`, `status`, `type` | Válido |
| sortOrder válidos | `asc`, `desc` | Válido |
| sortBy no especificado | (omitido) | Válido (default: createdAt) |
| sortOrder no especificado | (omitido) | Válido (default: desc) |
| sortBy inválido | `nombre`, `xyz` | Inválido |
| sortOrder inválido | `up`, `down`, `123` | Inválido |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| Página 1 → Página 2 | Transición entre páginas consecutivas | Orden consistente, sin solapamiento |
| Página 1 → Última página | Transición extremo a extremo | Orden consistente |

**Tabla de Decisión**:
| sortBy | sortOrder | Resultado |
|:------:|:---------:|-----------|
| Válido | Válido | Ordenamiento aplicado, HTTP 200 |
| Válido | Omitido | Usar default desc, HTTP 200 |
| Omitido | Válido | Usar default createdAt, HTTP 200 |
| Omitido | Omitido | Defaults: createdAt + desc, HTTP 200 |
| Inválido | Cualquiera | HTTP 400 |
| Cualquiera | Inválido | HTTP 400 |

---

### TC-005 - Lista vacía cuando no hay tickets

- **ID del Test**: TC-005
- **ID de la Historia de Usuario**: HU-01
- **Descripción**: Verificar que el sistema retorna una respuesta válida con lista vacía cuando no existen tickets.
- **Precondiciones**: El repositorio del query-service está vacío (0 tickets).
- **Servicio(s)**: **Query Service** (manejo de repositorio vacío) + **Frontend** (renderizado de estado vacío)

**Pasos (Gherkin)**:
```gherkin
Given no existen tickets procesados en el sistema
When el operador solicita GET /api/tickets
Then el código de respuesta es 200
  And el campo "data" es un arreglo vacío
  And el campo "pagination.totalItems" es 0
  And el campo "pagination.totalPages" es 0
  And el campo "pagination.page" es 1
```

**Partición de equivalencia**:
| Grupo | Cantidad de tickets | Tipo |
|-------|---------------------|------|
| Sin tickets | 0 | Válido (caso borde) |
| Un solo ticket | 1 | Válido (mínimo con datos) |
| Múltiples tickets | 2+ | Válido |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| 0 tickets | Repositorio vacío | data: [], totalItems: 0, totalPages: 0 |
| 1 ticket | Mínimo con datos | data: [1 item], totalItems: 1, totalPages: 1 |

---

### TC-006 - Solicitar página fuera de rango

- **ID del Test**: TC-006
- **ID de la Historia de Usuario**: HU-01
- **Descripción**: Verificar el comportamiento cuando se solicita una página que excede el total de páginas disponibles.
- **Precondiciones**: Existen 10 tickets procesados (1 página con limit=20).
- **Servicio(s)**: **Query Service** (manejo de páginas fuera de rango) + **Frontend** (visualización de resultados vacíos)

**Pasos (Gherkin)**:
```gherkin
Given existen 10 tickets procesados en el sistema
When el operador solicita GET /api/tickets?page=5&limit=20
Then el código de respuesta es 200
  And el campo "data" es un arreglo vacío
  And el campo "pagination.totalItems" es 10
  And el campo "pagination.totalPages" es 1
  And el campo "pagination.page" es 5
```

**Partición de equivalencia**:
| Grupo | Valores de page | Tipo |
|-------|-----------------|------|
| Página dentro del rango | `1` (con 10 tickets y limit 20) | Válido |
| Página fuera del rango | `2`, `5`, `100` | Válido (retorna vacío) |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| `page=1` | Última página válida | data con 10 items |
| `page=2` | Justo fuera de rango | data vacía |

---

### TC-007 - Tamaño de página con valores inválidos

- **ID del Test**: TC-007
- **ID de la Historia de Usuario**: HU-01
- **Descripción**: Verificar que el sistema rechaza valores inválidos para los parámetros de paginación con HTTP 400.
- **Precondiciones**: Existen tickets en el repositorio.
- **Servicio(s)**: **Query Service** (validación de query params, manejo de errores)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets procesados en el sistema
When el operador solicita GET /api/tickets?page=-1&limit=0
Then el código de respuesta es 400
  And la respuesta contiene un mensaje de error descriptivo sobre los parámetros inválidos
```

```gherkin
Given existen tickets procesados en el sistema
When el operador solicita GET /api/tickets?limit=abc
Then el código de respuesta es 400
  And la respuesta contiene un mensaje de error indicando que "limit" debe ser numérico
```

```gherkin
Given existen tickets procesados en el sistema
When el operador solicita GET /api/tickets?page=0
Then el código de respuesta es 400
  And la respuesta contiene un mensaje de error indicando que "page" debe ser mayor a 0
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| page válido | `1`, `2`, `99` | Válido |
| page = 0 | `0` | Inválido |
| page negativo | `-1`, `-100` | Inválido |
| page no numérico | `abc`, `true` | Inválido |
| limit válido | `1` a `100` | Válido |
| limit = 0 | `0` | Inválido |
| limit negativo | `-1` | Inválido |
| limit > 100 | `101`, `500` | Inválido |
| limit no numérico | `abc` | Inválido |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| `page=0` | Justo debajo de mínimo válido (1) | HTTP 400 |
| `page=1` | Mínimo válido | HTTP 200 |
| `limit=0` | Justo debajo de mínimo válido (1) | HTTP 400 |
| `limit=1` | Mínimo válido | HTTP 200 |
| `limit=100` | Máximo válido | HTTP 200 |
| `limit=101` | Justo encima de máximo válido | HTTP 400 |

**Tabla de Decisión**:
| page | limit | Resultado |
|:----:|:-----:|-----------|
| Válido (≥1) | Válido (1-100) | HTTP 200 |
| Válido | Inválido (≤0, >100, NaN) | HTTP 400 |
| Inválido (≤0, NaN) | Válido | HTTP 400 |
| Inválido | Inválido | HTTP 400 |

---

## HU-02 - Filtro por estado

---

### TC-008 - Filtrar por un solo estado válido

- **ID del Test**: TC-008
- **ID de la Historia de Usuario**: HU-02
- **Descripción**: Verificar que al filtrar por un estado válido, solo se retornan tickets con ese estado.
- **Precondiciones**: Existen tickets con estado `RECEIVED` y tickets con estado `IN_PROGRESS` en el repositorio.
- **Servicio(s)**: **Query Service** (filtrado por `status` en query) + **Frontend** (selector de estado, renderizado de resultados)

**Pasos (Gherkin)**:
```gherkin
Given existen 10 tickets con estado "RECEIVED" y 15 tickets con estado "IN_PROGRESS"
When el operador solicita GET /api/tickets?status=RECEIVED
Then el código de respuesta es 200
  And todos los tickets en "data" tienen el campo "status" igual a "RECEIVED"
  And el campo "pagination.totalItems" es 10
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| Estado RECEIVED | `RECEIVED` | Válido |
| Estado IN_PROGRESS | `IN_PROGRESS` | Válido |
| Estado en minúsculas | `received` | Inválido |
| Estado inexistente | `CLOSED`, `CANCELLED` | Inválido |
| Estado vacío | `""` | Inválido |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| `RECEIVED` | Estado válido con resultados | Solo tickets RECEIVED |
| `IN_PROGRESS` | Estado válido con resultados | Solo tickets IN_PROGRESS |

---

### TC-009 - Filtrar por múltiples estados simultáneamente

- **ID del Test**: TC-009
- **ID de la Historia de Usuario**: HU-02
- **Descripción**: Verificar que el sistema permite seleccionar múltiples estados y retorna tickets que coincidan con cualquiera de ellos.
- **Precondiciones**: Existen tickets con ambos estados en el repositorio.
- **Servicio(s)**: **Query Service** (filtrado con múltiples valores de `status`) + **Frontend** (selector múltiple de estados)

**Pasos (Gherkin)**:
```gherkin
Given existen 10 tickets con estado "RECEIVED" y 15 tickets con estado "IN_PROGRESS"
When el operador solicita GET /api/tickets?status=RECEIVED&status=IN_PROGRESS
Then el código de respuesta es 200
  And los tickets en "data" tienen estado "RECEIVED" o "IN_PROGRESS"
  And el campo "pagination.totalItems" es 25
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| Un estado | `status=RECEIVED` | Válido |
| Dos estados | `status=RECEIVED&status=IN_PROGRESS` | Válido |
| Mezcla válido + inválido | `status=RECEIVED&status=INVALID` | Inválido |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| 1 estado | Selección mínima | Tickets del estado seleccionado |
| 2 estados (todos) | Todos los estados disponibles | Todos los tickets |

---

### TC-010 - Combinar filtro de estado con otros filtros

- **ID del Test**: TC-010
- **ID de la Historia de Usuario**: HU-02
- **Descripción**: Verificar que el filtro de estado se combina correctamente con otros filtros (prioridad, tipo de incidente) usando lógica AND.
- **Precondiciones**: Existen tickets variados con diferentes estados, prioridades y tipos en el repositorio.
- **Servicio(s)**: **Query Service** (combinación de múltiples filtros con AND) + **Frontend** (múltiples selectores activos)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con las siguientes combinaciones:
  | ticketId | status      | priority | type        |
  | T-001    | IN_PROGRESS | HIGH     | NO_SERVICE  |
  | T-002    | IN_PROGRESS | MEDIUM   | SLOW_CONNECTION |
  | T-003    | RECEIVED    | HIGH     | NO_SERVICE  |
  | T-004    | RECEIVED    | PENDING  | OTHER       |
When el operador solicita GET /api/tickets?status=IN_PROGRESS&priority=HIGH
Then el código de respuesta es 200
  And todos los tickets en "data" tienen status "IN_PROGRESS" y priority "HIGH"
  And el campo "pagination.totalItems" es 1
  And el ticket retornado es "T-001"
```

**Tabla de Decisión**:
| status | priority | incidentType | Resultado |
|:------:|:--------:|:------------:|-----------|
| Especificado | No | No | Filtra solo por estado |
| No | Especificado | No | Filtra solo por prioridad |
| Especificado | Especificado | No | Intersección estado + prioridad |
| Especificado | No | Especificado | Intersección estado + tipo |
| Especificado | Especificado | Especificado | Intersección de los tres |
| No | No | No | Sin filtros, retorna todos |

---

### TC-011 - Filtrar con estado inválido

- **ID del Test**: TC-011
- **ID de la Historia de Usuario**: HU-02
- **Descripción**: Verificar que el sistema rechaza un valor de estado que no existe en el dominio.
- **Precondiciones**: Existen tickets en el repositorio.
- **Servicio(s)**: **Query Service** (validación de valores de `status`, manejo de errores HTTP 400)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets procesados en el sistema
When el operador solicita GET /api/tickets?status=CLOSED
Then el código de respuesta es 400
  And la respuesta contiene un mensaje de error indicando que "CLOSED" no es un estado válido
  And la respuesta sugiere los valores válidos: "RECEIVED", "IN_PROGRESS"
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| Estados válidos del dominio | `RECEIVED`, `IN_PROGRESS` | Válido |
| Estados inexistentes | `CLOSED`, `RESOLVED`, `CANCELLED` | Inválido |
| Números | `1`, `0` | Inválido |
| Cadena vacía | `""` | Inválido |

---

### TC-012 - Filtrar por estado sin resultados coincidentes

- **ID del Test**: TC-012
- **ID de la Historia de Usuario**: HU-02
- **Descripción**: Verificar que el sistema retorna una lista vacía cuando el estado filtrado no tiene tickets asociados.
- **Precondiciones**: Existen solo tickets con estado `IN_PROGRESS` en el repositorio.
- **Servicio(s)**: **Query Service** (filtrado sin resultados) + **Frontend** (renderizado de lista vacía)

**Pasos (Gherkin)**:
```gherkin
Given existen 10 tickets todos con estado "IN_PROGRESS"
When el operador solicita GET /api/tickets?status=RECEIVED
Then el código de respuesta es 200
  And el campo "data" es un arreglo vacío
  And el campo "pagination.totalItems" es 0
  And el campo "pagination.totalPages" es 0
```

---

## HU-03 - Filtro por prioridad

---

### TC-013 - Filtrar por prioridad válida

- **ID del Test**: TC-013
- **ID de la Historia de Usuario**: HU-03
- **Descripción**: Verificar que al filtrar por una prioridad válida, solo se retornan tickets con esa prioridad.
- **Precondiciones**: Existen tickets con prioridades HIGH, MEDIUM, LOW y PENDING en el repositorio.
- **Servicio(s)**: **Query Service** (filtrado por `priority` en query) + **Frontend** (selector de prioridad, renderizado)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con las siguientes prioridades:
  | priority | cantidad |
  | HIGH     | 5        |
  | MEDIUM   | 8        |
  | LOW      | 10       |
  | PENDING  | 2        |
When el operador solicita GET /api/tickets?priority=HIGH
Then el código de respuesta es 200
  And todos los tickets en "data" tienen el campo "priority" igual a "HIGH"
  And el campo "pagination.totalItems" es 5
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| Prioridad HIGH | `HIGH` | Válido |
| Prioridad MEDIUM | `MEDIUM` | Válido |
| Prioridad LOW | `LOW` | Válido |
| Prioridad PENDING | `PENDING` | Válido |
| Prioridad en minúsculas | `high`, `medium` | Inválido |
| Prioridad inexistente | `CRITICAL`, `URGENT` | Inválido |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| `HIGH` | Prioridad más alta | Solo tickets HIGH |
| `PENDING` | Prioridad más baja / sin resolver | Solo tickets PENDING |

---

### TC-014 - Visualizar prioridades disponibles

- **ID del Test**: TC-014
- **ID de la Historia de Usuario**: HU-03
- **Descripción**: Verificar que el sistema expone o permite conocer las prioridades disponibles para filtrar.
- **Precondiciones**: El sistema está operativo.
- **Servicio(s)**: **Frontend** (renderizado de selector/dropdown con todas las prioridades del dominio)

**Pasos (Gherkin)**:
```gherkin
Given el sistema está operativo
When el operador accede a la interfaz de filtros de prioridad
Then se muestran las siguientes opciones disponibles: "HIGH", "MEDIUM", "LOW", "PENDING"
  And cada opción es seleccionable
```

**Partición de equivalencia**:
| Grupo | Valores del selector | Tipo |
|-------|---------------------|------|
| Todas las prioridades del dominio | `HIGH`, `MEDIUM`, `LOW`, `PENDING` | Válido |
| Prioridades no existentes | Cualquier valor fuera del enum | No debe mostrarse |

---

### TC-015 - Combinar filtro de prioridad con otros filtros

- **ID del Test**: TC-015
- **ID de la Historia de Usuario**: HU-03
- **Descripción**: Verificar que el filtro de prioridad se combina correctamente con otros filtros activos.
- **Precondiciones**: Existen tickets variados en el repositorio.
- **Servicio(s)**: **Query Service** (combinación de filtros múltiples) + **Frontend** (múltiples selectores)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con las siguientes combinaciones:
  | ticketId | priority | status      | type               |
  | T-001    | HIGH     | IN_PROGRESS | NO_SERVICE         |
  | T-002    | HIGH     | IN_PROGRESS | SLOW_CONNECTION    |
  | T-003    | MEDIUM   | IN_PROGRESS | INTERMITTENT_SERVICE |
  | T-004    | HIGH     | RECEIVED    | OTHER              |
When el operador solicita GET /api/tickets?priority=HIGH&status=IN_PROGRESS
Then el código de respuesta es 200
  And todos los tickets tienen priority "HIGH" y status "IN_PROGRESS"
  And el campo "pagination.totalItems" es 2
```

**Tabla de Decisión**:
| priority | status | incidentType | Tickets retornados |
|:--------:|:------:|:------------:|:------------------:|
| HIGH | IN_PROGRESS | No especificado | T-001, T-002 |
| HIGH | No especificado | NO_SERVICE | T-001 |
| MEDIUM | IN_PROGRESS | No especificado | T-003 |
| No especificado | No especificado | No especificado | T-001, T-002, T-003, T-004 |

---

### TC-016 - Filtrar con prioridad inválida

- **ID del Test**: TC-016
- **ID de la Historia de Usuario**: HU-03
- **Descripción**: Verificar que el sistema rechaza valores de prioridad no pertenecientes al dominio.
- **Precondiciones**: Existen tickets en el repositorio.
- **Servicio(s)**: **Query Service** (validación de valores de `priority`, HTTP 400)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets procesados en el sistema
When el operador solicita GET /api/tickets?priority=CRITICAL
Then el código de respuesta es 400
  And la respuesta contiene un mensaje de error indicando que "CRITICAL" no es una prioridad válida
  And la respuesta sugiere los valores válidos: "HIGH", "MEDIUM", "LOW", "PENDING"
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| Prioridades del dominio | `HIGH`, `MEDIUM`, `LOW`, `PENDING` | Válido |
| Prioridades inventadas | `CRITICAL`, `URGENT`, `NORMAL` | Inválido |
| Numérico | `1`, `2`, `3` | Inválido |
| Vacío | `""` | Inválido |

---

### TC-017 - Filtrar por prioridad sin resultados coincidentes

- **ID del Test**: TC-017
- **ID de la Historia de Usuario**: HU-03
- **Descripción**: Verificar que el sistema retorna una lista vacía cuando no hay tickets con la prioridad filtrada.
- **Precondiciones**: Existen solo tickets con prioridad HIGH y MEDIUM.
- **Servicio(s)**: **Query Service** (filtrado sin resultados) + **Frontend** (renderizado de lista vacía)

**Pasos (Gherkin)**:
```gherkin
Given existen 5 tickets con prioridad "HIGH" y 5 con prioridad "MEDIUM"
  And no existen tickets con prioridad "PENDING"
When el operador solicita GET /api/tickets?priority=PENDING
Then el código de respuesta es 200
  And el campo "data" es un arreglo vacío
  And el campo "pagination.totalItems" es 0
```

---

## HU-04 - Filtro por tipo de incidente

---

### TC-018 - Filtrar por tipo de incidente válido

- **ID del Test**: TC-018
- **ID de la Historia de Usuario**: HU-04
- **Descripción**: Verificar que al filtrar por tipo de incidente válido, solo se retornan tickets de ese tipo.
- **Precondiciones**: Existen tickets de diferentes tipos de incidente en el repositorio.
- **Servicio(s)**: **Query Service** (filtrado por `incidentType` en query) + **Frontend** (selector de tipo, renderizado)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con los siguientes tipos:
  | type                  | cantidad |
  | NO_SERVICE            | 3        |
  | INTERMITTENT_SERVICE  | 4        |
  | SLOW_CONNECTION       | 2        |
  | ROUTER_ISSUE          | 5        |
  | BILLING_QUESTION      | 3        |
  | OTHER                 | 1        |
When el operador solicita GET /api/tickets?incidentType=NO_SERVICE
Then el código de respuesta es 200
  And todos los tickets en "data" tienen el campo "type" igual a "NO_SERVICE"
  And el campo "pagination.totalItems" es 3
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| Tipo NO_SERVICE | `NO_SERVICE` | Válido |
| Tipo INTERMITTENT_SERVICE | `INTERMITTENT_SERVICE` | Válido |
| Tipo SLOW_CONNECTION | `SLOW_CONNECTION` | Válido |
| Tipo ROUTER_ISSUE | `ROUTER_ISSUE` | Válido |
| Tipo BILLING_QUESTION | `BILLING_QUESTION` | Válido |
| Tipo OTHER | `OTHER` | Válido |
| Tipo en minúsculas | `no_service` | Inválido |
| Tipo inexistente | `HARDWARE_FAILURE`, `DNS_ISSUE` | Inválido |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| `NO_SERVICE` | Tipo con prioridad más alta mapeada | Solo tickets NO_SERVICE |
| `OTHER` | Tipo que requiere descripción | Solo tickets OTHER |

---

### TC-019 - Listar todos los tipos de incidente disponibles

- **ID del Test**: TC-019
- **ID de la Historia de Usuario**: HU-04
- **Descripción**: Verificar que la interfaz presenta todos los tipos de incidente disponibles para filtrar.
- **Precondiciones**: El sistema está operativo con la interfaz de filtros cargada.
- **Servicio(s)**: **Frontend** (renderizado de selector/dropdown con los 6 tipos de incidente)

**Pasos (Gherkin)**:
```gherkin
Given el sistema está operativo
When el operador accede a la interfaz de filtros de tipo de incidente
Then se listan las siguientes opciones:
  | Tipo                  |
  | NO_SERVICE            |
  | INTERMITTENT_SERVICE  |
  | SLOW_CONNECTION       |
  | ROUTER_ISSUE          |
  | BILLING_QUESTION      |
  | OTHER                 |
  And cada opción es seleccionable
```

---

### TC-020 - Combinar filtro de tipo con estado y prioridad

- **ID del Test**: TC-020
- **ID de la Historia de Usuario**: HU-04
- **Descripción**: Verificar que el filtro de tipo de incidente es combinable con estado y prioridad usando lógica AND.
- **Precondiciones**: Existen tickets variados en el repositorio.
- **Servicio(s)**: **Query Service** (combinación triple de filtros con AND) + **Frontend** (múltiples selectores)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con las siguientes combinaciones:
  | ticketId | type               | status      | priority |
  | T-001    | NO_SERVICE         | IN_PROGRESS | HIGH     |
  | T-002    | SLOW_CONNECTION    | IN_PROGRESS | MEDIUM   |
  | T-003    | NO_SERVICE         | RECEIVED    | PENDING  |
  | T-004    | BILLING_QUESTION   | IN_PROGRESS | LOW      |
When el operador solicita GET /api/tickets?incidentType=NO_SERVICE&status=IN_PROGRESS&priority=HIGH
Then el código de respuesta es 200
  And el campo "pagination.totalItems" es 1
  And el ticket retornado es "T-001"
  And el ticket tiene type "NO_SERVICE", status "IN_PROGRESS" y priority "HIGH"
```

**Tabla de Decisión**:
| incidentType | status | priority | Tickets retornados |
|:------------:|:------:|:--------:|:------------------:|
| NO_SERVICE | IN_PROGRESS | HIGH | T-001 |
| NO_SERVICE | No espec. | No espec. | T-001, T-003 |
| No espec. | IN_PROGRESS | No espec. | T-001, T-002, T-004 |
| NO_SERVICE | IN_PROGRESS | MEDIUM | (vacío) |

---

### TC-021 - Filtrar con tipo de incidente inválido

- **ID del Test**: TC-021
- **ID de la Historia de Usuario**: HU-04
- **Descripción**: Verificar que el sistema rechaza un tipo de incidente no perteneciente al dominio.
- **Precondiciones**: Existen tickets en el repositorio.
- **Servicio(s)**: **Query Service** (validación de valores de `incidentType`, HTTP 400)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets procesados en el sistema
When el operador solicita GET /api/tickets?incidentType=HARDWARE_FAILURE
Then el código de respuesta es 400
  And la respuesta contiene un mensaje de error indicando que "HARDWARE_FAILURE" no es un tipo de incidente válido
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| Tipos del dominio | Los 6 valores del enum IncidentType | Válido |
| Tipos inventados | `HARDWARE_FAILURE`, `DNS_ISSUE` | Inválido |
| Valores numéricos | `1`, `2` | Inválido |
| Cadena vacía | `""` | Inválido |

---

## HU-05 - Filtro por rango de fechas

---

### TC-022 - Filtrar por rango de fechas válido

- **ID del Test**: TC-022
- **ID de la Historia de Usuario**: HU-05
- **Descripción**: Verificar que al especificar un rango de fechas válido (dateFrom ≤ dateTo), solo se retornan tickets cuya fecha de creación esté dentro del rango.
- **Precondiciones**: Existen tickets con fechas de creación repartidas en varios meses.
- **Servicio(s)**: **Query Service** (filtrado por rango de fechas en `createdAt`) + **Frontend** (date pickers, validación)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con las siguientes fechas de creación:
  | ticketId | createdAt                |
  | T-001    | 2026-01-15T10:00:00Z     |
  | T-002    | 2026-02-01T10:00:00Z     |
  | T-003    | 2026-02-15T10:00:00Z     |
  | T-004    | 2026-02-28T23:59:59Z     |
  | T-005    | 2026-03-10T10:00:00Z     |
When el operador solicita GET /api/tickets?dateFrom=2026-02-01T00:00:00Z&dateTo=2026-02-28T23:59:59Z
Then el código de respuesta es 200
  And el campo "pagination.totalItems" es 3
  And los tickets retornados son "T-002", "T-003" y "T-004"
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| Rango válido (dateFrom < dateTo) | `2026-02-01` a `2026-02-28` | Válido |
| Rango de un solo día (dateFrom = dateTo) | `2026-02-15` a `2026-02-15` | Válido |
| Rango invertido (dateFrom > dateTo) | `2026-03-01` a `2026-02-01` | Inválido |
| Rango futuro sin datos | `2030-01-01` a `2030-12-31` | Válido (vacío) |
| Solo dateFrom | `2026-02-01` sin dateTo | Válido (todos desde la fecha) |
| Solo dateTo | sin dateFrom, `2026-02-28` | Válido (todos hasta la fecha) |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| dateFrom = createdAt exacto de T-002 | Borde inclusivo inferior | T-002 incluido |
| dateTo = createdAt exacto de T-004 | Borde inclusivo superior | T-004 incluido |
| dateFrom = un segundo después de T-001 | Justo fuera del borde | T-001 excluido |
| dateTo = un segundo antes de T-005 | Justo fuera del borde | T-005 excluido |

---

### TC-023 - Validar que fecha fin sea mayor o igual a fecha inicio

- **ID del Test**: TC-023
- **ID de la Historia de Usuario**: HU-05
- **Descripción**: Verificar que el sistema rechaza un rango donde la fecha de fin es anterior a la fecha de inicio.
- **Precondiciones**: Existen tickets en el repositorio.
- **Servicio(s)**: **Query Service** (validación de rango de fechas, HTTP 400) + **Frontend** (validación client-side)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets procesados en el sistema
When el operador solicita GET /api/tickets?dateFrom=2026-03-01T00:00:00Z&dateTo=2026-02-01T00:00:00Z
Then el código de respuesta es 400
  And la respuesta contiene un mensaje de error indicando que "dateTo" debe ser mayor o igual a "dateFrom"
```

**Partición de equivalencia**:
| Grupo | Relación dateFrom/dateTo | Tipo |
|-------|--------------------------|------|
| dateFrom < dateTo | Rango normal | Válido |
| dateFrom = dateTo | Mismo instante | Válido |
| dateFrom > dateTo | Rango invertido | Inválido |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| dateFrom = dateTo | Borde: rango de un instante | HTTP 200 (válido) |
| dateFrom = dateTo + 1 segundo | Justo invertido | HTTP 400 |

---

### TC-024 - Rango de fechas sin resultados coincidentes

- **ID del Test**: TC-024
- **ID de la Historia de Usuario**: HU-05
- **Descripción**: Verificar que el sistema retorna lista vacía cuando no existen tickets en el rango de fechas especificado.
- **Precondiciones**: Existen tickets con fechas fuera del rango consultado.
- **Servicio(s)**: **Query Service** (filtrado por fechas sin resultados) + **Frontend** (renderizado de lista vacía)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con fechas de creación en enero 2026
  And no existen tickets con fechas en diciembre 2027
When el operador solicita GET /api/tickets?dateFrom=2027-12-01T00:00:00Z&dateTo=2027-12-31T23:59:59Z
Then el código de respuesta es 200
  And el campo "data" es un arreglo vacío
  And el campo "pagination.totalItems" es 0
```

---

### TC-025 - Filtrar con solo fecha inicio (sin fecha fin)

- **ID del Test**: TC-025
- **ID de la Historia de Usuario**: HU-05
- **Descripción**: Verificar que al especificar solo `dateFrom`, se retornan todos los tickets desde esa fecha en adelante.
- **Precondiciones**: Existen tickets con fechas distribuidas.
- **Servicio(s)**: **Query Service** (filtrado con solo fecha inicial) + **Frontend** (permitir dateFrom sin dateTo)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con las siguientes fechas de creación:
  | ticketId | createdAt                |
  | T-001    | 2026-01-15T10:00:00Z     |
  | T-002    | 2026-02-15T10:00:00Z     |
  | T-003    | 2026-03-15T10:00:00Z     |
When el operador solicita GET /api/tickets?dateFrom=2026-02-01T00:00:00Z
Then el código de respuesta es 200
  And el campo "pagination.totalItems" es 2
  And los tickets retornados son "T-002" y "T-003"
```

---

### TC-026 - Filtrar con solo fecha fin (sin fecha inicio)

- **ID del Test**: TC-026
- **ID de la Historia de Usuario**: HU-05
- **Descripción**: Verificar que al especificar solo `dateTo`, se retornan todos los tickets hasta esa fecha.
- **Precondiciones**: Existen tickets con fechas distribuidas.
- **Servicio(s)**: **Query Service** (filtrado con solo fecha final) + **Frontend** (permitir dateTo sin dateFrom)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con las siguientes fechas de creación:
  | ticketId | createdAt                |
  | T-001    | 2026-01-15T10:00:00Z     |
  | T-002    | 2026-02-15T10:00:00Z     |
  | T-003    | 2026-03-15T10:00:00Z     |
When el operador solicita GET /api/tickets?dateTo=2026-02-28T23:59:59Z
Then el código de respuesta es 200
  And el campo "pagination.totalItems" es 2
  And los tickets retornados son "T-001" y "T-002"
```

---

### TC-027 - Fechas con formato inválido

- **ID del Test**: TC-027
- **ID de la Historia de Usuario**: HU-05
- **Descripción**: Verificar que el sistema rechaza fechas con formato no ISO-8601 con HTTP 400.
- **Precondiciones**: Existen tickets en el repositorio.
- **Servicio(s)**: **Query Service** (validación de formato de fecha, HTTP 400)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets procesados en el sistema
When el operador solicita GET /api/tickets?dateFrom=15-02-2026
Then el código de respuesta es 400
  And la respuesta contiene un mensaje de error indicando que el formato de fecha es inválido
```

```gherkin
Given existen tickets procesados en el sistema
When el operador solicita GET /api/tickets?dateFrom=not-a-date
Then el código de respuesta es 400
  And la respuesta contiene un mensaje de error indicando que el formato de fecha es inválido
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| ISO-8601 completo | `2026-02-18T10:00:00Z` | Válido |
| ISO-8601 solo fecha | `2026-02-18` | Válido |
| Formato DD-MM-YYYY | `18-02-2026` | Inválido |
| Formato MM/DD/YYYY | `02/18/2026` | Inválido |
| Texto arbitrario | `ayer`, `not-a-date` | Inválido |
| Numérico | `1234567890` | Inválido |
| Cadena vacía | `""` | Inválido |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| `2026-02-18T00:00:00Z` | Fecha válida con hora | HTTP 200 |
| `2026-02-18` | Fecha válida sin hora | HTTP 200 |
| `2026-02-30T00:00:00Z` | Fecha imposible (30 feb) | HTTP 400 |
| `2026-13-01T00:00:00Z` | Mes imposible (13) | HTTP 400 |

---

## HU-06 - Búsqueda por ID de ticket

---

### TC-028 - Buscar por ID de ticket existente

- **ID del Test**: TC-028
- **ID de la Historia de Usuario**: HU-06
- **Descripción**: Verificar que al buscar por un ID de ticket existente (UUIDv4), el sistema retorna exactamente ese ticket.
- **Precondiciones**: Existe un ticket con ID conocido en el repositorio.
- **Servicio(s)**: **Query Service** (endpoint `GET /api/tickets/:id`, búsqueda por ID) + **Frontend** (campo de búsqueda, renderizado de detalle)

**Pasos (Gherkin)**:
```gherkin
Given existe un ticket con ticketId "550e8400-e29b-41d4-a716-446655440000" en el sistema
When el operador solicita GET /api/tickets/550e8400-e29b-41d4-a716-446655440000
Then el código de respuesta es 200
  And la respuesta contiene un ticket con ticketId "550e8400-e29b-41d4-a716-446655440000"
  And la respuesta incluye los campos: ticketId, lineNumber, type, description, priority, status, createdAt, processedAt
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| UUIDv4 existente | `550e8400-e29b-41d4-a716-446655440000` | Válido |
| UUIDv4 no existente | `99999999-9999-9999-9999-999999999999` | Válido (retorna 404) |
| Formato no UUIDv4 | `abc123`, `ticket-001` | Inválido |
| UUID vacío | `""` | Inválido |

---

### TC-029 - Buscar por ID de ticket inexistente

- **ID del Test**: TC-029
- **ID de la Historia de Usuario**: HU-06
- **Descripción**: Verificar que al buscar un ID inexistente, el sistema muestra un mensaje claro indicando que el ticket no fue encontrado.
- **Precondiciones**: El ID buscado no existe en el repositorio.
- **Servicio(s)**: **Query Service** (manejo de HTTP 404) + **Frontend** (visualización de mensaje de error)

**Pasos (Gherkin)**:
```gherkin
Given no existe un ticket con ticketId "99999999-aaaa-bbbb-cccc-000000000000" en el sistema
When el operador solicita GET /api/tickets/99999999-aaaa-bbbb-cccc-000000000000
Then el código de respuesta es 404
  And la respuesta contiene un mensaje claro: "Ticket no encontrado"
```

---

### TC-030 - Buscar con ID en formato inválido

- **ID del Test**: TC-030
- **ID de la Historia de Usuario**: HU-06
- **Descripción**: Verificar que el sistema rechaza búsquedas con IDs que no tienen formato UUIDv4.
- **Precondiciones**: El sistema está operativo.
- **Servicio(s)**: **Query Service** (validación de formato UUID, HTTP 400)

**Pasos (Gherkin)**:
```gherkin
Given el sistema está operativo
When el operador solicita GET /api/tickets/not-a-valid-uuid
Then el código de respuesta es 400
  And la respuesta contiene un mensaje de error indicando que el formato de ID es inválido
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| UUIDv4 correcto | `550e8400-e29b-41d4-a716-446655440000` | Válido |
| UUID sin guiones | `550e8400e29b41d4a716446655440000` | Inválido |
| Texto arbitrario | `abc`, `ticket-001` | Inválido |
| Numérico | `12345` | Inválido |
| SQL injection | `'; DROP TABLE tickets; --` | Inválido |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| UUIDv4 con 36 caracteres | Longitud correcta con formato | HTTP 200/404 |
| 35 caracteres (UUID truncado) | 1 char menos que UUID | HTTP 400 |
| 37 caracteres (UUID extendido) | 1 char más que UUID | HTTP 400 |

---

### TC-031 - Buscar con ID vacío

- **ID del Test**: TC-031
- **ID de la Historia de Usuario**: HU-06
- **Descripción**: Verificar el comportamiento cuando se intenta buscar con un ID vacío.
- **Precondiciones**: El sistema está operativo.
- **Servicio(s)**: **Query Service** (endpoint raíz `/api/tickets` retorna listado) + **Frontend** (comportamiento al enviar búsqueda vacía)

**Pasos (Gherkin)**:
```gherkin
Given el sistema está operativo
When el operador solicita GET /api/tickets/
Then el código de respuesta es 200
  And la respuesta es el listado paginado de todos los tickets (comportamiento de HU-01)
```

---

## HU-07 - Búsqueda por número de línea

---

### TC-032 - Buscar por número de línea válido con resultados

- **ID del Test**: TC-032
- **ID de la Historia de Usuario**: HU-07
- **Descripción**: Verificar que al buscar por un número de línea válido, se retornan todos los tickets asociados a ese número.
- **Precondiciones**: Existen múltiples tickets asociados al mismo número de línea.
- **Servicio(s)**: **Query Service** (filtrado por `lineNumber` en query) + **Frontend** (campo de búsqueda, renderizado de lista)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con los siguientes números de línea:
  | ticketId | lineNumber |
  | T-001    | 0991234567 |
  | T-002    | 0991234567 |
  | T-003    | 0997654321 |
  | T-004    | 0991234567 |
When el operador solicita GET /api/tickets?lineNumber=0991234567
Then el código de respuesta es 200
  And todos los tickets en "data" tienen el campo "lineNumber" igual a "0991234567"
  And el campo "pagination.totalItems" es 3
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| Número de línea existente (10 dígitos) | `0991234567` | Válido |
| Número de línea no existente | `0000000000` | Válido (vacío) |
| Número con letras | `099ABC4567` | Inválido |
| Número muy corto | `099` | Inválido |
| Cadena vacía | `""` | Inválido |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| `0991234567` (10 dígitos) | Longitud típica válida | Resultados filtrados |
| `099123456` (9 dígitos) | 1 dígito menos del esperado | Depende de validación |
| `09912345678` (11 dígitos) | 1 dígito más del esperado | Depende de validación |

---

### TC-033 - Buscar por número de línea válido sin resultados

- **ID del Test**: TC-033
- **ID de la Historia de Usuario**: HU-07
- **Descripción**: Verificar que al buscar por un número de línea sin tickets asociados, se retorna lista vacía.
- **Precondiciones**: No existen tickets para el número de línea consultado.
- **Servicio(s)**: **Query Service** (búsqueda sin resultados) + **Frontend** (renderizado de lista vacía)

**Pasos (Gherkin)**:
```gherkin
Given no existen tickets con número de línea "0000000000"
When el operador solicita GET /api/tickets?lineNumber=0000000000
Then el código de respuesta es 200
  And el campo "data" es un arreglo vacío
  And el campo "pagination.totalItems" es 0
```

---

### TC-034 - Buscar con número de línea inválido

- **ID del Test**: TC-034
- **ID de la Historia de Usuario**: HU-07
- **Descripción**: Verificar que el sistema rechaza búsquedas con números de línea que contienen caracteres no válidos.
- **Precondiciones**: El sistema está operativo.
- **Servicio(s)**: **Query Service** (validación de formato de lineNumber, HTTP 400)

**Pasos (Gherkin)**:
```gherkin
Given el sistema está operativo
When el operador solicita GET /api/tickets?lineNumber=abc-invalid
Then el código de respuesta es 400
  And la respuesta contiene un mensaje de error indicando que el número de línea no es válido
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| Solo dígitos | `0991234567` | Válido |
| Con letras | `099ABC4567` | Inválido |
| Con caracteres especiales | `099-123-4567`, `+593991234567` | Inválido |
| Solo espacios | `"   "` | Inválido |

---

## HU-08 - Ordenamiento de resultados

---

### TC-035 - Ordenar por fecha ascendente

- **ID del Test**: TC-035
- **ID de la Historia de Usuario**: HU-08
- **Descripción**: Verificar que los tickets se ordenan por fecha de creación en orden ascendente (más antiguo primero).
- **Precondiciones**: Existen tickets con diferentes fechas de creación.
- **Servicio(s)**: **Query Service** (aplicación de `sortBy=createdAt&sortOrder=asc`) + **Frontend** (control de ordenamiento)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con las siguientes fechas de creación:
  | ticketId | createdAt                |
  | T-001    | 2026-02-18T10:00:00Z     |
  | T-002    | 2026-02-15T10:00:00Z     |
  | T-003    | 2026-02-20T10:00:00Z     |
When el operador solicita GET /api/tickets?sortBy=createdAt&sortOrder=asc
Then el código de respuesta es 200
  And los tickets se retornan en el orden: "T-002", "T-001", "T-003"
  And cada ticket tiene una fecha de creación menor o igual a la del siguiente
```

**Partición de equivalencia**:
| Grupo | Valores de sortOrder | Tipo |
|-------|---------------------|------|
| Ascendente | `asc` | Válido |
| Descendente | `desc` | Válido |
| No especificado | (omitido) | Válido (default: desc) |
| Inválido | `up`, `down`, `ascending` | Inválido |

---

### TC-036 - Ordenar por fecha descendente

- **ID del Test**: TC-036
- **ID de la Historia de Usuario**: HU-08
- **Descripción**: Verificar que los tickets se ordenan por fecha de creación en orden descendente (más reciente primero).
- **Precondiciones**: Existen tickets con diferentes fechas de creación.
- **Servicio(s)**: **Query Service** (aplicación de `sortBy=createdAt&sortOrder=desc`) + **Frontend** (control de ordenamiento)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con las siguientes fechas de creación:
  | ticketId | createdAt                |
  | T-001    | 2026-02-18T10:00:00Z     |
  | T-002    | 2026-02-15T10:00:00Z     |
  | T-003    | 2026-02-20T10:00:00Z     |
When el operador solicita GET /api/tickets?sortBy=createdAt&sortOrder=desc
Then el código de respuesta es 200
  And los tickets se retornan en el orden: "T-003", "T-001", "T-002"
  And cada ticket tiene una fecha de creación mayor o igual a la del siguiente
```

---

### TC-037 - Ordenar por prioridad

- **ID del Test**: TC-037
- **ID de la Historia de Usuario**: HU-08
- **Descripción**: Verificar que los tickets se pueden ordenar por prioridad (HIGH > MEDIUM > LOW > PENDING).
- **Precondiciones**: Existen tickets con diferentes prioridades.
- **Servicio(s)**: **Query Service** (aplicación de `sortBy=priority`) + **Frontend** (control de ordenamiento por prioridad)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con las siguientes prioridades:
  | ticketId | priority |
  | T-001    | LOW      |
  | T-002    | HIGH     |
  | T-003    | MEDIUM   |
  | T-004    | PENDING  |
When el operador solicita GET /api/tickets?sortBy=priority&sortOrder=desc
Then el código de respuesta es 200
  And los tickets se retornan en el orden: "T-002" (HIGH), "T-003" (MEDIUM), "T-001" (LOW), "T-004" (PENDING)
```

**Partición de equivalencia**:
| Grupo | Valores de sortBy | Tipo |
|-------|-------------------|------|
| Fecha | `createdAt` | Válido |
| Prioridad | `priority` | Válido |
| Estado | `status` | Válido |
| Tipo | `type` | Válido |
| Campo inexistente | `email`, `nombre` | Inválido |
| No especificado | (omitido) | Válido (default: createdAt) |

---

### TC-038 - Ordenar por estado

- **ID del Test**: TC-038
- **ID de la Historia de Usuario**: HU-08
- **Descripción**: Verificar que los tickets se pueden ordenar por estado.
- **Precondiciones**: Existen tickets con diferentes estados.
- **Servicio(s)**: **Query Service** (aplicación de `sortBy=status`) + **Frontend** (control de ordenamiento por estado)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con los siguientes estados:
  | ticketId | status      |
  | T-001    | IN_PROGRESS |
  | T-002    | RECEIVED    |
  | T-003    | IN_PROGRESS |
  | T-004    | RECEIVED    |
When el operador solicita GET /api/tickets?sortBy=status&sortOrder=asc
Then el código de respuesta es 200
  And los tickets con estado "IN_PROGRESS" aparecen agrupados
  And los tickets con estado "RECEIVED" aparecen agrupados
  And el orden entre grupos es consistente
```

---

### TC-039 - Campo de ordenamiento inválido

- **ID del Test**: TC-039
- **ID de la Historia de Usuario**: HU-08
- **Descripción**: Verificar que el sistema rechaza campos de ordenamiento no válidos.
- **Precondiciones**: Existen tickets en el repositorio.
- **Servicio(s)**: **Query Service** (validación de valores de `sortBy`, HTTP 400)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets procesados en el sistema
When el operador solicita GET /api/tickets?sortBy=email&sortOrder=asc
Then el código de respuesta es 400
  And la respuesta contiene un mensaje de error indicando que "email" no es un campo de ordenamiento válido
  And la respuesta sugiere los campos válidos: "createdAt", "priority", "status", "type"
```

**Partición de equivalencia**:
| Grupo | Valores | Tipo |
|-------|---------|------|
| Campos permitidos | `createdAt`, `priority`, `status`, `type` | Válido |
| Campos del modelo no ordenables | `email`, `lineNumber`, `description` | Inválido |
| Campos inexistentes | `nombre`, `xyz` | Inválido |

**Tabla de Decisión**:
| sortBy | sortOrder | Resultado |
|:------:|:---------:|-----------|
| Válido | `asc` | Ordenado ascendente, HTTP 200 |
| Válido | `desc` | Ordenado descendente, HTTP 200 |
| Válido | Omitido | Usar default desc, HTTP 200 |
| Omitido | Omitido | Default: createdAt desc, HTTP 200 |
| Inválido | Cualquiera | HTTP 400 |
| Válido | Inválido | HTTP 400 |

---

## HU-09 - Métricas agregadas

---

### TC-040 - Visualizar total de tickets

- **ID del Test**: TC-040
- **ID de la Historia de Usuario**: HU-09
- **Descripción**: Verificar que el sistema muestra el total de tickets procesados.
- **Precondiciones**: Existen tickets en el repositorio.
- **Servicio(s)**: **Query Service** (endpoint `GET /api/tickets/metrics`, cálculo de totalTickets) + **Frontend** (card/tarjeta de métrica)

**Pasos (Gherkin)**:
```gherkin
Given existen 25 tickets procesados en el sistema
When el operador solicita GET /api/tickets/metrics
Then el código de respuesta es 200
  And el campo "totalTickets" es 25
```

**Partición de equivalencia**:
| Grupo | Cantidad de tickets | Tipo |
|-------|---------------------|------|
| Sin tickets | 0 | Válido (totalTickets = 0) |
| Pocos tickets | 1 a 10 | Válido |
| Muchos tickets | 100+ | Válido |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| 0 tickets | Repositorio vacío | totalTickets = 0 |
| 1 ticket | Mínimo con datos | totalTickets = 1 |

---

### TC-041 - Distribución por estado

- **ID del Test**: TC-041
- **ID de la Historia de Usuario**: HU-09
- **Descripción**: Verificar que las métricas incluyen la distribución de tickets por estado.
- **Precondiciones**: Existen tickets con diferentes estados.
- **Servicio(s)**: **Query Service** (cálculo de `byStatus` en `/api/tickets/metrics`) + **Frontend** (visualización de distribución)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con los siguientes estados:
  | status      | cantidad |
  | RECEIVED    | 10       |
  | IN_PROGRESS | 15       |
When el operador solicita GET /api/tickets/metrics
Then el código de respuesta es 200
  And el campo "byStatus.RECEIVED" es 10
  And el campo "byStatus.IN_PROGRESS" es 15
  And la suma de todos los valores de "byStatus" es igual a "totalTickets"
```

**Partición de equivalencia**:
| Grupo | Escenario | Tipo |
|-------|-----------|------|
| Todos en un solo estado | 25 RECEIVED, 0 IN_PROGRESS | Válido |
| Distribución equilibrada | 12 RECEIVED, 13 IN_PROGRESS | Válido |
| Sin tickets | 0 en cada estado | Válido |

---

### TC-042 - Distribución por prioridad

- **ID del Test**: TC-042
- **ID de la Historia de Usuario**: HU-09
- **Descripción**: Verificar que las métricas incluyen la distribución de tickets por prioridad.
- **Precondiciones**: Existen tickets con diferentes prioridades.
- **Servicio(s)**:** **Query Service** (cálculo de `byPriority` en `/api/tickets/metrics`) + **Frontend** (visualización)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con las siguientes prioridades:
  | priority | cantidad |
  | HIGH     | 5        |
  | MEDIUM   | 8        |
  | LOW      | 10       |
  | PENDING  | 2        |
When el operador solicita GET /api/tickets/metrics
Then el código de respuesta es 200
  And el campo "byPriority.HIGH" es 5
  And el campo "byPriority.MEDIUM" es 8
  And el campo "byPriority.LOW" es 10
  And el campo "byPriority.PENDING" es 2
  And la suma de todos los valores de "byPriority" es igual a "totalTickets"
```

---

### TC-043 - Distribución por tipo de incidente

- **ID del Test**: TC-043
- **ID de la Historia de Usuario**: HU-09
- **Descripción**: Verificar que las métricas incluyen la distribución de tickets por tipo de incidente.
- **Precondiciones**: Existen tickets de diferentes tipos.
- **Servicio(s)**: **Query Service** (cálculo de `byType` en `/api/tickets/metrics`) + **Frontend** (visualización)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con los siguientes tipos:
  | type                  | cantidad |
  | NO_SERVICE            | 3        |
  | INTERMITTENT_SERVICE  | 4        |
  | SLOW_CONNECTION       | 2        |
  | ROUTER_ISSUE          | 5        |
  | BILLING_QUESTION      | 3        |
  | OTHER                 | 1        |
When el operador solicita GET /api/tickets/metrics
Then el código de respuesta es 200
  And el campo "byType.NO_SERVICE" es 3
  And el campo "byType.INTERMITTENT_SERVICE" es 4
  And el campo "byType.SLOW_CONNECTION" es 2
  And el campo "byType.ROUTER_ISSUE" es 5
  And el campo "byType.BILLING_QUESTION" es 3
  And el campo "byType.OTHER" es 1
  And la suma de todos los valores de "byType" es igual a "totalTickets"
```

---

### TC-044 - Consistencia de métricas con el repositorio

- **ID del Test**: TC-044
- **ID de la Historia de Usuario**: HU-09
- **Descripción**: Verificar que las métricas agregadas son consistentes con los datos reales del repositorio y el listado paginado.
- **Precondiciones**: Existen tickets en el repositorio.
- **Servicio(s)**: **Query Service** (validación de consistencia entre endpoints `/api/tickets/metrics` y `/api/tickets`) + **Frontend** (validación de totales)

**Pasos (Gherkin)**:
```gherkin
Given existen 25 tickets procesados en el sistema
When el operador solicita GET /api/tickets/metrics
  And luego solicita GET /api/tickets?page=1&limit=100
Then el campo "totalTickets" de las métricas es igual al campo "pagination.totalItems" del listado
  And la suma de "byStatus" coincide con el conteo manual de estados del listado
  And la suma de "byPriority" coincide con el conteo manual de prioridades del listado
  And la suma de "byType" coincide con el conteo manual de tipos del listado
```

---

## HU-10 - Visualización gráfica

---

### TC-045 - Gráfica de distribución por prioridad

- **ID del Test**: TC-045
- **ID de la Historia de Usuario**: HU-10
- **Descripción**: Verificar que se muestra una gráfica (barras o pastel) con la distribución de tickets por prioridad.
- **Precondiciones**: Existen tickets con diferentes prioridades. La página de administrador está cargada.
- **Servicio(s)**: **Frontend** (renderizado de gráfica, librería de charts) + **Query Service** (fuente de datos desde `/api/tickets/metrics`)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con prioridades HIGH (5), MEDIUM (8), LOW (10), PENDING (2)
  And la página de administrador está cargada
When el operador visualiza la sección de gráficas
Then se muestra una gráfica de distribución por prioridad
  And la gráfica contiene segmentos/barras para HIGH, MEDIUM, LOW y PENDING
  And los valores visualizados corresponden a 5, 8, 10 y 2 respectivamente
  And la gráfica tiene leyenda con etiquetas de cada prioridad
```

**Partición de equivalencia**:
| Grupo | Escenario | Tipo |
|-------|-----------|------|
| Distribución variada | Tickets en todas las prioridades | Válido |
| Todo en una prioridad | 25 HIGH, 0 en el resto | Válido (1 segmento dominante) |
| Sin tickets | 0 en todas | Válido (gráfica vacía o mensaje) |

---

### TC-046 - Gráfica de distribución por estado

- **ID del Test**: TC-046
- **ID de la Historia de Usuario**: HU-10
- **Descripción**: Verificar que se muestra una gráfica con la distribución de tickets por estado.
- **Precondiciones**: Existen tickets con diferentes estados. La página de administrador está cargada.
- **Servicio(s)**: **Frontend** (renderizado de gráfica por estado) + **Query Service** (fuente de datos desde `/api/tickets/metrics`)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con estados RECEIVED (10) e IN_PROGRESS (15)
  And la página de administrador está cargada
When el operador visualiza la sección de gráficas
Then se muestra una gráfica de distribución por estado
  And la gráfica contiene segmentos/barras para RECEIVED e IN_PROGRESS
  And los valores visualizados corresponden a 10 y 15 respectivamente
```

---

### TC-047 - Actualización de gráficas con filtros activos

- **ID del Test**: TC-047
- **ID de la Historia de Usuario**: HU-10
- **Descripción**: Verificar que las gráficas se actualizan al aplicar filtros, reflejando solo los datos del subconjunto filtrado.
- **Precondiciones**: La página de administrador está cargada con datos y gráficas visibles.
- **Servicio(s)**: **Frontend** (actualización de gráficas con datos filtrados) + **Query Service** (datos filtrados desde `/api/tickets`)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets con las siguientes combinaciones:
  | type           | priority | status      |
  | NO_SERVICE     | HIGH     | IN_PROGRESS |
  | NO_SERVICE     | HIGH     | IN_PROGRESS |
  | SLOW_CONNECTION| MEDIUM   | IN_PROGRESS |
  | OTHER          | PENDING  | RECEIVED    |
  And la página de administrador muestra las gráficas con todos los datos
When el operador aplica el filtro de tipo de incidente "NO_SERVICE"
Then las gráficas se actualizan
  And la gráfica de prioridad muestra solo HIGH (2)
  And la gráfica de estado muestra solo IN_PROGRESS (2)
```

**Tabla de Decisión**:
| Filtro aplicado | Datos en gráfica |
|:---------------:|:----------------:|
| Ninguno | Todos los tickets |
| Tipo = NO_SERVICE | Solo tickets NO_SERVICE |
| Prioridad = HIGH | Solo tickets HIGH |
| Estado = RECEIVED | Solo tickets RECEIVED |
| Tipo + Prioridad | Intersección de ambos filtros |

---

## HU-11 - Exportación de resultados (opcional)

---

### TC-048 - Exportar CSV con columnas básicas

- **ID del Test**: TC-048
- **ID de la Historia de Usuario**: HU-11
- **Descripción**: Verificar que se puede exportar la lista de tickets en formato CSV con las columnas básicas del modelo.
- **Precondiciones**: Existen tickets en el repositorio. La página de administrador está cargada.
- **Servicio(s)**: **Frontend** (generación de CSV cliente, descarga de archivo)

**Pasos (Gherkin)**:
```gherkin
Given existen 5 tickets procesados en el sistema
  And la página de administrador muestra la tabla con tickets
When el operador hace clic en el botón "Exportar CSV"
Then se descarga un archivo con extensión ".csv"
  And la primera fila del archivo contiene los encabezados: "ticketId,lineNumber,type,description,priority,status,createdAt,processedAt"
  And el archivo contiene 5 filas de datos (más la fila de encabezados)
  And cada fila tiene los valores correctos correspondientes a los tickets
```

**Partición de equivalencia**:
| Grupo | Escenario | Tipo |
|-------|-----------|------|
| Con tickets | 1 o más tickets | Válido |
| Sin tickets | 0 tickets | Válido (solo encabezados o mensaje) |
| Tickets con descripción null | Campos opcionales vacíos | Válido (campos vacíos en CSV) |
| Tickets con caracteres especiales en descripción | Comas, comillas, saltos de línea | Válido (escapado correctamente) |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| 1 ticket | Mínimo con datos | CSV con 2 filas (header + 1) |
| 0 tickets | Sin datos | CSV solo con encabezados |
| Descripción con comas | `"Sin servicio, urgente"` | Campo escapado con comillas en CSV |

---

### TC-049 - Exportar respetando filtros activos

- **ID del Test**: TC-049
- **ID de la Historia de Usuario**: HU-11
- **Descripción**: Verificar que el CSV exportado solo contiene los tickets que coinciden con los filtros activos al momento de la exportación.
- **Precondiciones**: Existen tickets variados. Se han aplicado filtros en la UI.
- **Servicio(s)**: **Frontend** (exportación respetando filtros activos)

**Pasos (Gherkin)**:
```gherkin
Given existen 20 tickets procesados en el sistema
  And el operador ha aplicado el filtro de prioridad "HIGH"
  And la tabla muestra 5 tickets filtrados
When el operador hace clic en el botón "Exportar CSV"
Then se descarga un archivo CSV
  And el archivo contiene exactamente 5 filas de datos
  And todos los registros en el CSV tienen prioridad "HIGH"
```

---

### TC-050 - Exportar cuando no hay resultados

- **ID del Test**: TC-050
- **ID de la Historia de Usuario**: HU-11
- **Descripción**: Verificar el comportamiento de la exportación cuando no hay resultados (por filtros o repositorio vacío).
- **Precondiciones**: No hay tickets que coincidan con los filtros activos.
- **Servicio(s)**: **Frontend** (manejo de exportación vacía)

**Pasos (Gherkin)**:
```gherkin
Given existen tickets en el sistema pero ninguno coincide con los filtros activos
  And la tabla muestra "Sin resultados"
When el operador hace clic en el botón "Exportar CSV"
Then se descarga un archivo CSV que contiene solo la fila de encabezados
  Or se muestra un mensaje indicando que no hay datos para exportar
```

---

## HU-12 - Actualización manual o en tiempo real (opcional)

---

### TC-051 - Refresco manual de datos

- **ID del Test**: TC-051
- **ID de la Historia de Usuario**: HU-12
- **Descripción**: Verificar que el operador puede actualizar manualmente los datos de la tabla para ver cambios recientes.
- **Precondiciones**: La página de administrador está cargada con datos.
- **Servicio(s)**: **Frontend** (botón de refresh, recarga de datos) + **Query Service** (datos actualizados desde `/api/tickets`)

**Pasos (Gherkin)**:
```gherkin
Given la página de administrador muestra 10 tickets
  And se han procesado 5 tickets nuevos en el sistema después de la carga inicial
When el operador hace clic en el botón "Actualizar" o "Refrescar"
Then la tabla se recarga con los datos más recientes
  And el campo "pagination.totalItems" refleja el nuevo total (15)
  And los filtros activos se mantienen durante el refresco
```

**Partición de equivalencia**:
| Grupo | Escenario | Tipo |
|-------|-----------|------|
| Con datos nuevos | Tickets agregados después de la carga | Válido |
| Sin datos nuevos | Sin cambios desde la carga | Válido (mismos datos) |
| Con filtros activos | Refresco manteniendo filtros | Válido |
| Sin filtros | Refresco sin filtros | Válido |

---

### TC-052 - Auto-refresh configurable

- **ID del Test**: TC-052
- **ID de la Historia de Usuario**: HU-12
- **Descripción**: Verificar que el auto-refresh es configurable en intervalo y puede activarse/desactivarse.
- **Precondiciones**: La página de administrador está cargada.
- **Servicio(s)**: **Frontend** (lógica de auto-refresh, timer, indicador visual) + **Query Service** (fuente de datos actualizada)

**Pasos (Gherkin)**:
```gherkin
Given la página de administrador está cargada
  And el auto-refresh está desactivado por defecto
When el operador activa el auto-refresh con un intervalo de 30 segundos
Then los datos de la tabla se recargan automáticamente cada 30 segundos
  And se muestra un indicador visual de que el auto-refresh está activo
  And se muestra la hora de la última actualización
```

**Partición de equivalencia**:
| Grupo | Valores de intervalo | Tipo |
|-------|---------------------|------|
| Intervalo válido | 10s, 30s, 60s | Válido |
| Intervalo muy corto | 1s, 2s | Inválido (sobrecarga) |
| Intervalo muy largo | 600s+ | Válido pero poco práctico |
| Intervalo no numérico | `abc` | Inválido |

**Valores límites**:
| Valor | Contexto | Esperado |
|-------|----------|----------|
| 10 segundos | Mínimo recomendado | Auto-refresh activo |
| 5 segundos | Debajo del mínimo | Error o ajuste automático al mínimo |
| 60 segundos | Intervalo estándar | Auto-refresh activo |

**Tabla de Decisión**:
| Auto-refresh | Intervalo | Resultado |
|:------------:|:---------:|-----------|
| Activado | Válido | Recarga periódica con indicador activo |
| Activado | Inválido | Error de validación o ajuste al mínimo |
| Desactivado | N/A | Sin recarga automática, solo manual |

---

### TC-053 - Desactivar auto-refresh

- **ID del Test**: TC-053
- **ID de la Historia de Usuario**: HU-12
- **Descripción**: Verificar que el operador puede desactivar el auto-refresh cuando está activo.
- **Precondiciones**: El auto-refresh está activo.
- **Servicio(s)**: **Frontend** (desactivación de auto-refresh, stop de timer)

**Pasos (Gherkin)**:
```gherkin
Given el auto-refresh está activo con un intervalo de 30 segundos
  And se muestra el indicador visible de auto-refresh activo
When el operador desactiva el auto-refresh
Then los datos dejan de recargarse automáticamente
  And el indicador de auto-refresh desaparece o cambia a inactivo
  And la tabla mantiene los últimos datos cargados
  And el botón de refresco manual sigue disponible
```

---

## 📅 Fecha de diseño
18 de febrero de 2026

## 📎 Referencias
- [FASE_3_HISTORIAS_RIESGOS.md](./FASE_3_HISTORIAS_RIESGOS.md) - Historias de usuario y matriz de riesgos
- Dominio: Sistema Distribuido de Gestión de Quejas ISP
