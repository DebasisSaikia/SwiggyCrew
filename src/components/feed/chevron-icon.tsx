import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Path, Svg } from 'react-native-svg';

interface ChevronIconProps {
  expanded: boolean;
  color: string;
}

/** Exact chevron path from the Claude Design spec — flips 0deg/180deg on expand. */
export function ChevronIcon({ expanded, color }: ChevronIconProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(expanded ? '180deg' : '0deg', { duration: 200 }) }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Svg width={14} height={9} viewBox="0 0 14 9" fill="none">
        <Path d="M1 1L7 7L13 1" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Animated.View>
  );
}
