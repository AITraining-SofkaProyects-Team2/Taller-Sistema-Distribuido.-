# 📊 FASE 2: Análisis de Sistemas y Contexto

## Dashboard de Gestión de Reportes - Sistema Distribuido ISP

---

## 🎯 Resumen Ejecutivo

Se requiere desarrollar un **Dashboard de Gestión de Reportes** para el sistema distribuido de quejas ISP que permita a operadores y administradores consultar, filtrar y analizar tickets procesados en tiempo real. El dashboard debe integrarse con la arquitectura existente sin comprometer los principios SOLID ni la separación de responsabilidades.

---

## 📋 Propósito del Proyecto

Proveer visibilidad operativa del sistema de gestión de quejas mediante una interfaz web que centralice la información de tickets, permitiendo monitoreo, análisis y toma de decisiones basada en datos.

---

## 🎯 Objetivo Principal del Proyecto

Implementar un módulo de visualización y consulta de tickets que permita:
1. **Consultar** tickets procesados con filtros avanzados
2. **Visualizar** métricas clave del sistema (volumen, prioridades, estados)
3. **Exportar** datos para análisis externo
4. **Monitorear** en tiempo real el estado del sistema

---

## 🔍 Descripción de Alcance del Proyecto

### Dentro del alcance:
- API REST para consulta de tickets (GET endpoints)
- Servicio de consulta con filtros por estado, prioridad, tipo, fecha, línea
- Repositorio extendido con métodos de lectura (findAll, findById, findByFilters)
- Dashboard React con tablas, filtros y gráficas
- Métricas agregadas (total tickets, distribución por prioridad/estado/tipo)
- Paginación y ordenamiento
- Exportación básica (CSV/JSON)
- Integración con arquitectura existente

### Fuera del alcance:
- Modificación o eliminación de tickets desde dashboard
- Autenticación/Autorización (fase futura)
- Notificaciones push/websockets (fase futura)
- Asignación de tickets a técnicos
- Persistencia en base de datos real (mantener in-memory)
- Analytics avanzado o machine learning

---

## 📝 Análisis de Requerimientos

### **Requerimientos Funcionales (RF)**

| ID | Requerimiento | Prioridad |
|----|--------------|-----------|
| RF-01 | Listar todos los tickets con paginación | Alta |
| RF-02 | Filtrar tickets por estado (RECEIVED, IN_PROGRESS) | Alta |
| RF-03 | Filtrar tickets por prioridad (HIGH, MEDIUM, LOW, PENDING) | Alta |
| RF-04 | Filtrar tickets por tipo de incidente | Media |
| RF-05 | Filtrar tickets por rango de fechas | Media |
| RF-06 | Buscar ticket por ID | Media |
| RF-07 | Buscar tickets por número de línea | Alta |
| RF-08 | Ordenar resultados por fecha, prioridad o estado | Media |
| RF-09 | Mostrar métricas agregadas (totales por estado/prioridad/tipo) | Alta |
| RF-10 | Visualizar distribución de tickets en gráficas | Media |
| RF-11 | Exportar resultados filtrados a CSV (opcional) | Baja |
| RF-12 | Actualizar datos en tiempo real o refrescar manualmente (opcional) | Media |
| RF-13 | Responsive design para tablets y desktop | Media |

### **Requerimientos No Funcionales (RNF)**

| ID | Requerimiento | Prioridad |
|----|--------------|-----------|
| RNF-01 | API debe responder consultas en < 500ms para 50-80 tickets | Alta |
| RNF-02 | Mantener cobertura de pruebas 100% en servicios backend | Alta |
| RNF-03 | Seguir patrones SOLID y Clean Code existentes | Alta |
| RNF-04 | TypeScript estricto en todo el código nuevo | Alta |
| RNF-05 | Controladores delgados, lógica en servicios | Alta |
| RNF-06 | Documentar endpoints con JSDoc | Media |
| RNF-07 | Validación de query params sin middleware dedicado | Alta |
| RNF-08 | Manejo de errores con Chain of Responsibility existente | Alta |

---

## ✅ Criterios de Aceptación Generales

1. El dashboard muestra correctamente todos los tickets almacenados
2. Los filtros funcionan de forma independiente y combinada
3. Las métricas reflejan el estado real del repositorio
4. La paginación permite navegar conjuntos grandes de datos
5. El código pasa todas las pruebas Vitest
6. No se rompe el flujo existente Producer → RabbitMQ → Consumer
7. La cobertura de pruebas se mantiene o mejora

---

## ❌ Criterios de No Aceptación

1. No se permite modificar o eliminar tickets desde el dashboard
2. No se implementarán features de autenticación en esta fase
4. No se implementarán websockets en esta fase
5. No se permitirá código sin pruebas unitarias

---

## 📌 Supuestos

1. El volumen máximo esperado es de ~500-1000 tickets simultáneos
2. La persistencia en base de datos es requerida para la prueba de concepto
3. Los usuarios accederán desde navegadores modernos (últimas 2 versiones)
4. La latencia de red es aceptable (<100ms en LAN)
5. No hay requisitos de alta disponibilidad en esta fase

---

## 🚧 Restricciones

1. Mantener arquitectura monorepo existente
2. No modificar contratos de mensajería RabbitMQ
3. Respetar estructura de carpetas actual (controller/service/repository)
4. Usar únicamente tecnologías del stack actual (no agregar nuevas librerías pesadas)
6. No romper tests existentes

---

## 🧩 Listado de Módulos

### **Backend - Producer (API)**
1. **Query Controller** (`tickets.controller.ts`)
   - GET /tickets
   - GET /tickets/:id
   - GET /tickets/metrics

2. **Query Service** (`tickets.query.service.ts`)
   - Lógica de filtrado y agregación
   - Transformación de datos para respuesta

3. **Validation Middleware** (`validateTicketQuery.ts`)
   - Validación de query params
   - Sanitización de inputs

### **Backend - Consumer (Worker)**
4. **Persistencia en BD**
   - Repositorio con acceso a base de datos (reemplazo del in-memory)
   - Operaciones de lectura y escritura (CRUD parcial)

### **Backend - Microservicio de Consultas (nuevo)**
5. **API de consultas para dashboard**
   - Se conecta a la misma base de datos
   - Expone endpoints de lectura, filtros y metricas

### **Frontend**
6. **Dashboard Module** (`/pages/Dashboard`)
   - DashboardPage.tsx
   - TicketsTable.tsx
   - FiltersPanel.tsx
   - MetricsCards.tsx
   - ChartsSection.tsx

7. **Tickets Service** (`tickets.service.ts`)
   - API calls para consultas
   - Transformación de datos

8. **Hooks**
   - useTickets.ts
   - useTicketFilters.ts
   - useMetrics.ts

---

## 🔗 Dependencias Identificadas

### Técnicas:
- Frontend depende de endpoints GET del microservicio de consultas
- Microservicio de consultas comparte la misma base de datos con Consumer
- Métricas dependen del repositorio persistente

### Opciones de arquitectura:
- **Opción A**: Producer consulta directamente repositorio de Consumer (acoplamiento)
- **Opción B**: Repositorio compartido con acceso desde ambos servicios
- **Opción C**: Consumer expone API de consulta, Producer actúa como gateway
- **Opción D**: Producer mantiene réplica read-only del estado

---

## 📅 Fecha de análisis
18 de febrero de 2026

---

## 🔄 Próximos pasos
- **Fase 3**: Generación de Historias de Usuario y Matriz de Riesgos
- **Fase 4**: Análisis de Ambigüedades y Validación
