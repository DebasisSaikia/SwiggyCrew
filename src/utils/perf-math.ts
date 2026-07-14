import type { FrameSample } from '@/types/perf';

/** Rolling frame-time ring buffer size (~5s of samples at 60fps). */
export const RING_BUFFER_CAPACITY = 300;

/** frameTime above this is <45 FPS — counts as a dropped frame. */
export const FRAME_DROP_THRESHOLD_MS = 22.2;

/** How often the UI-thread heartbeat pings the JS thread. */
export const HEARTBEAT_INTERVAL_MS = 100;

/** A heartbeat ack later than this past its expected time flags the JS thread as busy. */
export const JS_BUSY_THRESHOLD_MS = 250;

/** PerfOverlay's own re-render cadence — CLAUDE.md non-negotiable rule #5 (~4Hz). */
export const OVERLAY_TICK_MS = 250;

/** Tail slice used for the live FPS number, so it reacts faster than the full 5s buffer. */
const RECENT_FPS_WINDOW = 30;

export interface FrameStats {
  p50FrameTimeMs: number;
  p95FrameTimeMs: number;
  worstFrameTimeMs: number;
  frameDropCount: number;
  jsThreadBusyCount: number;
  currentFps: number;
}

const EMPTY_STATS: FrameStats = {
  p50FrameTimeMs: 0,
  p95FrameTimeMs: 0,
  worstFrameTimeMs: 0,
  frameDropCount: 0,
  jsThreadBusyCount: 0,
  currentFps: 0,
};

/** Nearest-rank percentile over an already-sorted ascending array. */
export function percentile(sortedValues: number[], p: number): number {
  if (sortedValues.length === 0) return 0;
  const index = Math.min(sortedValues.length - 1, Math.max(0, Math.ceil((p / 100) * sortedValues.length) - 1));
  return sortedValues[index];
}

export function computeFrameStats(samples: FrameSample[]): FrameStats {
  if (samples.length === 0) return EMPTY_STATS;

  const frameTimes = samples.map((sample) => sample.frameTimeMs).sort((a, b) => a - b);
  const frameDropCount = samples.reduce((count, sample) => count + (sample.frameTimeMs > FRAME_DROP_THRESHOLD_MS ? 1 : 0), 0);
  const jsThreadBusyCount = samples.reduce((count, sample) => count + (sample.jsThreadBusy ? 1 : 0), 0);

  const recent = samples.slice(-RECENT_FPS_WINDOW);
  const recentAvgFrameTime = recent.reduce((sum, sample) => sum + sample.frameTimeMs, 0) / recent.length;
  const currentFps = recentAvgFrameTime > 0 ? Math.round(1000 / recentAvgFrameTime) : 0;

  return {
    p50FrameTimeMs: percentile(frameTimes, 50),
    p95FrameTimeMs: percentile(frameTimes, 95),
    worstFrameTimeMs: frameTimes[frameTimes.length - 1],
    frameDropCount,
    jsThreadBusyCount,
    currentFps,
  };
}
