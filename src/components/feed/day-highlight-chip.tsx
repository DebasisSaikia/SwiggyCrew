import { Text, View } from 'react-native';

import type { DayHighlight } from '@/types/trip';

interface DayHighlightChipProps {
  highlight: DayHighlight;
}

export function DayHighlightChip({ highlight }: DayHighlightChipProps) {
  return (
    <View className="w-[132px] shrink-0 gap-1 rounded-chip bg-surface-muted p-[10px]">
      <Text className="text-crew-micro text-text-tertiary">Day {highlight.dayNumber}</Text>
      <Text className="text-crew-caption text-text-primary" numberOfLines={3}>
        {highlight.title}
      </Text>
    </View>
  );
}
