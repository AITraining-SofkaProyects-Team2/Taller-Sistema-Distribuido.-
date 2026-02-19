import type { Channel } from 'amqplib';

/**
 * Abstraction for the message broker connection lifecycle (DIP / Adapter Pattern).
 *
 * Decouples the Producer from the concrete broker implementation (RabbitMQ)
 * so the connection logic can be tested or swapped without modifying services.
 *
 * @interface IConnectionManager
 * @see {@link RabbitMQConnectionManager} — Concrete Singleton implementation.
 */
export interface IConnectionManager {
    /**
     * Establishes a connection to the message broker and prepares
     * the required exchanges.
     *
     * @returns {Promise<void>} Resolves when the connection is ready.
     * @throws {Error} If the connection cannot be established.
     */
    connect(): Promise<void>;

    /**
     * Gracefully closes the channel and connection.
     * Safe to call multiple times.
     *
     * @returns {Promise<void>} Resolves when resources are released.
     */
    close(): Promise<void>;

    /**
     * Returns the active AMQP channel, or `null` if disconnected.
     *
     * @returns {Channel | null} The current channel instance.
     */
    getChannel(): Channel | null;

    /**
     * Checks whether the manager holds an active connection and channel.
     *
     * @returns {boolean} `true` if both connection and channel are alive.
     */
    isConnected(): boolean;
}
