import amqp, { ChannelModel, Channel } from 'amqplib';
import { rabbitmqConfig } from '../config/index.js';
import { logger } from '../utils/logger.js';
import type { IConnectionManager } from './IConnectionManager.js';

/**
 * Clase Singleton que gestiona la conexión y el canal para RabbitMQ.
 * Implementa IConnectionManager para proporcionar una interfaz consistente para las operaciones del broker de mensajería.
 * 
 * @class RabbitMQConnectionManager
 * @implements {IConnectionManager}
 */
class RabbitMQConnectionManager implements IConnectionManager {

    private static instance: RabbitMQConnectionManager | null = null;
    private connection: ChannelModel | null = null;
    private channel: Channel | null = null;

    // Private constructor prevents external instantiation
    private constructor() { }

    /**
     * Retorna la instancia única (singleton) de RabbitMQConnectionManager.
     * 
     * @static
     * @returns {RabbitMQConnectionManager} La instancia activa del gestor de conexiones.
     */
    public static getInstance(): RabbitMQConnectionManager {

        if (!RabbitMQConnectionManager.instance) {
            RabbitMQConnectionManager.instance = new RabbitMQConnectionManager();
        }
        return RabbitMQConnectionManager.instance;
    }

    // For testing: allows resetting the instance
    public static resetInstance(): void {
        RabbitMQConnectionManager.instance = null;
    }

    /**
     * Establece una conexión con el broker de RabbitMQ y crea un canal.
     * También declara el exchange definido en la configuración.
     * 
     * @async
     * @returns {Promise<void>} Se resuelve cuando la conexión se establece con éxito.
     * @throws {Error} Si la conexión falla.
     */
    async connect(retries = 5, delay = 2000): Promise<void> {
    if (this.connection) return;

    for (let i = 0; i < retries; i++) {
        try {
            logger.info('Connecting to RabbitMQ...', { url: rabbitmqConfig.url });

            this.connection = await amqp.connect(rabbitmqConfig.url);
            this.channel = await this.connection.createChannel();

            await this.channel.assertExchange(rabbitmqConfig.exchange, 'topic', {
                durable: true,
            });

            logger.info('Connected to RabbitMQ successfully', {
                exchange: rabbitmqConfig.exchange,
            });

            this.setupEventHandlers();
            return; // ← éxito, salimos

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.error(`Failed to connect to RabbitMQ (attempt ${i + 1}/${retries})`, { error: errorMessage });

            if (i < retries - 1) {
                logger.info(`Retrying in ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay));
                delay *= 2; // backoff exponencial
            } else {
                throw error; // agotamos los reintentos, ahora sí lanzamos el error
            }
        }
    }
}
    /**
     * Cierra el canal y la conexión activa de RabbitMQ de forma segura.
     * 
     * @async
     * @returns {Promise<void>} Se resuelve cuando la conexión se cierra.
     */
    async close(): Promise<void> {

        try {
            if (this.channel) {
                await this.channel.close();
                logger.debug('RabbitMQ channel closed');
            }
            if (this.connection) {
                await this.connection.close();
                logger.info('RabbitMQ connection closed gracefully');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.error('Error closing RabbitMQ connection', { error: errorMessage });
        } finally {
            this.channel = null;
            this.connection = null;
        }
    }

    getChannel(): Channel | null {
        return this.channel;
    }

    isConnected(): boolean {
        return this.connection !== null && this.channel !== null;
    }

    /**
     * Configura los manejadores de eventos para la conexión amqp para gestionar errores y cierres.
     * 
     * @private
     */
    private setupEventHandlers(): void {

        this.connection?.on('close', () => {
            logger.warn('RabbitMQ connection closed');
            this.connection = null;
            this.channel = null;
        });

        this.connection?.on('error', (err) => {
            logger.error('RabbitMQ connection error', { error: err.message });
        });
    }
}

export { RabbitMQConnectionManager };
