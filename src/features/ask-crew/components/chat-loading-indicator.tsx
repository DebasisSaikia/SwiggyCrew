import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function Dot({ delayMs, color }: { delayMs: number; color: string }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delayMs,
      withRepeat(withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }), -1, true)
    );
  }, [delayMs, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.dot, { backgroundColor: color }, style]} />;
}

export const ChatLoadingIndicator = memo(function ChatLoadingIndicator() {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Dot delayMs={0} color={theme.textSecondary} />
      <Dot delayMs={120} color={theme.textSecondary} />
      <Dot delayMs={240} color={theme.textSecondary} />
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.half,
    paddingVertical: Spacing.one,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
