import * as amqp from 'amqplib';
import { ChannelModel, Channel } from 'amqplib';
import type { IConnectionManager } from './IConnectionManager';
import { logger } from '../utils/logger';

const RABBITMQ_URL = process.env.RABBITMQ_URL;
if (!RABBITMQ_URL) {
    logger.error('RABBITMQ_URL environment variable is required');
    process.exit(1);
}

/** Name of the main topic exchange for complaint events. */
const EXCHANGE_NAME = 'complaints.exchange';
/** Name of the primary queue bound to the main exchange. */
const QUEUE_NAME = 'complaints.queue';
/** Dead-Letter Exchange (DLX) — receives messages that fail processing. */
const DLX_EXCHANGE = 'complaints.dlx';
/** Dead-Letter Queue (DLQ) — stores unprocessable messages for inspection. */
const DLQ_NAME = 'complaints.dlq';

/**
 * Singleton manager for the Consumer's RabbitMQ connection and channel.
 *
 * Responsible for:
 * 1. Establishing a single AMQP connection and channel.
 * 2. Declaring the DLX/DLQ infrastructure for failed messages.
 * 3. Declaring the main exchange (topic) and queue with DLX binding.
 * 4. Handling connection lifecycle events (close, error).
 *
 * **Internal state transitions:**
 * ```
 * [Disconnected] --connect()--> [Connected] --close()--> [Disconnected]
 *       ^                             |
 *       |--- on('close') event -------|
 * ```
 *
 * Uses the Singleton pattern so all Consumer components share
 * the same underlying AMQP connection.
 *
 * @class RabbitMQConnectionManager
 * @implements {IConnectionManager}
 */
class RabbitMQConnectionManager implements IConnectionManager {
    /** The single instance (Singleton). */
    private static instance: RabbitMQConnectionManager | null = null;
    /** Active AMQP connection, or `null` when disconnected. */
    private connection: ChannelModel | null = null;
    /** Active AMQP channel, or `null` when disconnected. */
    private channel: Channel | null = null;

    /** Private constructor enforces Singleton access via {@link getInstance}. */
    private constructor() { }

    /**
     * Returns the single instance of the connection manager.
     * Creates the instance lazily on first access.
     *
     * @static
     * @returns {RabbitMQConnectionManager} The singleton instance.
     */
    public static getInstance(): RabbitMQConnectionManager {
        if (!RabbitMQConnectionManager.instance) {
            RabbitMQConnectionManager.instance = new RabbitMQConnectionManager();
        }
        return RabbitMQConnectionManager.instance;
    }

    /**
     * Resets the singleton instance for testing purposes.
     * **Should only be used in test suites.**
     *
     * @static
     */
    public static resetInstance(): void {
        RabbitMQConnectionManager.instance = null;
    }

    /**
     * Connects to RabbitMQ and declares the full topology:
     * 1. DLX fanout exchange + DLQ (for failed messages).
     * 2. Main topic exchange.
     * 3. Main durable queue with DLX binding.
     *
     * Idempotent — calling when already connected is a no-op.
     *
     * @returns {Promise<void>} Resolves when the topology is ready.
     * @throws {Error} If the AMQP connection or channel setup fails.
     */
    async connect(): Promise<void> {
        if (this.connection) {
            return;
        }

        logger.info(`Connecting to RabbitMQ at ${RABBITMQ_URL}...`);
        this.connection = await amqp.connect(RABBITMQ_URL!);
        this.channel = await this.connection.createChannel();

        // Dead-Letter Exchange + Queue (§4.4)
        logger.info('Asserting DLX exchange and DLQ...');
        await this.channel.assertExchange(DLX_EXCHANGE, 'fanout', { durable: true });
        await this.channel.assertQueue(DLQ_NAME, { durable: true });
        await this.channel.bindQueue(DLQ_NAME, DLX_EXCHANGE, '');

        // Main exchange
        logger.info('Asserting main exchange...');
        await this.channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

        // Main queue with DLX configuration
        logger.info('Asserting main queue with DLQ binding...');
        const q = await this.channel.assertQueue(QUEUE_NAME, {
            durable: true,
            deadLetterExchange: DLX_EXCHANGE,
            deadLetterRoutingKey: '',
        });
        await this.channel.bindQueue(q.queue, EXCHANGE_NAME, '#');

        logger.info(`Waiting for messages on ${q.queue}. Press CTRL+C to exit`);

        this.setupEventHandlers();
    }

    /**
     * Gracefully closes the AMQP channel and connection.
     * Nullifies internal references in the `finally` block to ensure
     * consistent state even if closing throws.
     *
     * @returns {Promise<void>} Resolves when resources are released.
     */
    async close(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.error('Error closing RabbitMQ connection', { error: errorMessage });
        } finally {
            this.channel = null;
            this.connection = null;
        }
    }

    /** @inheritdoc */
    getChannel(): Channel | null {
        return this.channel;
    }

    /** @inheritdoc */
    isConnected(): boolean {
        return this.connection !== null && this.channel !== null;
    }

    /**
     * Registers event listeners on the AMQP connection for `close` and `error` events.
     *
     * On `close`: nullifies internal references so {@link isConnected} returns `false`
     * and subsequent calls to {@link connect} will re-establish a new connection.
     *
     * On `error`: logs the error for operational visibility; the `close` event
     * that follows will handle state cleanup.
     *
     * @private
     */
    private setupEventHandlers(): void {
        this.connection?.on('close', () => {
            logger.error('RabbitMQ connection closed. Retrying in 5s...');
            this.connection = null;
            this.channel = null;
        });

        this.connection?.on('error', (err) => {
            logger.error('RabbitMQ connection error', { error: err.message });
        });
    }
}

export { RabbitMQConnectionManager };
