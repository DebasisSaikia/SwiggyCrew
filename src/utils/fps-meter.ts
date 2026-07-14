import { RING_BUFFER_CAPACITY } from '@/utils/perf-math';
import type { FrameSample } from '@/types/perf';

/**
 * Main-JS-thread rAF sampler with a circular ring buffer (index-overwrite,
 * not push/shift, to avoid O(n) cost per frame). Independent of the
 * UI-thread heartbeat in `use-js-thread-heartbeat.ts` — see that file for
 * why the two must stay separate clocks.
 */
export class FpsMeter {
  private buffer: FrameSample[] = [];
  private cursor = 0;
  private filled = false;
  private rafId: number | null = null;
  private lastTimestamp = 0;
  private consumeStaleAckLatch: () => boolean;

  constructor(consumeStaleAckLatch: () => boolean) {
    this.consumeStaleAckLatch = consumeStaleAckLatch;
  }

  start() {
    this.lastTimestamp = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop() {
    if (this.rafId != null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  /** Returns samples in chronological (oldest-to-newest) order. */
  getSamples(): FrameSample[] {
    if (!this.filled) return this.buffer.slice(0, this.cursor);
    return [...this.buffer.slice(this.cursor), ...this.buffer.slice(0, this.cursor)];
  }

  private tick = (now: number) => {
    const frameTimeMs = now - this.lastTimestamp;
    this.lastTimestamp = now;

    this.buffer[this.cursor] = { timestamp: now, frameTimeMs, jsThreadBusy: this.consumeStaleAckLatch() };
    this.cursor = (this.cursor + 1) % RING_BUFFER_CAPACITY;
    if (this.cursor === 0) this.filled = true;

    this.rafId = requestAnimationFrame(this.tick);
  };
}
