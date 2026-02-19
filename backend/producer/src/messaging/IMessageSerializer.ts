import type { Ticket } from '../types/ticket.types.js';

/**
 * Serializer abstraction for converting domain objects into broker-ready buffers (DIP).
 *
 * Decouples the {@link MessagingFacade} from the concrete serialization format
 * (JSON, Protobuf, etc.) allowing easy substitution or versioning.
 *
 * @interface IMessageSerializer
 * @see {@link TicketMessageSerializer} — Default JSON implementation.
 */
export interface IMessageSerializer {
    /**
     * Serializes a {@link Ticket} into a {@link Buffer} suitable for publishing
     * to the message broker.
     *
     * The output format must match the contract expected by the Consumer's
     * {@link MessageHandler} (currently `TicketEventPayload` as JSON).
     *
     * @param {Ticket} ticket - The ticket to serialize.
     * @returns {Buffer} The serialized message payload.
     */
    serializeTicketCreated(ticket: Ticket): Buffer;
}
