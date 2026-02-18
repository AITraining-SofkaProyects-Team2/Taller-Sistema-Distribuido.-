# Reporte de Traspaso (Handover Report) - Sistema de Gestión de Quejas ISP

## 1. Resumen del Sistema
Este sistema es una solución distribuida diseñada para gestionar reclamos de clientes de un ISP de manera eficiente y escalable. Utiliza una arquitectura orientada a eventos para desacoplar la recepción de datos del procesamiento pesado.

## 2. Arquitectura y Componentes
El sistema está compuesto por tres servicios principales orquestados con Docker:

### 2.1 Producer (API REST)
- **Tecnología**: Node.js, Express, TypeScript.
- **Función**: Actúa como la puerta de entrada. Valida la integridad de las solicitudes de quejas y las publica en una cola de RabbitMQ.
- **Patrones Clave**:
  - **Facade (`MessagingFacade`)**: Centraliza la lógica de publicación de mensajes.
  - **Singleton (`RabbitMQConnectionManager`)**: Gestiona la conexión única al broker.
  - **Chain of Responsibility (`errorHandler`)**: Maneja de forma modular los errores de validación, mensajería y sintaxis.

### 2.2 Message Broker (RabbitMQ)
- **Función**: Actúa como buffer y garantizador de entrega. Asegura que ningún mensaje se pierda ante picos de carga o caídas temporales del procesador.

### 2.3 Consumer (Worker)
- **Tecnología**: Node.js, TypeScript.
- **Función**: Procesa los mensajes de la cola. Asigna una prioridad y un estado inicial a cada queja basándose en reglas de negocio predefinidas.
- **Patrones Clave**:
  - **Strategy (`PriorityResolver`)**: Permite extender o modificar las reglas de priorización sin alterar la lógica de procesamiento principal. Las estrategias están divididas por tipos de servicio (Crítico, Degradado, Menor).

## 3. Flujo del Sistema (System Flow)
El sistema sigue un camino lineal desde la entrada del usuario hasta el procesamiento final:

1.  **Frontend (UI)**: El usuario completa el formulario de queja.
2.  **Producer (API)**:
    - Recibe el `POST /complaints`.
    - Valida los campos (ej. `email` válido, `description` condicional).
    - Genera un `ticketId`.
    - Envía el mensaje serializado a RabbitMQ.
    - Responde al cliente con `201 Created`.
3.  **RabbitMQ (Broker)**: Recibe el mensaje en el exchange de tópicos y lo enruta a la cola configurada.
4.  **Consumer (Worker)**:
    - Escucha la cola y consume el mensaje.
    - Utiliza el `PriorityResolver` para asignar prioridad según el tipo.
    - Actualiza el estado a `IN_PROGRESS`.
    - (Futuro) Persiste el resultado o activa notificaciones.

## 4. Estado de la Implementación y Calidad

- **Cobertura de Pruebas**: Se mantiene un objetivo de cobertura del **100%** en el backend. Las pruebas unitarias validan cada estrategia y manejador de errores de forma aislada.
- **Validaciones Críticas**: Se ha corregido y documentado la validación condicional del campo `description`, el cual solo es obligatorio cuando el tipo de incidente es `OTHER`.
- **Patrones SOLID**: El sistema está construido siguiendo estrictamente los principios SOLID para facilitar su extensión (ej. agregar nuevas bases de datos o sistemas de notificación).

## 4. Guía de Mantenimiento
- **Agregar un nuevo tipo de incidente**:
  1. Actualizar los tipos en `types.ts`.
  2. Implementar una nueva clase que extienda `IPriorityStrategy` si es necesario, o añadir el tipo a una existentes.
  3. Registrar la estrategia en el `PriorityResolver`.
- **Cambiar el Broker**: Implementar una nueva clase que herede de `IConnectionManager` y actualizar la inyección en el Facade.
