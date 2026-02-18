import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';
import { RabbitMQConnectionManager } from '../messaging/RabbitMQConnectionManager.js';
import { TicketMessageSerializer } from '../messaging/TicketMessageSerializer.js';
import { MessagingFacade } from '../messaging/MessagingFacade.js';
import { rabbitmqConfig } from '../config/index.js';
import type { IMessagingFacade } from '../messaging/IMessagingFacade.js';
import {
  Ticket,
  CreateTicketRequest,
  IncidentType,
} from '../types/ticket.types.js';

/**
 * Builds a {@link Ticket} from a validated request, assigning default
 * lifecycle values (status = RECEIVED, priority = PENDING).
 *
 * @param {CreateTicketRequest} request - The validated complaint request.
 * @returns {Ticket} A new ticket ready for publishing.
 */
const buildTicket = (request: CreateTicketRequest): Ticket => ({
  ticketId: uuidv4(),
  lineNumber: request.lineNumber,
  email: request.email,
  incidentType: request.incidentType,
  description: request.description || null,
  status: 'RECEIVED',
  priority: 'PENDING',
  createdAt: new Date(),
});

/**
 * Default Facade instance wired with the Singleton connection manager
 * and the JSON serializer.
 * @type {IMessagingFacade}
 */
const defaultMessaging: IMessagingFacade = new MessagingFacade(
  RabbitMQConnectionManager.getInstance(),
  new TicketMessageSerializer(),
  { exchange: rabbitmqConfig.exchange, routingKey: rabbitmqConfig.routingKey }
);

/**
 * Factory function that creates a complaints service with injectable
 * messaging dependency (Strategy / DIP for testability).
 *
 * @param {IMessagingFacade} [messaging=defaultMessaging] - The messaging facade to use.
 * @returns {{ createTicket: (request: CreateTicketRequest) => Promise<Ticket> }} The service object.
 *
 * @example
 * ```typescript
 * // In tests:
 * const mockFacade: IMessagingFacade = { publishTicketCreated: vi.fn() };
 * const service = createComplaintsService(mockFacade);
 * ```
 */
export const createComplaintsService = (
  messaging: IMessagingFacade = defaultMessaging
) => ({
  /**
   * Creates a new complaint ticket and publishes a `ticket.created` event.
   *
   * Flow:
   * 1. Builds a {@link Ticket} from the validated request.
   * 2. Publishes the ticket event via the {@link IMessagingFacade}.
   * 3. Returns the created ticket to the controller.
   *
   * Validation is handled upstream by the `validateComplaintRequest` middleware (SRP).
   * Persistence is handled downstream by the Consumer (§2.2).
   *
   * @param {CreateTicketRequest} request - The validated complaint creation request.
   * @returns {Promise<Ticket>} The newly created ticket.
   * @throws {MessagingError} If the broker is unavailable or rejects the message.
   */
  createTicket: async (request: CreateTicketRequest): Promise<Ticket> => {
    const ticket = buildTicket(request);

    logger.info('Ticket created', {
      ticketId: ticket.ticketId,
      incidentType: ticket.incidentType,
    });

    // Publish event — persistence is handled by the Consumer (§2.2)
    // Facade throws MessagingError if it fails
    await messaging.publishTicketCreated(ticket);

    return ticket;
  },
});

/** Default service instance for production use. */
export const complaintsService = createComplaintsService();
