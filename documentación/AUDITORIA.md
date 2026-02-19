# AUDITORIA.md

**Sistema Distribuido de Gestión de Quejas --- Auditoría Arquitectónica Post-MVP**

**Fecha:** 11 de febrero de 2026
**Alcance:** Frontend + Producer + Consumer + RabbitMQ + Docker

---

## 1. INTRODUCCIÓN

Este documento consolida los hallazgos técnicos del análisis post-MVP considerando explícitamente que el sistema implementa:

- Arquitectura de Microservicios
- Comunicación Event-Driven mediante RabbitMQ
- Consistencia Eventual
- Separación clara entre Producer y Consumer

---

## 2. SNAPSHOT DEL ESTADO ACTUAL

### 2.1 Arquitectura General

Frontend (React + TS + Vite)
↓
Producer (Express + TS)
↓
RabbitMQ (Exchange + Queue)
↓
Consumer (Node Worker + TS)

**Persistencia:** In-memory (actual)
**Orquestación:** Docker Compose

### 2.2 Decisiones Arquitectónicas Clave

- Persistencia delegada exclusivamente al Consumer.
- Producer actúa únicamente como generador de eventos.
- Arquitectura basada en consistencia eventual.
- Microservicios con dominio duplicado por diseño (sin código compartido).
- Contrato implícito entre servicios (no formalmente versionado).

---

## 3. PRINCIPIOS SOLID

### 3.1 SRP --- Single Responsibility Principle

**Producer --- complaints.service.ts**

- **Responsabilidades actuales:**
  - Construcción del Ticket
  - Publicación del evento
  - Logging
  - Manejo de errores

- **Decisión del equipo:**
  - Mantener el servicio enfocado en construcción del Ticket.
  - Extraer publisher como módulo independiente.
  - Delegar validaciones a middleware.
  - Remover endpoints no utilizados ('/:ticketId').

**Severidad:** MEDIA

**Producer --- app.ts**

- **Responsabilidades mezcladas:**
  - Configuración CORS
  - Middlewares
  - Rutas
  - Health check
  - Conexión a RabbitMQ
  - Graceful shutdown

- **Decisión del equipo:**
  - Crear módulo de configuración.
  - Crear BrokerConnection desacoplado.
  - Separar graceful shutdown.
  - Implementar errorHandler global.
  - Separar un “connection manager” (conectar, mantener canal, cerrar) de un “publisher” que reciba el canal o la conexión y solo publique; opcionalmente un “message serializer” para el payload.

**Severidad:** MEDIA

**Consumer --- index.ts**

- **Responsabilidades concentradas:**
  - Conexión a broker
  - Consumo
  - Parsing
  - Validación
  - Priorización
  - Persistencia
  - Ack/Nack
  - Reconexión
  - Logging

- **Decisión del equipo:**
  - index.ts funcionará únicamente como orquestador.
  - Separar connection manager.
  - Separar message handler.
  - Separar estrategia de prioridad.
  - Separar repositorio.
  - Reemplazar console.log por logger estructurado.

**Severidad:** CRÍTICA

**Frontend --- IncidentForm.tsx**

- **Responsabilidades:**
  - Estado
  - Validación
  - API call
  - Manejo de errores
  - Modal
  - Render

- **Decisión del equipo:**
  - Extraer hooks personalizados para validación y API.
  - Separar componente Modal a su propia carpeta de componente, y hacerlo reutilizable.
  - Mantener componente de formulario desacoplado de lógica.

**Severidad:** MEDIA

### 3.2 OCP --- Open/Closed Principle

**determinePriority (Consumer)**

- Uso de switch por IncidentType.

- **Decisión del equipo:**
  - Implementar Strategy Pattern para cálculo de prioridad.
  - Introducir interfaz PriorityStrategy.

**Severidad:** ALTA

**errorHandler (Producer)**

- Cadena de if (instanceof X).

- **Decisión del equipo:**
  - Introducir HttpError base con statusCode.
  - Permitir extensión sin modificar middleware central.

**Severidad:** ALTA

### 3.3 DIP --- Dependency Inversion Principle

- **Problemas detectados:**
  - Dependencia directa a amqplib.
  - Logger importado directamente.
  - fetch usado directamente.
  - Sin interfaces para repositorio.

- **Decisión del equipo:**
  - Introducir interfaces MessageBroker, complaintsRepository y LoggerPort.
  - Aplicar inversión de dependencias progresivamente.

**Severidad:** ALTA

### 3.4 ISP --- Interface Segregation Principle

- **Hallazgos:**
  - Controladores acoplados a Request/Response completos.
  - Configuración expuesta globalmente.
  - Métodos de repositorio no utilizados.

- **Decisión del equipo:**
  - Extraer solo datos necesarios del request.
  - Implementar configuración por módulo.
  - Eliminar métodos huérfanos.

**Severidad:** MEDIA

### 3.5 LSP --- Liskov Substitution Principle

- **Hallazgos:**
  - Uso de castings inseguros.
  - Posibles inconsistencias estructurales en tipos.

- **Decisión del equipo:**
  - Reducir uso de 'as' inseguros.
  - Validar estructuras antes de asignación.
  - Implementar contratos claros mediante interfaces.

**Severidad:** MEDIA

---

## 4. CODE SMELLS

### 4.1 Duplicación de Dominio

Duplicación de tipos entre microservicios.

- **Decisión del equipo:**
  - Mantener duplicación como decisión arquitectónica propia de microservicios.
  - Garantizar coherencia mediante contrato estándar.
  - Crear DTO específicos para API y eventos.

