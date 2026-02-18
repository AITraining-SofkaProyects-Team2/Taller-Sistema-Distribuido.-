# Copilot Instructions — ISP Complaint Management System

## Architecture Overview

Event-driven distributed system: **React Frontend → Producer API (Express) → RabbitMQ → Consumer Worker**. All services are TypeScript. Docker Compose orchestrates everything (`docker-compose up -d --build`).

| Service | Port | Runtime | Module system |
|---------|------|---------|---------------|
| Frontend | 80 | Vite + React 19 + Tailwind 4 | ESM (`"type": "module"`) |
| Producer | 3000 | Express + Node 20 | ESM (`.js` extensions in imports) |
| Consumer | 3001 (health) | Plain Node worker | CJS |
| RabbitMQ | 5672 / 15672 | rabbitmq:3-management-alpine | — |

**Data flow:** Frontend POSTs to `/complaints` → Producer validates, builds a `Ticket` (UUID, status `RECEIVED`, priority `PENDING`), publishes to `complaints.exchange` (topic) with routing key `complaint.received` → Consumer reads from `complaints.queue`, applies Strategy Pattern to resolve priority (`HIGH`/`MEDIUM`/`LOW`), sets status `IN_PROGRESS`, persists in-memory.

## Key Design Patterns

### Strategy Pattern — Consumer priority resolution
Each `IPriorityStrategy` declares `supportedTypes` and a `calculate()` method. `PriorityResolver` maps `IncidentType → strategy` at construction. Add new priorities by creating a strategy class in `backend/consumer/src/strategies/` and registering it in the `PriorityResolver` constructor.

```
CriticalServiceStrategy  → NO_SERVICE           → HIGH
DegradedServiceStrategy  → INTERMITTENT_SERVICE, SLOW_CONNECTION → MEDIUM
MinorIssuesStrategy      → ROUTER_ISSUE, BILLING_QUESTION       → LOW
DefaultPriorityStrategy  → fallback (OTHER, unknown)             → PENDING
```

### Facade Pattern — Producer messaging
`MessagingFacade` wraps `IConnectionManager` + `IMessageSerializer` to publish tickets. Dependencies are injected via constructor for testability.

### Chain of Responsibility — Producer error handling
Error middleware pipeline in `backend/producer/src/middlewares/errorHandler.ts`: `validationErrorHandler → jsonSyntaxErrorHandler → messagingErrorHandler → httpErrorHandler → defaultErrorHandler`. All domain errors extend `HttpError` (OCP). Add new error types by extending `HttpError` and adding a handler to the chain.

### Singleton — RabbitMQ connections
Both Producer and Consumer use `RabbitMQConnectionManager.getInstance()`. Consumer includes `resetInstance()` for test isolation.

## Testing

All three packages use **Vitest** with `globals: true`. Run tests from each package directory:

```bash
cd backend/producer && npm test       # unit + integration (supertest)
cd backend/consumer && npm test       # unit tests
cd frontend && npm test               # jsdom + @testing-library/react
```

- **Producer tests** mock the `IMessagingFacade` via `createComplaintsService(mockMessaging)` factory.
- **Consumer tests** inject mock `Channel`, `IIncidentRepository`, and silent `ILogger` into `MessageHandler`.
- **Frontend tests** use `@testing-library/react` with `jsdom`; setup in `frontend/src/test/setup.ts`.
- **E2E** (`backend/e2e/complaint-flow.e2e.test.ts`): requires Docker Compose running; polls Consumer `/health` metrics to verify async processing. Run via `cd backend/producer && npm run test:e2e`.
- Coverage: `npm run test:coverage` in any package (v8 provider).

## Validation

- **Producer middleware** (`validateComplaintRequest.ts`): validates `lineNumber`, `email` (regex), `incidentType` (enum guard via `isIncidentType()`), and requires `description` when type is `OTHER`. Throws `ValidationError` (400).
- **Frontend** uses **Zod v4** schema (`frontend/src/utils/validation.ts`) with `superRefine` for conditional `OTHER` description requirement.
- **Consumer** validates message structure via `isIncidentType()` type guard; invalid messages are nacked to DLQ.

## Incident Types (shared domain constant)

`NO_SERVICE | INTERMITTENT_SERVICE | SLOW_CONNECTION | ROUTER_ISSUE | BILLING_QUESTION | OTHER`

Defined as `enum` in backend (`backend/*/src/types/`) and as `const object + type` in frontend (`frontend/src/types/incident.ts`). Keep all three in sync when adding types.

## Project Conventions

- **Producer imports** use explicit `.js` extensions (ESM): `import { foo } from './bar.js'`.
- **Consumer imports** use extensionless paths (CJS): `import { foo } from './bar'`.
- **Frontend** uses `VITE_API_URL` env var (defaults to `http://localhost:3000`).
- Structured logging via custom `logger` util in each service (implements `ILogger` interface).
- Metrics tracked via `metrics.ts` in Producer and Consumer (`incrementPublished`, `incrementProcessed`, etc.), exposed on `/health` endpoints.
- Graceful shutdown registered in `lifecycle/gracefulShutdown.ts` (both backend services).
- RabbitMQ topology: main exchange `complaints.exchange` (topic) + DLX `complaints.dlx` (fanout) → `complaints.dlq`. Messages that exceed retry or fail validation go to DLQ.

## Quick Commands

```bash
# Full system
docker-compose up -d --build

# Individual dev servers (need local RabbitMQ or Docker rabbitmq running)
cd backend/producer && npm run dev    # tsx watch
cd backend/consumer && npm run dev    # ts-node
cd frontend && npm run dev            # vite

# Build
cd backend/producer && npm run build  # tsc → dist/
cd backend/consumer && npm run build  # tsc → dist/
cd frontend && npm run build          # tsc + vite build
```
