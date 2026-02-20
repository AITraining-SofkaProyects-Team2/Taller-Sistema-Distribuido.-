import { Channel, ConsumeMessage } from 'amqplib';
import { IncidentType, Incident } from '../types';
import { isIncidentType } from '../utils/typeGuards';
import { determinePriority, determineStatus } from '../processor';
import { logger as defaultLogger } from '../utils/logger';
import type { ILogger } from '../utils/ILogger';
import type { IIncidentRepository } from '../repositories/IIncidentRepository';
import { metrics } from '../utils/metrics';

/**
 * Processes messages consumed from the RabbitMQ complaints queue.
 *
 * Responsibilities:
 * 1. Deserializes and validates the incoming message payload.
 * 2. Delegates priority calculation to {@link determinePriority}.
 * 3. Determines lifecycle status via {@link determineStatus}.
 * 4. Persists the processed incident in the {@link IIncidentRepository}.
 * 5. Acknowledges or rejects (nack) the message based on outcome.
 *
 * **Error handling strategy:**
 * - Invalid structure (missing/unknown `type`) → nack without requeue (→ DLQ).
 * - Missing `description` for `OTHER` type → nack without requeue (→ DLQ).
 * - Processing error (JSON parse, runtime) → requeue with retry up to
 *   {@link MAX_RETRIES}, then send to DLQ.
 *
 * **Retry mechanism:**
 * Uses the `x-death` header (populated by RabbitMQ on DLX cycles) or a
 * custom `x-retry-count` header to track retry attempts.
 *
 * @class MessageHandler
 */
export class MessageHandler {
    /**
     * Maximum number of retry attempts before a message is sent to the DLQ.
     * @static
     * @readonly
     */
    private static readonly MAX_RETRIES = 3;

    /**
     * Creates a new MessageHandler.
     *
     * @param {Channel} channel - The AMQP channel used for ack/nack operations.
     * @param {IIncidentRepository} repository - Repository for persisting processed incidents.
     * @param {ILogger} [logger=defaultLogger] - Logger instance (injectable for testing).
     */
    constructor(
        private readonly channel: Channel,
        private readonly repository: IIncidentRepository,
        private readonly logger: ILogger = defaultLogger
    ) { }

    /**
     * Extract retry count from x-death header (set by RabbitMQ on DLX cycles).
     * Falls back to custom x-retry-count header for requeue-based retries.
     */
    private getRetryCount(msg: ConsumeMessage): number {
        const xDeath = msg.properties.headers?.['x-death'] as Array<{ count: number }> | undefined;
        if (xDeath && xDeath.length > 0) {
            return xDeath.reduce((sum, entry) => sum + (entry.count || 0), 0);
        }
        return (msg.properties.headers?.['x-retry-count'] as number) ?? 0;
    }

    /**
     * Main entry point: processes a single message from the queue.
     *
     * Flow:
     * 1. Parse JSON payload from `msg.content`.
     * 2. Validate `type` field against known {@link IncidentType} values.
     * 3. Enforce `description` requirement for `OTHER` type.
     * 4. Calculate priority and status.
     * 5. Build an {@link Incident} and persist it.
     * 6. Acknowledge the message on success.
     *
     * On parse/runtime error, the message is requeued up to {@link MAX_RETRIES}
     * times before being rejected to the DLQ.
     *
     * @param {ConsumeMessage | null} msg - The consumed message, or `null` if the consumer was cancelled.
     * @returns {Promise<void>}
     */
    async handle(msg: ConsumeMessage | null): Promise<void> {
        if (msg === null) {
            return;
        }

        const correlationId = msg.properties.correlationId ?? 'unknown';

        try {
            const content = JSON.parse(msg.content.toString());
            this.logger.info('Message received', { ticketId: content.ticketId, correlationId });

            if (!content.type || !isIncidentType(content.type)) {
                this.logger.warn('Invalid message structure: missing or invalid incident type', {
                    ticketId: content.ticketId,
                    correlationId,
                });
                // Send to DLQ — unparseable/invalid structure
                metrics.incrementRejected();
                this.channel.nack(msg, false, false);
                return;
            }

            const incidentType: IncidentType = content.type;

            if (incidentType === IncidentType.OTHER && !content.description) {
                this.logger.warn('Invalid message: description required for OTHER type', {
                    ticketId: content.ticketId,
                    correlationId,
                });
                metrics.incrementRejected();
                this.channel.nack(msg, false, false);
                return;
            }

            const priority = determinePriority(incidentType);
            const status = determineStatus(priority);

            const processedIncident: Incident = {
                ticketId: String(content.ticketId),
                lineNumber: String(content.lineNumber),
                email: String(content.email || 'N/A'),
                type: incidentType,
                description: content.description,
                priority,
                status,
                createdAt: String(content.createdAt),
                processedAt: new Date(),
            };

            // Persist in Consumer repository (§2.2 decision)
            await this.repository.save(processedIncident);

            this.logger.info('Incident processed and persisted', {
                ticketId: processedIncident.ticketId,
                priority: processedIncident.priority,
                status: processedIncident.status,
                correlationId,
            });

            metrics.incrementProcessed();
            this.channel.ack(msg);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const retryCount = this.getRetryCount(msg);

            if (retryCount < MessageHandler.MAX_RETRIES) {
                this.logger.warn('Processing error, requeueing with backoff', {
                    error: errorMessage,
                    correlationId,
                    retryCount: retryCount + 1,
                    maxRetries: MessageHandler.MAX_RETRIES,
                });
                // Requeue with incremented retry header
                metrics.incrementRetried();
                this.channel.nack(msg, false, true);
            } else {
                this.logger.error('Max retries exceeded, sending to DLQ', {
                    error: errorMessage,
                    correlationId,
                    retryCount,
                });
                // Send to DLQ — exhausted retries
                metrics.incrementRejected();
                this.channel.nack(msg, false, false);
            }
        }
    }
}