**Severidad:** ACEPTADA COMO TRADE-OFF

### 4.2 Estado Mutable Global

Variables module-level para conexión y canal.

- **Decisión del equipo:**
  - Encapsular estado dentro de connection manager.
  - Evitar dependencias temporales implícitas.

**Severidad:** MEDIA

### 4.3 Logging Inconsistente

Producer usa logger estructurado, Consumer usa console.log.

- **Decisión del equipo:**
  - Unificar formato de logging.
  - Implementar correlation-id entre servicios.

**Severidad:** MEDIA

### 4.4 Falta de DLQ

No existe dead-letter queue.

- **Decisión del equipo:**
  - Implementar DLQ para mensajes fallidos.
  - Incorporar estrategia de retry/backoff.

**Severidad:** ALTA

### 4.5 Pérdida Silenciosa de Eventos

publishTicketEvent retorna false sin lanzar error.

- **Decisión del equipo:**
  - Manejar explícitamente errores de publicación.
  - Garantizar consistencia entre creación y publicación.

**Severidad:** CRÍTICA

---

## 5. RIESGOS ARQUITECTÓNICOS DISTRIBUIDOS

### 5.1 Consistencia Eventual

Persistencia y publicación no son atómicas.

- **Decisión del equipo:**
  - Mantener consistencia eventual como modelo.
  - Evaluar implementación futura de Outbox Pattern.

### 5.2 Observabilidad

Sin métricas, tracing ni correlation-id.

- **Decisión del equipo:**
  - Incorporar métricas básicas.
  - Agregar health-check en consumer.
  - Evaluar OpenTelemetry en etapas posteriores.

---

## 6. IDENTIFICACIÓN DE ACIERTOS TÉCNICOS

Este documento resalta los fragmentos de código y decisiones de diseño implementadas en la versión preliminar (MVP) que se alinean con los principios de Clean Code. Estos elementos demuestran una base sólida sobre la cual se construyó la refactorización.

### 6.1 Implementación del Patrón Repository
Se identificó como un acierto clave la implementación del **Patrón Repository** para la abstracción del acceso a datos, permitiendo desacoplar la lógica de negocio de la persistencia (in-memory en el MVP) y facilitando la transición a una base de datos real en el futuro sin impacto en el dominio.

### 6.2 Nombres Significativos (Meaningful Names)

#### ✅ Definición de Tipos y Enums
El uso de `Enums` para los tipos de incidentes elimina el uso de "Magic Strings" dispersos por el código. Los nombres de las interfaces son descriptivos y revelan su intención.

- **Archivo:** `ticket.types.ts`
- **Justificación:** `IncidentType` agrupa todas las variantes posibles bajo un mismo contrato, y `CreateTicketRequest` define claramente qué se espera al crear un ticket.

#### ✅ Constantes Explicativas
En lugar de tener regex o listas de strings "mágicos" dentro de las funciones, se extrajeron a constantes con nombres claros.

- **Archivo:** `complaints.service.ts`
- **Justificación:** `VALID_INCIDENT_TYPES` y `EMAIL_REGEX` explican qué son esos valores, mejorando la legibilidad instantánea de la validación.

### 6.3 Funciones (Functions)

#### ✅ Funciones Puras y Pequeñas
En el Consumer, la lógica para determinar la prioridad se aisló en una función pura que hace una sola cosa.

- **Archivo:** `processor.ts`
- **Justificación:** `determinePriority` cumple con el principio de responsabilidad única (SRP) a nivel de función. Es fácil de probar (testear) porque no tiene efectos secundarios y su salida depende solo de su entrada.

#### ✅ Validación Extraída
Aunque la validación estaba dentro del archivo de servicio (algo que se mejoró luego), al menos se extrajo a una función privada `validateCreateRequest` en lugar de ensuciar el método principal `createTicket`.

- **Archivo:** `complaints.service.ts`

### 6.4 Separación de Responsabilidades (MVC)

#### ✅ Controladores "Delgados" (Thin Controllers)
El controlador actúa puramente como un adaptador HTTP. No contiene lógica de negocio, reglas de validación complejas ni acceso a base de datos. Solo orquesta la petición y la respuesta.

- **Archivo:** `complaints.controller.ts`
- **Justificación:** Delega todo el trabajo pesado a `complaintsService`. Esto facilita el testing unitario del controlador y del servicio por separado.

### 6.5 Encapsulamiento y Abstracción

#### ✅ Wrapper de Logging
Se creó una abstracción `logger` en lugar de usar `console.log` directamente en todo el sistema.

- **Archivo:** `logger.ts`
- **Justificación:** Permite cambiar la implementación del logging (ej: enviar a un archivo o servicio externo) en un solo lugar sin tocar el resto del código. Además, estandariza el formato de salida con timestamps.

### 6.6 Manejo de Errores

#### ✅ Errores Semánticos
Uso de clases de error personalizadas (`ValidationError`) en lugar de lanzar errores genéricos o devolver strings.

- **Archivo:** `complaints.service.ts`
- **Justificación:** Permite que capas superiores (como el middleware de error) distingan qué tipo de error ocurrió y decidan qué código HTTP devolver (400 Bad Request vs 500 Internal Error) de forma limpia.

---

## 7. CONCLUSIÓN

El sistema cumple con el MVP funcional bajo arquitectura de microservicios.

**Las prioridades inmediatas del equipo serán:**
- Reducir riesgos críticos en mensajería.
- Modularizar consumer.
- Implementar DLQ.
- Mejorar observabilidad.

El resto de mejoras se abordará de forma incremental respetando la arquitectura distribuida adoptada.