/**
 * Lightweight in-process metrics counter (§5.2).
 * Tracks basic operational counters without external dependencies.
 * Exposed via health-check endpoints.
 */
export interface MetricsSnapshot {
  messagesPublished: number;
  publishErrors: number;
  uptime: number;
}

/**
 * Tracks operational counters for the Producer process.
 *
 * Counters:
 * - `messagesPublished` — Messages successfully published to RabbitMQ.
 * - `publishErrors` — Publish attempts that failed (channel down, broker rejection).
 * - `uptime` — Seconds since the Producer process started.
 *
 * Exposed via the `/health` endpoint as a {@link MetricsSnapshot}.
 *
 * @class Metrics
 */
class Metrics {
  private messagesPublished = 0;
  private publishErrors = 0;
  private readonly startTime = Date.now();

  /** Increments the successfully-published counter. */
  incrementPublished(): void {
    this.messagesPublished++;
  }

  /** Increments the publish-error counter. */
  incrementPublishErrors(): void {
    this.publishErrors++;
  }

  /**
   * Returns a snapshot of all current counters plus uptime in seconds.
   * @returns {MetricsSnapshot} Immutable copy of the current metrics.
   */
  getSnapshot(): MetricsSnapshot {
    return {
      messagesPublished: this.messagesPublished,
      publishErrors: this.publishErrors,
      uptime: Math.round((Date.now() - this.startTime) / 1000),
    };
  }
}

/**
 * Module-level singleton metrics instance.
 * Shared across all Producer components.
 */
export const metrics = new Metrics();
