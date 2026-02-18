import type { Ticket } from '../types/ticket.types.js';
import type { IConnectionManager } from './IConnectionManager.js';
import type { IMessageSerializer } from './IMessageSerializer.js';
import type { IMessagingFacade } from './IMessagingFacade.js';
import type { ILogger } from '../utils/ILogger.js';
import { MessagingError } from '../errors/messaging.error.js';
import { logger as defaultLogger } from '../utils/logger.js';
import { metrics } from '../utils/metrics.js';

/**
 * Concrete Facade for publishing ticket events to RabbitMQ (Facade Pattern).
 *
 * Encapsulates:
 * - Channel availability check (via {@link IConnectionManager}).
 * - Payload serialization (via {@link IMessageSerializer}).
 * - Exchange and routing key configuration.
 * - Persistent publish with `correlationId` tracing.
 * - Metrics tracking for published messages and errors.
 *
 * **Error handling**: Throws {@link MessagingError} (HTTP 503) when the
 * channel is unavailable or the broker does not confirm the message.
 * The calling service should let the error propagate to the centralized
 * error handler chain.
 *
 * @class MessagingFacade
 * @implements {IMessagingFacade}
 */
export class MessagingFacade implements IMessagingFacade {
    /**
     * Creates a new MessagingFacade.
     *
     * @param {IConnectionManager} connectionManager - Provides the AMQP channel.
     * @param {IMessageSerializer} serializer - Converts tickets to broker payloads.
     * @param {{ exchange: string; routingKey: string }} config - Exchange and routing key to publish to.
     * @param {ILogger} [logger=defaultLogger] - Logger instance (injectable for testing).
     */
    constructor(
        private readonly connectionManager: IConnectionManager,
        private readonly serializer: IMessageSerializer,
        private readonly config: { exchange: string; routingKey: string },
        private readonly logger: ILogger = defaultLogger
    ) { }

    /**
     * Publishes a `ticket.created` event to the configured exchange.
     *
     * Steps:
     * 1. Retrieves the active AMQP channel from the connection manager.
     * 2. Serializes the ticket into a Buffer via the serializer.
     * 3. Publishes the message with `persistent: true` and `correlationId`.
     * 4. Increments the appropriate metrics counter.
     *
     * @param {Ticket} ticket - The ticket to publish.
     * @returns {Promise<void>} Resolves on successful publish.
     * @throws {MessagingError} If channel is null or broker rejects the message.
     */
    async publishTicketCreated(ticket: Ticket): Promise<void> {
        const channel = this.connectionManager.getChannel();

        if (!channel) {
            metrics.incrementPublishErrors();
            throw new MessagingError(
                'Canal de mensajería no disponible',
                ticket.ticketId
            );
        }

        const message = this.serializer.serializeTicketCreated(ticket);

        const published = channel.publish(
            this.config.exchange,
            this.config.routingKey,
            message,
            { persistent: true, contentType: 'application/json', correlationId: ticket.ticketId }
        );

        if (!published) {
            metrics.incrementPublishErrors();
            throw new MessagingError(
                'Mensaje no confirmado por el broker',
                ticket.ticketId
            );
        }

        metrics.incrementPublished();
        this.logger.info('Ticket event published', { ticketId: ticket.ticketId });
    }
}
