# Instrucciones de Copilot - Taller Sistema Distribuido (Gestión de Quejas ISP)

Eres un desarrollador experto en IA que asiste en el desarrollo de un sistema de gestión de quejas distribuido para un ISP. Sigue estas guías estrictamente para asegurar la consistencia con la arquitectura y los estándares de calidad del proyecto.

## Descripción General y Arquitectura
- **Propósito**: Gestionar reclamos de clientes de un ISP utilizando una arquitectura distribuida orientada a eventos.
- **Componentes**:
  - **Frontend**: React + Vite + TypeScript.
  - **Producer (API)**: Express + TypeScript. Valida y publica tickets en RabbitMQ.
  - **Message Broker**: RabbitMQ para comunicación asíncrona.
  - **Consumer (Worker)**: Node.js + TypeScript. Procesa tickets y asigna prioridades.

## Stack Tecnológico y Patrones
- **Lenguaje**: TypeScript (Modo estricto).
- **Pruebas**: Vitest (Unitarias, Integración, E2E).
- **Principios Core**: SOLID, Clean Code.
- **Patrones de Diseño**: 
  - **Strategy**: Para la resolución de prioridades y determinación de estados.
  - **Chain of Responsibility**: Para el manejo centralizado de errores.
  - **Facade**: Para simplificar las interacciones con el broker de mensajería.
  - **Singleton**: Para los gestores de conexión (ej. RabbitMQ).
  - **Adapter**: Para abstracciones de infraestructura.

## Reglas de Negocio y Lógica
- **Ciclo de Vida de la Queja**: Recibida -> Validada -> Encolada -> Priorizada -> En Progreso.
- **Lógica de Prioridad**:
  - `NO_SERVICE` -> **ALTA**
  - `INTERMITTENT_SERVICE` -> **MEDIA**
  - `SLOW_CONNECTION`, `ROUTER_ISSUE` -> **MEDIA**
  - `BILLING_QUESTION`, `OTHER` -> **BAJA**
- **Reglas de Validación**:
  - `lineNumber`, `email` e `incidentType` son obligatorios.
  - `description` es **REQUERIDO SOLO** si `incidentType` es `OTHER`. Para todos los demás tipos, es opcional.
  - Los mensajes con `description: null` deben procesarse normalmente si el tipo NO es `OTHER`.

## Estándares de Calidad
- **Cobertura**: Apuntar al **100% de cobertura** en los servicios del backend (Producer y Consumer).
- **Manejo de Errores**: Usar el `errorHandler` centralizado (Chain of Responsibility). Evitar bloques try-catch en controladores; delegar a servicios o middleware.
- **Flujo de Trabajo AI-First**:
  - Auditar el código en busca de violaciones de SOLID antes de sugerir completions.
  - Asegurar que toda nueva lógica incluya sus correspondientes pruebas unitarias.
  - Seguir el **Protocolo de Auditoría Pre-Commit**: Verificar SOLID, patrones y ejecutar pruebas.

## Estilo de Código
- Usar programación funcional donde sea posible, pero mantener patrones basados en clases para Servicios/Repositorios cuando sea apropiado para DIP (Inversión de Dependencias).
- Interfaces sobre implementaciones (DIP).
- Nombres descriptivos (ej. `PriorityResolverStrategy` en lugar de `PrioRes`).
- Mantener controladores "delgados"; la lógica de negocio pertenece a los Servicios o a la Lógica de Dominio.

