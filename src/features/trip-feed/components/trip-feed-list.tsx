import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

import { TripBundle } from '../types';
import { TripCard } from './trip-card';

type TripFeedListProps = {
  data: TripBundle[];
  topInset: number;
  bottomInset: number;
};

const renderItem = ({ item }: ListRenderItemInfo<TripBundle>) => <TripCard item={item} />;
const keyExtractor = (item: TripBundle) => item.id;

export function TripFeedList({ data, topInset, bottomInset }: TripFeedListProps) {
  const ListHeaderComponent = useCallback(
    () => (
      <ThemedText type="title" style={styles.header}>
        Discover
      </ThemedText>
    ),
    []
  );

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={{
        paddingTop: topInset,
        paddingBottom: bottomInset,
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 32,
    lineHeight: 38,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
});
