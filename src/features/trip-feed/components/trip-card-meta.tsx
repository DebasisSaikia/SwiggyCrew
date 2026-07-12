import { SymbolView } from 'expo-symbols';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TripCardMetaProps = {
  price: number;
  currency: string;
  durationNights: number;
  rating: number;
  ratingCount: number;
};

const currencyFormatterCache = new Map<string, Intl.NumberFormat>();

function formatPrice(price: number, currency: string): string {
  let formatter = currencyFormatterCache.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    });
    currencyFormatterCache.set(currency, formatter);
  }
  return formatter.format(price);
}

export const TripCardMeta = memo(function TripCardMeta({
  price,
  currency,
  durationNights,
  rating,
  ratingCount,
}: TripCardMetaProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.priceGroup}>
        <ThemedText type="smallBold">{formatPrice(price, currency)}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {' '}
          · {durationNights} {durationNights === 1 ? 'night' : 'nights'}
        </ThemedText>
      </View>

      <View style={styles.ratingGroup}>
        <SymbolView
          name={{ ios: 'star.fill', android: 'star', web: 'star' }}
          size={13}
          tintColor={theme.ratingStar}
        />
        <ThemedText type="smallBold">{rating.toFixed(1)}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          ({ratingCount.toLocaleString()})
        </ThemedText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ratingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
  },
});
