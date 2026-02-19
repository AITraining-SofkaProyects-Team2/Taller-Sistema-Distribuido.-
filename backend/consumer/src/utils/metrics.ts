/**
 * Lightweight in-process metrics counter (§5.2).
 * Tracks basic operational counters without external dependencies.
 * Exposed via health-check endpoint.
 */
export interface MetricsSnapshot {
  messagesProcessed: number;
  messagesRejected: number;
  messagesRetried: number;
  uptime: number;
}

/**
 * Tracks operational counters for the Consumer process.
 *
 * Counters:
 * - `messagesProcessed` — Successfully processed and ack'd messages.
 * - `messagesRejected` — Messages sent to the DLQ (invalid or max retries exceeded).
 * - `messagesRetried` — Messages requeued for another processing attempt.
 * - `uptime` — Seconds since the Consumer process started.
 *
 * Exposed via the health-check HTTP endpoint as a {@link MetricsSnapshot}.
 *
 * @class Metrics
 */
class Metrics {
  private messagesProcessed = 0;
  private messagesRejected = 0;
  private messagesRetried = 0;
  private readonly startTime = Date.now();

  /** Increments the successfully-processed counter. */
  incrementProcessed(): void {
    this.messagesProcessed++;
  }

  /** Increments the rejected (sent to DLQ) counter. */
  incrementRejected(): void {
    this.messagesRejected++;
  }

  /** Increments the retried (requeued) counter. */
  incrementRetried(): void {
    this.messagesRetried++;
  }

  /**
   * Returns a snapshot of all current counters plus uptime in seconds.
   * @returns {MetricsSnapshot} Immutable copy of the current metrics.
   */
  getSnapshot(): MetricsSnapshot {
    return {
      messagesProcessed: this.messagesProcessed,
      messagesRejected: this.messagesRejected,
      messagesRetried: this.messagesRetried,
      uptime: Math.round((Date.now() - this.startTime) / 1000),
    };
  }
}

/**
 * Module-level singleton metrics instance.
 * Shared across all Consumer components.
 */
export const metrics = new Metrics();
