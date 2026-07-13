import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { memo, useCallback } from 'react';
import { View } from 'react-native';

import { TripCard } from '@/components/feed/trip-card';
import type { TripBundle } from '@/types/trip';

interface FeedListProps {
  data: TripBundle[];
  bottomInset: number;
}

// FlashList v2 auto-sizes — no estimatedItemSize prop (removed, no longer needed).
function FeedListComponent({ data, bottomInset }: FeedListProps) {
  const renderItem = useCallback(({ item }: ListRenderItemInfo<TripBundle>) => <TripCard trip={item} />, []);
  const keyExtractor = useCallback((item: TripBundle) => item.id, []);

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={ItemSeparator}
      contentContainerStyle={{ paddingTop: 12, paddingHorizontal: 16, paddingBottom: bottomInset }}
    />
  );
}

function ItemSeparator() {
  return <View className="h-4" />;
}

export const FeedList = memo(FeedListComponent);
