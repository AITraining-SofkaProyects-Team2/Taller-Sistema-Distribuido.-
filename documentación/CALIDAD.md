# Calidad y Estrategia de Pruebas

Este documento detalla el análisis de calidad, defectos conocidos y la estrategia de validación del sistema, culminando en la suite de pruebas implementada.

## 1. Anatomía de un Incidente

```mermaid
graph LR
    A[ERROR <br>(humano)] --> B[DEFECTO <br>(código)]
    B --> C[FALLA <br>(usuario)]
```

### Bug Conocido: Validación Estricta de Descripción

**Contexto:**
El Consumer (Worker) trata como inválido cualquier mensaje con `description: null` y no continúa el procesamiento, mostrando "Estructura de mensaje inválida. Omitiendo lógica.".
Según las reglas del sistema, la descripción es obligatoria solo cuando `incidentType` es `OTHER`. Para el resto de tipos (`NO_SERVICE`, `INTERMITTENT_SERVICE`, `SLOW_CONNECTION`, `ROUTER_ISSUE`, `BILLING_QUESTION`) la descripción es opcional. Por tanto, un mensaje con `description: null` y tipo distinto de `OTHER` debería procesarse con normalidad.

**Comportamiento Actual:**
1. El mensaje llega al Consumer con `description: null`.
2. El Consumer lo considera "estructura de mensaje inválida" y omite la lógica (no asigna prioridad, no actualiza estado, no publica `complaint.prioritized`).
3. En logs aparece: *"Estructura de mensaje inválida. Omitiendo lógica."*

**Comportamiento Esperado:**
- Si `incidentType` **no es** `OTHER`, el mensaje debe procesarse aunque `description` sea `null` o esté ausente.
- Solo cuando `incidentType === 'OTHER'` debería exigirse que `description` esté presente y no vacío (validación que ya hace el Producer y el frontend).

**Comportamiento cuando sí hay descripción:**
Si se envía la misma queja (mismo tipo, ej. "Servicio intermitente") con descripción, el Consumer procesa correctamente el mensaje: asigna prioridad, cambia estado a `IN_PROGRESS` y se ve en logs "Incidente procesado" con `priority`, `status` y `processedAt`.

**Análisis del Defecto:**
- **Error:** El desarrollador tuvo una mala interpretación del contrato de mensajes entre Producer y Consumer, derivada de un prompt incompleto que no especificaba claramente las reglas de obligatoriedad del campo `description`.
- **Defecto:** La validación que retorna “inválido” si la descripción es “null”.
- **Fallo:** El Consumer lo considera "estructura de mensaje inválida" y omite la lógica (no asigna prioridad, no actualiza estado, no publica `complaint.prioritized`).

---

## 2. Análisis de la Pirámide de Pruebas

### Por qué este proyecto requiere más pruebas unitarias que E2E

En un sistema distribuido como el de gestión de quejas (Frontend → Producer → RabbitMQ → Consumer), el proyecto requiere más pruebas en la base de la pirámide (unitarias) que en la cúspide (E2E) porque el mayor riesgo de defectos y el mayor costo de detección están en la lógica de negocio y en las dependencias externas, no en el flujo end-to-end en sí. Apostar principalmente por E2E para validar esa lógica sería lento, costoso y frágil; las pruebas unitarias permiten validar el comportamiento crítico en milisegundos y sin infraestructura.

En este proyecto:
- Si la mayoría de las pruebas fueran E2E, cada fallo en una regla de negocio (por ejemplo, un bug en el cálculo de prioridad según tipo de incidente) solo se detectaría al subir todo el sistema, con latencia de RabbitMQ, arranque de contenedores y tiempo de ejecución.
- Por el contrario, una prueba unitaria sobre la estrategia de prioridad se ejecuta en milisegundos.
- **Conclusión:** La forma eficiente de proteger la lógica crítica es priorizar la base de la pirámide.

### Argumentos a favor de una base ancha (más unitarias que E2E)

#### 1. La lógica de negocio es el núcleo del riesgo
En este sistema, parte del valor está en reglas bien definidas y estables: priorización por tipo de incidente (Strategy), validación de solicitudes, construcción de eventos y manejo de errores (Chain of Responsibility). Esa lógica es determinista y pura: dados los mismos inputs, los outputs están definidos; no depende del orden de mensajes en la cola ni del estado del broker.

- **Pruebas Unitarias:** Pueden ejercitar cada estrategia de prioridad, cada validación y cada handler de error de forma aislada, con mocks y datos concretos. Un error se detecta inmediatamente con un stack trace preciso.
- **Pruebas E2E:** Solo revelarían ese error después de enviar un mensaje por la API, esperar a RabbitMQ y al consumer. El fallo sería abstracto (“ticket con prioridad equivocada”) y el diagnóstico lento.

#### 2. Las dependencias distribuidas encarecen y ralentizan las E2E
El sistema involucra varios procesos (Frontend, Producer, RabbitMQ, Consumer). Una batería E2E típica implica:
1. Levantar contenedores.
2. Esperar disponibilidad de servicios.
3. Ejecutar escenarios HTTP/AMQP via red.
4. Limpiar estado.

Detectar defectos de lógica interna pagando este costo cada vez es ineficiente. Las pruebas unitarias se ejecutan en el proceso del runner en milisegundos, permitiendo feedback rápido.

#### 3. Desacoplamiento y diseño orientado a pruebas
El proyecto aplica patrones que favorecen pruebas unitarias:
- **Strategy** (Prioridad)
- **Chain of Responsibility** (Errores)
- **Adapter** (Broker)
- **Interfaces** (Repositorios, Facades)

