import { SymbolView } from 'expo-symbols';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { TRIP_TYPE_META } from '../constants';
import { TripType } from '../types';

type TripCardBadgeProps = { tripType: TripType };

export const TripCardBadge = memo(function TripCardBadge({ tripType }: TripCardBadgeProps) {
  const theme = useTheme();
  const meta = TRIP_TYPE_META[tripType];

  return (
    <View style={[styles.badge, { backgroundColor: theme[meta.bgColor] }]}>
      <SymbolView name={meta.icon} size={12} weight="semibold" tintColor={theme[meta.textColor]} />
      <ThemedText type="smallBold" themeColor={meta.textColor} style={styles.label}>
        {meta.label}
      </ThemedText>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.five,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
  },
});
