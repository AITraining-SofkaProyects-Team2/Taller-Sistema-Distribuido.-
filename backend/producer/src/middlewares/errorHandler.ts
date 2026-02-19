import {
  validationErrorHandler,
  jsonSyntaxErrorHandler,
  messagingErrorHandler,
  httpErrorHandler,
  defaultErrorHandler,
} from './errorHandlers/index.js';

/**
 * Ordered Chain of Responsibility for centralized error handling.
 *
 * **Execution order matters** — specific handlers appear first so they can
 * short-circuit before the generic ones:
 *
 * 1. `validationErrorHandler` — {@link ValidationError} → 400
 * 2. `jsonSyntaxErrorHandler` — Malformed JSON body → 400
 * 3. `messagingErrorHandler` — {@link MessagingError} → 503
 * 4. `httpErrorHandler` — Any other {@link HttpError} subclass → `statusCode`
 * 5. `defaultErrorHandler` — Catch-all → 500 **(terminal, always handles)**
 *
 * Registered in Express via `errorHandlerChain.forEach(h => app.use(h))`.
 *
 * To add a new error handler:
 * 1. Create a new handler in `errorHandlers/`.
 * 2. Insert it **before** `httpErrorHandler` in this array.
 * 3. Update the barrel export in `errorHandlers/index.ts`.
 *
 * @type {Array<import('express').ErrorRequestHandler>}
 */
export const errorHandlerChain = [
  validationErrorHandler,
  jsonSyntaxErrorHandler,
  messagingErrorHandler,
  httpErrorHandler,         // generic fallback for future HttpError subtypes
  defaultErrorHandler,      // terminal handler — always handles
];
