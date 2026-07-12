import { useEffect, useState } from 'react';
import { useFrameCallback, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { createRingBufferState, ringBufferPush, ringBufferSnapshot } from '../lib/ring-buffer';
import { computeFrameTimeSummary } from '../lib/stats-math';
import { PerformanceSnapshot } from '../types';

// ~60s of samples at 60fps. Bounds the periodic snapshot-and-sort cost;
// see PERFORMANCE.md for why this is a deliberate rolling-window trade-off.
const RING_BUFFER_CAPACITY = 3600;
const DROPPED_FRAME_THRESHOLD_MS = 1000 / 45;
const FLUSH_INTERVAL_MS = 500;

const INITIAL_SNAPSHOT: PerformanceSnapshot = {
  fps: 0,
  frameDropCount: 0,
  worstFrameMs: 0,
  p50Ms: 0,
  p95Ms: 0,
};

type FlushPayload = {
  framesSinceFlush: number;
  elapsedMs: number;
  dropCount: number;
  worstFrameMs: number;
  samples: number[];
};

/**
 * Samples native frame timestamps on the UI thread via `useFrameCallback`, which
 * keeps reporting accurately even when the JS thread is blocked (UI-thread-driven
 * animations don't need JS to tick under the New Architecture). Aggregation
 * happens on the UI thread too; only a throttled (~2Hz) snapshot crosses over to
 * JS/React state via `scheduleOnRN`, so the overlay's own React re-render cost is
 * negligible relative to the 60Hz frame rate it's measuring.
 */
export function useFrameStats(enabled: boolean): PerformanceSnapshot {
  const [snapshot, setSnapshot] = useState<PerformanceSnapshot>(INITIAL_SNAPSHOT);

  const ringBuffer = useSharedValue(createRingBufferState(RING_BUFFER_CAPACITY));
  const dropCount = useSharedValue(0);
  const worstFrameMs = useSharedValue(0);
  const framesSinceFlush = useSharedValue(0);
  const lastFlushTimestamp = useSharedValue(0);

  const applyFlush = (payload: FlushPayload) => {
    const { p50, p95 } = computeFrameTimeSummary(payload.samples);
    const fps = payload.elapsedMs > 0 ? (payload.framesSinceFlush / payload.elapsedMs) * 1000 : 0;
    setSnapshot({
      fps,
      frameDropCount: payload.dropCount,
      worstFrameMs: payload.worstFrameMs,
      p50Ms: p50,
      p95Ms: p95,
    });
  };

  const frameCallback = useFrameCallback((frameInfo) => {
    'worklet';
    const duration = frameInfo.timeSincePreviousFrame;
    if (duration == null) return;

    ringBufferPush(ringBuffer.value, RING_BUFFER_CAPACITY, duration);
    framesSinceFlush.value += 1;

    if (duration > DROPPED_FRAME_THRESHOLD_MS) {
      dropCount.value += 1;
    }
    if (duration > worstFrameMs.value) {
      worstFrameMs.value = duration;
    }

    if (lastFlushTimestamp.value === 0) {
      lastFlushTimestamp.value = frameInfo.timestamp;
      return;
    }

    const elapsedMs = frameInfo.timestamp - lastFlushTimestamp.value;
    if (elapsedMs >= FLUSH_INTERVAL_MS) {
      const samples = ringBufferSnapshot(ringBuffer.value);
      scheduleOnRN(applyFlush, {
        framesSinceFlush: framesSinceFlush.value,
        elapsedMs,
        dropCount: dropCount.value,
        worstFrameMs: worstFrameMs.value,
        samples,
      });
      framesSinceFlush.value = 0;
      lastFlushTimestamp.value = frameInfo.timestamp;
    }
  }, false);

  useEffect(() => {
    frameCallback.setActive(enabled);
    if (!enabled) {
      setSnapshot(INITIAL_SNAPSHOT);
    }
  }, [enabled, frameCallback]);

  return snapshot;
}
