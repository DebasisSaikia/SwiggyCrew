import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const PLACEHOLDER_COUNT = 3;

/** Lightweight placeholder shapes shown while mockFeedApi resolves — no spinner. */
export function FeedSkeleton() {
  return (
    <View className="gap-4 px-4 pt-3">
      {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </View>
  );
}

function SkeletonCard() {
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View className="w-full overflow-hidden rounded-card bg-surface" style={animatedStyle}>
      <View className="h-[180px] w-full bg-surface-muted" />
      <View className="gap-2 px-4 py-[14px]">
        <View className="h-[17px] w-2/3 rounded bg-surface-muted" />
        <View className="h-[15px] w-1/2 rounded bg-surface-muted" />
      </View>
    </Animated.View>
  );
}
