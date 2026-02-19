# Registro de Deuda Técnica

Este documento rastrea la deuda técnica del proyecto, clasificándola según el [Cuadrante de Deuda Técnica de Martin Fowler](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html) y registrando su estado (Activa/Pagada).

---

## 1. Deuda Técnica Activa

Compromisos asumidos conscientemente o descubiertos que aún requieren resolución.

| Categoría (Cuadrante) | Elemento de Deuda Técnica | Descripción / Justificación | Estado |
| :--- | :--- | :--- | :--- |
| **Prudente / Deliberada** | **Duplicación de Dominio** | Se decidió mantener tipos duplicados entre microservicios para evitar el acoplamiento por código compartido (Shared Code). | **ACTIVA** |
| **Prudente / Deliberada** | **Persistencia In-Memory** | Decisión de diseño para el MVP, priorizando la lógica de mensajería sobre la base de datos física. | **ACTIVA** |

---

## 2. Historial de Deuda Técnica Pagada

Deuda técnica que ha sido identificada y refactorizada utilizando patrones de diseño y principios SOLID.

| Categoría original | Elemento de Deuda Técnica | Descripción del Problema original | Patrón de Pago (Solución) | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **Imprudente / Inadvertida** | **Pérdida Silenciosa de Eventos** | La publicación fallaba silenciosamente (`return false`), ocultando errores críticos y dificultando el diagnóstico. Violación de "Fail Fast". | **Facade** + **Exceptions**<br>(`MessagingFacade` lanza `MessagingError`) | **PAGADA** |
| **Prudente / Inadvertida** | **Lógica de Prioridad Rígida** | Cálculo de prioridad mediante un `switch` gigante. Violaba **OCP** (Open/Closed); añadir un tipo requería modificar lógica existente. | **Strategy Pattern**<br>(`PriorityResolver` + estrategias por tipo) | **PAGADA** |
| **Prudente / Inadvertida** | **Estado Mutable en Conexión** | Variables globales para la conexión RabbitMQ. Dificultaba el testing aislado y la gestión de reconexiones. | **Singleton Pattern**<br>(`RabbitMQConnectionManager`) | **PAGADA** |
| **Prudente / Inadvertida** | **Acoplamiento a Librería** | Dependencia directa de `amqplib` en la capa de servicios. Violaba **DIP** (Dependency Inversion), haciendo imposible cambiar de broker o mockear fácilmente. | **Adapter** + **Interfaces**<br>(`IMessagingFacade`, `IConnectionManager`) | **PAGADA** |
