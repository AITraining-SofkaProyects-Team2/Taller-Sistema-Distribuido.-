# Instrucciones de Copilot - Taller Sistema Distribuido (Gestión de Quejas ISP)

Eres un desarrollador experto en IA que asiste en el desarrollo de un sistema de gestión de quejas distribuido para un ISP. Sigue estas guías estrictamente para asegurar la consistencia con la arquitectura y los estándares de calidad del proyecto.

## 1. Objetivo del Proyecto
Construir y mantener un sistema distribuido para gestión de quejas de ISP con arquitectura orientada a eventos:
- Frontend captura incidentes del usuario.
- Producer valida y publica en RabbitMQ.
- Consumer consume, prioriza y procesa los tickets.

## 2. Estructura del Monorepo
- **`/frontend`**: React + Vite + TypeScript. UI de captura de incidentes y pruebas de estrés.
- **`/backend/producer`**: API Express + TypeScript. Valida requests, serializa y publica mensajes a RabbitMQ.
- **`/backend/consumer`**: Worker Node.js + TypeScript. Consume mensajes, resuelve prioridad y persiste.
- **`/backend/e2e`**: Pruebas end-to-end del flujo distribuido completo.
- **`docker-compose.yml`**: Orquestación de todos los servicios (frontend, producer, consumer, RabbitMQ).

## 3. Flujo End-to-End (Fuente de Verdad)
1. **Frontend** envía queja HTTP al Producer (`/api/complaints`).
2. **Producer** valida el request (middleware `validateComplaintRequest`).
3. **Producer** serializa y publica mensaje a RabbitMQ (vía `MessagingFacade`).
4. **Consumer** recibe mensaje del broker (`MessageHandler`).
5. **Consumer** resuelve prioridad (`PriorityResolver` + estrategias Strategy).
6. **Consumer** actualiza estado del ciclo de vida y persiste en repositorio.

## 4. Reglas de Negocio Obligatorias

### Ciclo de Vida de la Queja
Recibida → Validada → Encolada → Priorizada → En Progreso.

### Prioridad por Tipo de Incidente
| Tipo de Incidente        | Prioridad |
|--------------------------|-----------|
| `NO_SERVICE`             | **ALTA**  |
| `INTERMITTENT_SERVICE`   | **MEDIA** |
| `SLOW_CONNECTION`        | **MEDIA** |
| `ROUTER_ISSUE`           | **MEDIA** |
| `BILLING_QUESTION`       | **BAJA**  |
| `OTHER`                  | **BAJA**  |

### Validación de Campos
- **Obligatorios**: `lineNumber`, `email`, `incidentType`.
- `description` es **REQUERIDO SOLO** si `incidentType === "OTHER"`.
- `description: null` debe procesarse normalmente si el tipo NO es `OTHER`.

## 5. Stack Tecnológico, Principios y Patrones
- **Lenguaje**: TypeScript (modo estricto).
- **Pruebas**: Vitest (unitarias, integración, E2E).
- **Principios Core**: SOLID, Clean Code.
- **Patrones de Diseño obligatorios**:
  - **Strategy**: Resolución de prioridades y determinación de estados.
  - **Chain of Responsibility**: Manejo centralizado de errores (`middlewares/errorHandlers/*`).
  - **Facade**: Interacciones con el broker de mensajería (`MessagingFacade`).
  - **Singleton**: Gestores de conexión (ej. `RabbitMQConnectionManager`).
  - **Adapter**: Abstracciones de infraestructura.

## 6. Reglas de Implementación
- Controladores **delgados**: sin lógica de negocio; delegar a servicios.
- **No** usar `try-catch` en controladores; delegar a servicios o middleware centralizado.
- Priorizar **interfaces sobre implementaciones** (DIP).
- Nombres explícitos y semánticos (ej. `PriorityResolverStrategy`, no `PrioRes`).
- Programación funcional donde sea posible; clases para Servicios/Repositorios cuando DIP lo requiera.
- Mantener compatibilidad de tipos compartidos entre frontend y backend.
- **No introducir campos nuevos** en payloads sin actualizar tipos, validaciones y pruebas en toda la cadena.

## 7. Reglas de Pruebas y Calidad
- **Cobertura objetivo**: 100% en servicios del backend (Producer y Consumer).
- Toda lógica nueva **debe incluir** pruebas Vitest.
- **Impacto de cambios de contrato** — al modificar validaciones o payloads, actualizar:
  - Tests de middleware/controller/service en Producer.
  - Tests de processor/handler/strategies en Consumer.
  - E2E si cambia el contrato de mensajería.
- Si hay duda de contrato, **validar con pruebas existentes** antes de refactorizar.
- Manejo de errores con `errorHandler` centralizado (Chain of Responsibility).

## 8. Flujo de Trabajo AI-First para Copilot
Antes de proponer cualquier cambio:
1. **Auditar SOLID**: Revisar que el cambio no viole principios.
2. **Revisar contratos y tipos**: Verificar impacto en payloads, interfaces y validaciones.
3. **Proponer tests** en paralelo o antes del cambio.
4. **Implementar** el cambio mínimo necesario.
5. **Validar**: Asegurar que compila y pasa tests.

### Protocolo de Auditoría Pre-Commit
- Verificar SOLID y patrones.
- Ejecutar pruebas del paquete afectado.
- Confirmar que la cobertura se mantiene o mejora.

## 9. Definition of Done (por cada cambio)
- [ ] Compila en TypeScript estricto sin errores.
- [ ] Pasa lint y tests del paquete afectado.
- [ ] Mantiene o mejora cobertura de pruebas.
- [ ] Respeta reglas de negocio y patrones definidos.
- [ ] No rompe el flujo distribuido Producer → RabbitMQ → Consumer.
- [ ] Cambios de contrato reflejados en tipos, validaciones y tests de toda la cadena.

