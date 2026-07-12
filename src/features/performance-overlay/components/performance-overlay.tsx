import { memo, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { useFrameStats } from '../hooks/use-frame-stats';
import { useJsThreadHeartbeat } from '../hooks/use-js-thread-heartbeat';
import { PerformanceOverlayFab } from './performance-overlay-fab';

type PerformanceOverlayProps = {
  bottomOffset: number;
  topOffset: number;
};

function statusColorFor(fps: number, theme: ReturnType<typeof useTheme>): string {
  if (fps >= 55) return theme.statusGood;
  if (fps >= 45) return theme.statusWarning;
  return theme.statusDanger;
}

function PerformanceOverlayComponent({ bottomOffset, topOffset }: PerformanceOverlayProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const toggleVisible = useCallback(() => setVisible((value) => !value), []);

  const stats = useFrameStats(visible);
  const isJsThreadBusy = useJsThreadHeartbeat(visible);

  return (
    <>
      {visible && (
        <View
          style={[
            styles.panel,
            { top: topOffset, backgroundColor: theme.overlayBackground, pointerEvents: 'none' },
          ]}>
          <View style={styles.fpsRow}>
            <View style={[styles.dot, { backgroundColor: statusColorFor(stats.fps, theme) }]} />
            <ThemedText type="title" style={[styles.fpsText, { color: theme.overlayText }]}>
              {stats.fps.toFixed(0)}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.overlayText }}>
              {' '}
              FPS
            </ThemedText>
          </View>

          <View style={styles.row}>
            <ThemedText type="small" style={{ color: theme.overlayText }}>
              Drops (&lt;45fps)
            </ThemedText>
            <ThemedText type="smallBold" style={{ color: theme.overlayText }}>
              {stats.frameDropCount}
            </ThemedText>
          </View>

          <View style={styles.row}>
            <ThemedText type="small" style={{ color: theme.overlayText }}>
              JS thread
            </ThemedText>
            <View style={styles.jsStatus}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: isJsThreadBusy ? theme.statusDanger : theme.statusGood },
                ]}
              />
              <ThemedText type="smallBold" style={{ color: theme.overlayText }}>
                {isJsThreadBusy ? 'Busy' : 'Idle'}
              </ThemedText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <ThemedText type="small" style={{ color: theme.overlayText }}>
              p50 / p95
            </ThemedText>
            <ThemedText type="smallBold" style={{ color: theme.overlayText }}>
              {stats.p50Ms.toFixed(1)} / {stats.p95Ms.toFixed(1)} ms
            </ThemedText>
          </View>
          <View style={styles.row}>
            <ThemedText type="small" style={{ color: theme.overlayText }}>
              Worst frame
            </ThemedText>
            <ThemedText type="smallBold" style={{ color: theme.overlayText }}>
              {stats.worstFrameMs.toFixed(1)} ms
            </ThemedText>
          </View>
        </View>
      )}

      <PerformanceOverlayFab bottomOffset={bottomOffset} active={visible} onToggle={toggleVisible} />
    </>
  );
}

export const PerformanceOverlay = memo(PerformanceOverlayComponent);

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    left: Spacing.four,
    right: Spacing.four,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  fpsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.one,
  },
  fpsText: {
    fontSize: 28,
    lineHeight: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  jsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Spacing.one,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: Spacing.one,
  },
});
