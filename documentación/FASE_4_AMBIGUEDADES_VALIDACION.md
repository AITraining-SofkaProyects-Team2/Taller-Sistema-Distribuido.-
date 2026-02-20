# ❓ FASE 4: Ambiguedades y Validacion

## Dashboard de Gestion de Reportes - Sistema Distribuido ISP

---

## Objetivo de esta fase
Resolver ambiguedades para definir el alcance tecnico y funcional antes de avanzar a diseno e implementacion.

---

## 1) Base de datos
1. Que motor de base de datos se usara?
   - PostgreSQL

2. Debe existir migracion/seed inicial?
   - Si, con datos de ejemplo (10)

3. El modelo de datos debe ser unico para Consumer y microservicio de consultas?
   - Si (tabla/coleccion compartida)

---

## 2) Microservicio de consultas
4. El microservicio de consultas debe ser un servicio nuevo separado del Producer y Consumer?
   - Si, servicio independiente

5. Debe tener su propio pipeline de despliegue (Docker separado)?
   - En el mismo docker compose, pero cada servicio tiene su propio contenedor

6. Necesitas versionado de API (por ejemplo /v1/tickets)?
   - Si

---

## 3) Contratos de API
7. Confirmas estos endpoints?
   - GET /tickets
   - GET /tickets/:id
   - GET /tickets/metrics

8. Que parametros de filtro deben soportarse en GET /tickets?
   - estado
   - prioridad
   - tipo
   - lineNumber
   - ticketId
   - fecha

9. Que campos exactos debe devolver la respuesta?
   - ticketId, lineNumber, email, type, description, status, priority, createdAt, processedAt

---

## 4) Paginacion y ordenamiento
10. Paginacion basada en:
   - Pendiente de definicion (page + pageSize o limit + offset)

11. Campos permitidos para ordenar:
   - estado
   - prioridad
   - tipo
   - lineNumber
   - ticketId
   - fecha

12. Orden por defecto:
   - Pendiente de definicion (createdAt desc, createdAt asc o prioridad)

---

## 5) Metricas
13. Que metricas se requieren?
   - total de tickets
   - distribucion por estado
   - distribucion por prioridad
   - distribucion por tipo

14. Las metricas deben respetar filtros activos o ser globales?
   - respetar filtros

---

## 6) Dashboard
15. Componentes obligatorios del dashboard:
   - tabla de tickets
   - filtros
   - tarjetas de metricas
   - graficas

16. Necesitas roles o vistas diferentes (operador vs supervisor)?
   - No

---

## 7) Rendimiento y limites
17. Tamano maximo por pagina:
   - 20

18. Limite maximo de resultados por consulta:
   - 100


---

## 8) Observabilidad
19. Requiere logging estructurado para el microservicio?
   - No

20. Requiere metricas tecnicas (latencia, errores) expuestas en endpoint?
   - No

---

## 9) Preguntas pendientes de definicion
21. Paginacion: confirmas usar `page + pageSize`
22. Orden por defecto: confirmas `createdAt asc`
23. Filtro de fecha: aplica sobre `createdAt`
24. Zona horaria para filtros de fecha: hora local
25. Esquema minimo de BD: confirmas una sola tabla `tickets` con indices por `status`, `priority`, `type`, `createdAt`, `lineNumber` (si, confirmo)
26. Herramienta de migraciones: migracion manual
---
## Instrucciones de respuesta
Responde numerando cada pregunta (1-20) con la opcion elegida o con el detalle requerido.

---

## Fecha
18 de febrero de 2026
