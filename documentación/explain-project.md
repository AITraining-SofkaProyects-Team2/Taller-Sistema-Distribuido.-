Basado en los archivos de instrucciones que has proporcionado, este es el análisis completo del proyecto **Sistema de Gestión de Quejas de ISP**.

Visión General
Es un sistema distribuido orientado a eventos diseñado para manejar grandes volúmenes de quejas de usuarios (Internet, facturación, etc.) de manera asíncrona. En lugar de procesar todo en una sola petición, el sistema desacopla la recepción de la queja de su **procesamiento**.

Arquitectura (Event-Driven)
El sistema se compone de tres servicios principales orquestados con Docker Compose:

1. Frontend (React 19 + Vite + Tailwind):
    - Es la interfaz de usuario.
    - Envía las quejas vía HTTP POST al Producer.
    - Utiliza Zod para validar datos antes de enviarlos.
    - Producer (API Express + Node 20):

2. Actúa como la "puerta de entrada".
    - Recibe la petición HTTP, ejecuta validaciones estrictas y crea un objeto Ticket.
    - No procesa la queja: Su trabajo termina al publicar el mensaje en RabbitMQ (Exchange: complaints.exchange).
    - Responde al usuario rápidamente con un "Recibido".
    - Detalle técnico: Usa ESM (Importante: requiere extensiones .js en los imports).

3. Consumer (Worker Node.js):
    - Es un proceso en segundo plano (no tiene servidor HTTP tradicional para usuarios, solo métricas).
    - Escucha la cola complaints.queue.
    - Calcula la Prioridad del ticket basándose en el tipo de incidente.
    - Guarda el resultado (actualmente en memoria).
    - Detalle técnico: Usa CommonJS (CJS).


Flujo de Datos ("La vida de una queja")
1. **Usuario** reporta "Internet Intermitente" en el Frontend.
2. **Producer** recibe el JSON, valida email/tipo, y lo convierte en un evento Ticket.
3. **RabbitMQ** encola el mensaje.
4. **Consumer** toma el mensaje.
5. **Lógica de Negocio (Consumer)**: Usa el patrón Strategy para determinar que "Internet Intermitente" = Prioridad MEDIUM.
6. **Persistencia**: El ticket se guarda con estado IN_PROGRESS.

Patrones de Diseño Clave
El proyecto es estricto en el uso de patrones de diseño clásicos para mantener el código limpio:

- **Strategy (en Consumer):** Para evitar if/else gigantes al decidir la prioridad. Cada nivel de prioridad (Critical, Degraded, Minor) es una clase separada.
**Facade (en Producer):** Oculta la complejidad de conectarse y serializar mensajes para RabbitMQ.
**Chain of Responsibility (en Producer):** Maneja errores (validación, sintaxis, infra) pasando el error por una cadena de middlewares.
**Singleton:** Para asegurar una única conexión a RabbitMQ por servicio.


Reglas de Negocio Destacadas
Tipos de Incidentes: Están estrictamente definidos (ej: NO_SERVICE, BILLING_QUESTION).
Regla "OTHER": Si el tipo es OTHER, la descripción es obligatoria.
Prioridades:
NO_SERVICE -> HIGH
INTERMITTENT_SERVICE -> MEDIUM
BILLING -> LOW
Testing (Vitest)
El proyecto tiene una estrategia de pruebas robusta:

Mocks explícitos para RabbitMQ (no se necesita RabbitMQ real para correr tests unitarios).
Test E2E que levanta Docker y verifica que lo que entra por el API termina procesado en el Worker consultando métricas de salud.
Este diseño permite que el sistema sea altamente escalable: si llegan millones de quejas, la cola las amortigua y puedes levantar más instancias del Consumer para procesarlas sin tumbar la API de recepción.