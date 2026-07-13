import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { ChevronIcon } from '@/components/feed/chevron-icon';
import { DayHighlightChip } from '@/components/feed/day-highlight-chip';
import { colors } from '@/constants/design-tokens';
import type { DayHighlight } from '@/types/trip';

interface TripCardDetailsProps {
  expanded: boolean;
  onToggle: () => void;
  highlights: DayHighlight[];
}

/**
 * Toggle row is always mounted; the highlights row is only mounted while
 * expanded — a real unmount, not display:none, per the lazy-mount rule.
 */
export function TripCardDetails({ expanded, onToggle, highlights }: TripCardDetailsProps) {
  return (
    <View className="gap-2">
      <Pressable className="flex-row items-center justify-between py-0.5" onPress={onToggle}>
        <Text className="text-crew-body-strong text-primary">{expanded ? 'Hide details' : 'Details'}</Text>
        <ChevronIcon expanded={expanded} color={colors.primary} />
      </Pressable>

      {expanded && (
        <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(150)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-4 mt-1"
            contentContainerStyle={{ gap: 10, paddingHorizontal: 16 }}
          >
            {highlights.map((highlight) => (
              <DayHighlightChip key={highlight.id} highlight={highlight} />
            ))}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}
