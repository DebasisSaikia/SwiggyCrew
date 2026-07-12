import { SymbolView } from 'expo-symbols';
import { memo, useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { TripBundle } from '../types';
import { TripCardBadge } from './trip-card-badge';
import { TripCardDetails } from './trip-card-details';
import { TripCardImage } from './trip-card-image';
import { TripCardMeta } from './trip-card-meta';

type TripCardProps = { item: TripBundle };

function TripCardComponent({ item }: TripCardProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback(() => setExpanded((value) => !value), []);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.cardBorder },
      ]}>
      <TripCardImage
        uri={item.heroImageUrl}
        recyclingKey={item.id}
        width={item.heroImageWidth}
        height={item.heroImageHeight}
      />

      <View style={styles.content}>
        <TripCardBadge tripType={item.tripType} />

        <View style={styles.titleRow}>
          <ThemedText type="subtitle" style={styles.title} numberOfLines={1}>
            {item.destination}
          </ThemedText>
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {item.country}
        </ThemedText>

        <TripCardMeta
          price={item.price}
          currency={item.currency}
          durationNights={item.durationNights}
          rating={item.rating}
          ratingCount={item.ratingCount}
        />

        <Pressable
          onPress={toggleExpanded}
          style={({ pressed }) => [styles.detailsToggle, pressed && styles.detailsTogglePressed]}
          hitSlop={8}>
          <ThemedText type="smallBold" themeColor="primary">
            Details
          </ThemedText>
          <SymbolView
            name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
            size={14}
            weight="bold"
            tintColor={theme.primary}
            style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
          />
        </Pressable>

        {expanded && <TripCardDetails highlights={item.highlights} />}
      </View>
    </View>
  );
}

export const TripCard = memo(TripCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.three,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.one,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
    alignSelf: 'flex-start',
    marginTop: Spacing.one,
    paddingVertical: Spacing.one,
  },
  detailsTogglePressed: {
    opacity: 0.6,
  },
});
