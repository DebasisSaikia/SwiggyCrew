import { useEffect, useRef, useState } from 'react';

// Expected tick cadence. A healthy JS thread fires this interval within a few ms of on time.
const TICK_INTERVAL_MS = 16;
// A tick arriving this many times later than expected means something blocked the JS thread
// between ticks (a synchronous render, a tight loop, etc.) — useFrameCallback alone can't see
// this, since UI-thread-driven animations keep reporting healthy FPS even while JS is stalled.
const BUSY_THRESHOLD_MULTIPLIER = 2.5;
// Keep the indicator visible briefly after a stall so a short, real block isn't missed on screen.
const BUSY_INDICATOR_HOLD_MS = 400;

export function useJsThreadHeartbeat(enabled: boolean): boolean {
  const [isBusy, setIsBusy] = useState(false);
  const isBusyRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      isBusyRef.current = false;
      setIsBusy(false);
      return;
    }

    let lastTick = Date.now();
    let busyUntil = 0;

    const interval = setInterval(() => {
      const now = Date.now();
      const actualGap = now - lastTick;
      lastTick = now;

      if (actualGap > TICK_INTERVAL_MS * BUSY_THRESHOLD_MULTIPLIER) {
        busyUntil = now + BUSY_INDICATOR_HOLD_MS;
      }

      // Only touch React state on an actual transition — a healthy thread should
      // cost ~zero re-renders here, not 60/sec of "still fine" updates.
      const nextIsBusy = now < busyUntil;
      if (nextIsBusy !== isBusyRef.current) {
        isBusyRef.current = nextIsBusy;
        setIsBusy(nextIsBusy);
      }
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [enabled]);

  return isBusy;
}
