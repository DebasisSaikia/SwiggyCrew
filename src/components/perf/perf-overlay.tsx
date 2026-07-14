import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/design-tokens';
import { useJsThreadHeartbeat } from '@/hooks/use-js-thread-heartbeat';
import { FpsMeter } from '@/utils/fps-meter';
import { computeFrameStats, OVERLAY_TICK_MS, type FrameStats } from '@/utils/perf-math';

// Debug-only, deliberate JS-thread freeze to manually verify the JS-busy
// indicator. Defined inside `if (__DEV__)` (not just gated at the call
// site) so this synchronous freeze function can't ship un-tree-shaken in a
// release bundle.
let blockJsThreadForMs: ((ms: number) => void) | undefined;
if (__DEV__) {
  blockJsThreadForMs = (ms: number) => {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      // deliberately synchronous — simulates a JS-thread stall
    }
  };
}

/**
 * Real Performance Overlay — replaces the throwaway DevFpsCounter from
 * Phase 1. Sampling (FpsMeter's rAF loop + the UI-thread heartbeat) runs
 * every frame; this component's own re-render is throttled to ~4Hz via the
 * single `setInterval` below (CLAUDE.md non-negotiable rule #5). No
 * feedStore/chatStore reads — fully self-contained, zero re-render coupling
 * with the feed or chat sheet.
 */
export function PerfOverlay() {
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);
  const [stats, setStats] = useState<FrameStats>(() => computeFrameStats([]));

  const { consumeStaleAckLatch } = useJsThreadHeartbeat();

  const meterRef = useRef<FpsMeter | null>(null);
  if (meterRef.current === null) {
    meterRef.current = new FpsMeter(consumeStaleAckLatch);
  }

  useEffect(() => {
    const meter = meterRef.current!;
    meter.start();
    return () => meter.stop();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setStats(computeFrameStats(meterRef.current!.getSamples()));
    }, OVERLAY_TICK_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <Pressable
      onPress={() => setExpanded((value) => !value)}
      onLongPress={__DEV__ ? () => blockJsThreadForMs?.(500) : undefined}
      className="absolute left-4 rounded-badge px-2 py-1"
      style={{ top: insets.top + 64, backgroundColor: colors.devOverlayBg }}
      pointerEvents="box-only"
    >
      <Text className="text-crew-micro text-surface">{stats.currentFps} FPS</Text>
      {expanded ? (
        <View className="mt-1 gap-0.5">
          <Text className="text-crew-micro text-surface">p50 {stats.p50FrameTimeMs.toFixed(1)}ms</Text>
          <Text className="text-crew-micro text-surface">p95 {stats.p95FrameTimeMs.toFixed(1)}ms</Text>
          <Text className="text-crew-micro text-surface">worst {stats.worstFrameTimeMs.toFixed(1)}ms</Text>
          <Text className="text-crew-micro text-surface">drops {stats.frameDropCount}</Text>
          <Text
            className="text-crew-micro"
            style={{ color: stats.jsThreadBusyCount > 0 ? colors.accent : colors.surface }}
          >
            JS busy {stats.jsThreadBusyCount}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}
