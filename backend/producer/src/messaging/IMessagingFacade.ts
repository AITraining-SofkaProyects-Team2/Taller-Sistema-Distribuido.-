import type { Ticket } from '../types/ticket.types.js';

/**
 * Facade interface for message publishing operations (Facade Pattern + DIP).
 *
 * Provides a high-level API that hides the broker connection, serialization,
 * and exchange/routing details from the service layer.
 *
 * @interface IMessagingFacade
 * @see {@link MessagingFacade} — Concrete implementation.
 */
export interface IMessagingFacade {
    /**
     * Publishes a `ticket.created` event to the message broker.
     *
     * The implementation is responsible for:
     * 1. Checking channel availability.
     * 2. Serializing the ticket into the broker payload format.
     * 3. Publishing with persistence options and `correlationId`.
     *
     * @param {Ticket} ticket - The newly created ticket to publish.
     * @returns {Promise<void>} Resolves on successful publication.
     * @throws {MessagingError} If the channel is unavailable or the broker rejects the message.
     */
    publishTicketCreated(ticket: Ticket): Promise<void>;
}
