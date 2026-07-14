import type { FlashListRef } from '@shopify/flash-list';
import { useState, type RefObject } from 'react';
import { Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/design-tokens';
import { runPerfScript } from '@/utils/perf-test-harness';
import type { TripBundle } from '@/types/trip';

interface PerfTestTriggerProps {
  listRef: RefObject<FlashListRef<TripBundle> | null>;
  data: TripBundle[];
}

/**
 * Debug-only trigger for the scripted 60s perf test (see perf-test-harness.ts).
 * Only rendered when __DEV__ — kept separate from PerfOverlay's own
 * long-press (already used for the JS-block test).
 */
export function PerfTestTrigger({ listRef, data }: PerfTestTriggerProps) {
  const insets = useSafeAreaInsets();
  const [running, setRunning] = useState(false);

  if (!__DEV__) return null;

  const handlePress = async () => {
    if (running) return;
    setRunning(true);
    const perfRun = await runPerfScript(listRef, data);
    // Captured from the Metro terminal / adb logcat, see PERFORMANCE.md
    console.log('PERF_RUN_RESULT', JSON.stringify(perfRun));
    setRunning(false);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={running}
      className="absolute right-4 rounded-badge px-2 py-1"
      style={{ bottom: insets.bottom + 88, backgroundColor: colors.devOverlayBg }}
    >
      <Text className="text-crew-micro text-surface">{running ? 'Running…' : 'Run Perf Test'}</Text>
    </Pressable>
  );
}
