import { memo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Spacing } from '@/constants/theme';

import { DayHighlight } from '../types';
import { DayHighlightChip } from './day-highlight-chip';

type TripCardDetailsProps = { highlights: DayHighlight[] };

export const TripCardDetails = memo(function TripCardDetails({
  highlights,
}: TripCardDetailsProps) {
  return (
    <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {highlights.map((highlight) => (
          <DayHighlightChip key={highlight.day} highlight={highlight} />
        ))}
      </ScrollView>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  scrollContent: {
    gap: Spacing.two,
    paddingTop: Spacing.three,
  },
});
