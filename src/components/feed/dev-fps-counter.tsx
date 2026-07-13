import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DISPLAY_UPDATE_MS = 500;

/**
 * DISPOSABLE — throwaway scroll-perf sanity check for Phase 1 only.
 * Replaced by the real PerfOverlay (rolling buffer, p50/p95, JS-thread-busy
 * indicator) in Phase 3. Delete this file once that lands.
 */
export function DevFpsCounter() {
  const insets = useSafeAreaInsets();
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastDisplayUpdate = performance.now();
    let raf: number;

    const tick = (now: number) => {
      frameCount += 1;
      const elapsed = now - lastDisplayUpdate;
      if (elapsed >= DISPLAY_UPDATE_MS) {
        setFps(Math.round((frameCount * 1000) / elapsed));
        frameCount = 0;
        lastDisplayUpdate = now;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <View
      className="absolute left-4 rounded-badge bg-[rgba(27,25,22,0.7)] px-2 py-1"
      style={{ top: insets.top + 64 }}
      pointerEvents="none"
    >
      <Text className="text-crew-micro text-surface">{fps} FPS (dev)</Text>
    </View>
  );
}
