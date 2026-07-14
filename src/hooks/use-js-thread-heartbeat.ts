import { useCallback, useMemo, useRef } from 'react';
import { useFrameCallback, useSharedValue } from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

import { HEARTBEAT_INTERVAL_MS, JS_BUSY_THRESHOLD_MS } from '@/utils/perf-math';

interface JsThreadHeartbeat {
  /** One-shot: returns whether a stale ack was detected since the last call, and clears it. */
  consumeStaleAckLatch: () => boolean;
}

/**
 * Pings the JS thread from a UI-thread `useFrameCallback` loop (a genuinely
 * separate rAF clock from `FpsMeter`'s main-JS-thread loop — see FpsMeter's
 * doc comment). Used to tell a JS-thread stall apart from a pure UI-thread
 * stall, which `FpsMeter`'s frame time alone cannot distinguish.
 *
 * Deliberately does NOT do a live "is the last ack stale right now?" check.
 * `runOnJS` queues via `queueMicrotask` on the JS thread — if the JS thread
 * was synchronously blocked, every queued ack drains back-to-back the
 * instant it unblocks, *before* the next rAF tick runs. A live staleness
 * check would see an already-fresh timestamp and miss the stall entirely.
 * Instead, each ack self-reports its own lateness (in JS-thread `Date.now()`
 * terms) at the moment it fires, and latches a one-shot flag that
 * `FpsMeter` consumes on its very next tick — attaching it to the exact
 * frame sample that recorded the stall.
 *
 * `onHeartbeat` and the frame worklet are both stabilized via `useCallback`
 * so `useFrameCallback` doesn't unregister/re-register on every PerfOverlay
 * re-render (it re-registers whenever the callback reference changes).
 */
export function useJsThreadHeartbeat(): JsThreadHeartbeat {
  // null = "no ack received yet" — avoids calling the impure Date.now() as
  // a render-time initial ref value, and doubles as the guard that skips
  // the staleness check before the very first real heartbeat arrives.
  const lastHeartbeatAtRef = useRef<number | null>(null);
  const staleAckLatchRef = useRef(false);
  const lastSentUiTimestamp = useSharedValue(0);

  const onHeartbeat = useCallback(() => {
    const now = Date.now();
    const expectedAt = lastHeartbeatAtRef.current === null ? now : lastHeartbeatAtRef.current + HEARTBEAT_INTERVAL_MS;
    if (now - expectedAt > JS_BUSY_THRESHOLD_MS) {
      staleAckLatchRef.current = true;
    }
    lastHeartbeatAtRef.current = now;
  }, []);

  useFrameCallback(
    useCallback(
      (frameInfo) => {
        'worklet';
        if (frameInfo.timestamp - lastSentUiTimestamp.value >= HEARTBEAT_INTERVAL_MS) {
          // Mutating a Reanimated SharedValue's `.value` from a worklet is
          // the idiomatic, unavoidable pattern — conflicts with the React
          // Compiler's immutability lint here the same way Animated.Value
          // access conflicts with react-hooks/refs elsewhere in this repo
          // (see CLAUDE.md). Targeted disable, not a workaround of the logic.
          // eslint-disable-next-line react-hooks/immutability
          lastSentUiTimestamp.value = frameInfo.timestamp;
          runOnJS(onHeartbeat)();
        }
      },
      [lastSentUiTimestamp, onHeartbeat],
    ),
  );

  return useMemo(
    () => ({
      consumeStaleAckLatch: () => {
        const wasStale = staleAckLatchRef.current;
        staleAckLatchRef.current = false;
        return wasStale;
      },
    }),
    [],
  );
}
