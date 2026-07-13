import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SparkleIcon } from '@/components/feed/sparkle-icon';
import { colors, elevation } from '@/constants/design-tokens';

interface FabProps {
  onPress: () => void;
}

/** Ask Crew launcher — 24px above the home indicator, 16px from the right edge. */
export function Fab({ onPress }: FabProps) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={onPress}
      className="absolute right-4 h-14 w-14 items-center justify-center rounded-fab bg-accent"
      style={{ bottom: insets.bottom + 24, ...fabShadow }}
    >
      <SparkleIcon size={24} color={colors.accentForeground} />
    </Pressable>
  );
}

const fabShadow = {
  shadowColor: elevation.fab.color,
  shadowOpacity: elevation.fab.opacity,
  shadowOffset: elevation.fab.offset,
  shadowRadius: elevation.fab.radius,
  elevation: 6,
};
