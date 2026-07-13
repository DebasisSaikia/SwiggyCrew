import { Path, Svg } from 'react-native-svg';

interface SparkleIconProps {
  size?: number;
  color?: string;
}

/** Exact sparkle path from the Claude Design spec — used on the FAB and the chat avatar. */
export function SparkleIcon({ size = 24, color = '#FFFFFF' }: SparkleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3L13.6 9.2L19.5 11L13.6 12.8L12 19L10.4 12.8L4.5 11L10.4 9.2L12 3Z" fill={color} />
    </Svg>
  );
}