Esto implica:
- **Puntos de extensión claros:** Cada pieza se prueba por separado.
- **Dependencias inyectables:** Mocks triviales para broker/BD.
- **Contratos definidos:** Tests que verifican comportamiento sin conocer implementación.

No aprovechar las unitarias sería desperdiciar el diseño arquitectónico.

#### 4. Regresiones y refactoring
Con una base sólida de pruebas unitarias:
- Cada cambio se valida con tests que solo tocan el módulo afectado.
- Las regresiones se acotan de inmediato.
- El refactoring es seguro porque la suite unitaria actúa como red de protección.

### Escenarios de Alto Valor

| Nivel | Escenario de Alto Valor | Riesgo que mitiga |
|-------|-------------------------|-------------------|
| **Unitario** | Verificar que el `PriorityResolver` asigne `HIGH` ante un incidente `NO_SERVICE`. | Defecto en la lógica de priorización. |
| **Integración** | Verificar que el `RabbitMQConnectionManager` (Singleton) recupere el canal tras una desconexión. | Fragilidad en la comunicación con la infraestructura. |
| **E2E** | Crear un ticket desde el Frontend y verificar que el Worker lo procese correctamente. | Fallas en la orquestación completa del sistema distribuido. |

---

## 3. Suite de Pruebas: Implementación Mínima Viable

Este documento describe la suite de pruebas existente en el proyecto, la cual demuestra los tres niveles de la Pirámide de Pruebas aplicados a nuestra arquitectura distribuida.

### 📐 Inventario de Pruebas por Nivel

#### 🟢 UNITARIAS (Base — Mayor volumen)

Las pruebas unitarias cubren la lógica de negocio aislada dentro de los patrones de diseño.

- **`processor.test.ts`** (9 tests) — *Valida Strategy Pattern*
  - `determinePriority`: Verifica que los 7 tipos de incidente se mapeen a la prioridad correcta.
  - `determineStatus`: Verifica las reglas de transición de estado.

- **`validateComplaintRequest.test.ts`** (8 tests) — *Valida Middleware & SRP*
  - Campos requeridos (`lineNumber`, `email`, `incidentType`).
  - Validación de formato de email.
  - Regla de negocio condicional: `OTHER` requiere `description`.

- **`errorHandler.test.ts`** (5 tests) — *Valida Chain of Responsibility*
  - `ValidationError` → 400
  - `MessagingError` → 503
  - `SyntaxError` → 400
  - Error genérico → 500

- **`MessageHandler.test.ts`** (11 tests) — *Valida Consumer Logic*
  - Mensajes nulos o inválidos.
  - Éxito (ack + persistencia).
  - Estructura inválida → DLQ.
  - Lógica de Retry con headers `x-death`.

#### 🟡 INTEGRACIÓN (Centro — Volumen medio)

Las pruebas de integración validan la interacción entre capas del Producer (API → Controller → Service → Facade).

- **`complaints.api.test.ts`** (7 tests)
  - Validación HTTP: 400 para requests inválidos.
  - Éxito HTTP: 201 con `ticketId`.
  - Reglas de negocio en capa HTTP.
  - Manejo de rutas inexistentes (404).

#### 🔴 E2E (Cúspide — Volumen mínimo)

La prueba End-to-End valida el flujo crítico completo a través de toda la infraestructura.

- **`complaint-flow.e2e.test.ts`** (1 flujo automatizado)
  - **Flujo:** Frontend/API → POST /complaints → RabbitMQ → Consumer process → Metricas actualizadas.
  - **Ejecución:** Automatizada vía script npm.

#### Cómo ejecutar la prueba E2E:

1. Asegúrate de que el entorno Docker esté corriendo:
   ```bash
   docker-compose up -d
   ```

2. Ejecuta el comando de prueba desde `backend/producer`:
   ```bash
   npm run test:e2e
   ```

### Patrones Validados por Cada Nivel

| Patrón de Diseño | Unitaria | Integración | E2E |
|------------------|----------|-------------|-----|
| **Singleton** (ConnectionManager) | — | ✅ Mock en tests API | ✅ Conexión real |
| **Facade** (MessagingFacade) | — | ✅ Mock en tests API | ✅ Publicación real |
| **Adapter** (IConnectionManager) | — | ✅ Inyección de mock | ✅ amqplib real |
| **Strategy** (PriorityResolver) | ✅ 9 tests directos | — | ✅ Priorización real |
| **Chain of Resp.** (Error Handlers) | ✅ Tests por handler | ✅ HTTP errors reales | ✅ Errores en flujo |

### Principios SOLID Habilitando los Tests

| Principio | Cómo facilita el testing |
|-----------|--------------------------|
| **SRP** | Cada test tiene un único motivo para fallar, simplificando el debugging. |
| **OCP** | Nuevas estrategias = nuevos tests sin tocar los existentes. |
| **DIP** | Mocks triviales vía interfaces (`IMessagingFacade`, `ILogger`, `IIncidentRepository`). |
| **ISP** | Mocks mínimos: `{ save: vi.fn() }` en lugar de mockear interfaces gigantes. |
| **LSP** | Los mocks funcionan como sustitutos legítimos de las implementaciones reales. |

### Conclusión

La pirámide de pruebas no es una métrica arbitraria sino un reflejo directo de la arquitectura:

1. **Más unitarias** porque los 5 patrones implementados producen muchas unidades con lógica propia.
2. **Menos integración** porque las interfaces DIP reducen la cantidad de puntos de integración críticos.
3. **Mínimas E2E** porque el contrato entre servicios es estable y validar el flujo feliz una vez es suficiente para garantizar la conectividad.

El costo de violar la pirámide sería una suite lenta, frágil y costosa de mantener.
