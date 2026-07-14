import { View } from 'react-native';

import { SparkleIcon } from '@/components/feed/sparkle-icon';
import { colors } from '@/constants/design-tokens';

/** 24px assistant avatar circle — sits at an assistant bubble's bottom-left. */
export function SparkleAvatar() {
  return (
    <View className="h-6 w-6 items-center justify-center rounded-full bg-accent">
      <SparkleIcon size={12} color={colors.accentForeground} />
    </View>
  );
}
