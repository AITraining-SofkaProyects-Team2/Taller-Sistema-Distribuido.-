# 🏛️ Justificación Arquitectónica: Implementación de Patrón CQRS y Servicio de Consulta (Query Service)

## Contexto Actual
El sistema actual opera bajo una arquitectura orientada a eventos donde el flujo de escritura y procesamiento es eficiente:
`Frontend` → `Producer` → `RabbitMQ` → `Consumer (In-Memory)`

El nuevo requerimiento de negocio solicita un **Dashboard de Gestión** para consultar, filtrar y visualizar los tickets procesados.

## 🚩 El Problema
Implementar las consultas de lectura compleja (Dashboard) sobre la arquitectura actual presenta los siguientes conflictos:

1.  **Acoplamiento de Responsabilidades:** Si el `Consumer` (encargado de procesar lógica de negocio y guardar estado) también debe responder consultas HTTP complejas del Dashboard, violamos el principio de **Responsabilidad Única (SRP)**.
2.  **Cuello de Botella:** Node.js es *single-threaded*. Si el `Consumer` está ocupado filtrando un array de 10,000 objetos para el Dashboard, el procesamiento de nuevos mensajes de RabbitMQ se detendrá, aumentando la latencia del sistema.
3.  **Persistencia Volátil:** Actualmente, el estado vive en la memoria RAM del `Consumer`. Cualquier reinicio o falla del servicio elimina todo el historial, haciendo inviable un Dashboard histórico.

## ✅ La Solución Propuesta

Evolucionar la arquitectura integrando el patrón **CQRS (Command Query Responsibility Segregation)** mediante la adición de un microservicio de lectura y una base de datos persistente.

### Nuevo Componente: Query Service
Se implementará un nuevo microservicio (`backend/query-service`) dedicado exclusivamente a servir datos al Frontend (Dashboard).

### Nuevo Componente: Base de Datos Compartida (MongoDB)
Se reemplazará el almacenamiento en memoria por **MongoDB**. Este motor es ideal porque:
*   Maneja documentos JSON nativamente (perfecto para la estructura del `Ticket`).
*   Permite lecturas rápidas y flexibles sin esquemas rígidos (Schemaless).

---

## 📐 Nueva Arquitectura (Flujo de Datos)

```mermaid
graph LR
    UserReport((Usuario)) -->|POST| Producer
    DashboardUser((Operador)) -->|GET| QueryService
    
    subgraph "Command Side (Escritura)"
    Producer -->|Evento| RabbitMQ
    RabbitMQ -->|Procesa| Consumer
    Consumer -->|WRITE| DB[(MongoDB)]
    end
    
    subgraph "Query Side (Lectura)"
    QueryService -->|READ| DB
    end