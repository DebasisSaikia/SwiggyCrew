import { SymbolView } from 'expo-symbols';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { HIGHLIGHT_KIND_ICON } from '../constants';
import { DayHighlight } from '../types';

type DayHighlightChipProps = { highlight: DayHighlight };

export const DayHighlightChip = memo(function DayHighlightChip({
  highlight,
}: DayHighlightChipProps) {
  const theme = useTheme();

  return (
    <View style={[styles.chip, { backgroundColor: theme.backgroundElement }]}>
      <View style={styles.header}>
        <SymbolView
          name={HIGHLIGHT_KIND_ICON[highlight.kind]}
          size={16}
          tintColor={theme.primary}
        />
        <ThemedText type="small" themeColor="textSecondary">
          Day {highlight.day}
        </ThemedText>
      </View>
      <ThemedText type="smallBold" numberOfLines={2}>
        {highlight.title}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" numberOfLines={3}>
        {highlight.description}
      </ThemedText>
    </View>
  );
});

const styles = StyleSheet.create({
  chip: {
    width: 160,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
});
