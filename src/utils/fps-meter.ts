import { RING_BUFFER_CAPACITY } from '@/utils/perf-math';
import type { FrameSample } from '@/types/perf';

/** Hard cap so a forgotten stopRecording() can't grow unbounded for the rest of a dev session. */
const MAX_RECORDING_SAMPLES = 10_000;

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
  private recording: FrameSample[] | null = null;

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

  /**
   * Full-session capture, separate from the ~300-sample/~5s ring buffer
   * that feeds the live HUD — for a scripted 60s run (~3600 samples), the
   * ring buffer alone would only ever retain the last ~5s. Same running
   * instance, same tick(), both destinations written from one sample.
   */
  startRecording() {
    this.recording = [];
  }

  stopRecording(): FrameSample[] {
    const recorded = this.recording ?? [];
    this.recording = null;
    return recorded;
  }

  private tick = (now: number) => {
    const frameTimeMs = now - this.lastTimestamp;
    this.lastTimestamp = now;

    const sample: FrameSample = { timestamp: now, frameTimeMs, jsThreadBusy: this.consumeStaleAckLatch() };

    this.buffer[this.cursor] = sample;
    this.cursor = (this.cursor + 1) % RING_BUFFER_CAPACITY;
    if (this.cursor === 0) this.filled = true;

    if (this.recording !== null && this.recording.length < MAX_RECORDING_SAMPLES) {
      this.recording.push(sample);
    }

    this.rafId = requestAnimationFrame(this.tick);
  };
}
