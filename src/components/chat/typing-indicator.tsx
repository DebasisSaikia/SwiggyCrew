import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

function Dot({ delayMs }: { delayMs: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delayMs,
      withRepeat(withSequence(withTiming(1, { duration: 300 }), withTiming(0.3, { duration: 300 })), -1, true),
    );
  }, [delayMs, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View className="h-[6px] w-[6px] rounded-full bg-text-tertiary" style={animatedStyle} />;
}

/** Three-dot typing indicator shown before the first streamed token arrives. */
export function TypingIndicator() {
  return (
    <View className="flex-row items-center gap-1">
      <Dot delayMs={0} />
      <Dot delayMs={150} />
      <Dot delayMs={300} />
    </View>
  );
}
