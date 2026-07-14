import { FlashList, type FlashListRef, type ListRenderItemInfo } from '@shopify/flash-list';
import { memo, useCallback, type Ref } from 'react';
import { View } from 'react-native';

import { TripCard } from '@/components/feed/trip-card';
import type { TripBundle } from '@/types/trip';

interface FeedListProps {
  data: TripBundle[];
  bottomInset: number;
  /**
   * Only ever set by the debug-only scripted perf-test harness (see
   * perf-test-harness.ts) to drive scroll programmatically. React 19 accepts
   * `ref` as a plain prop on function components — no forwardRef needed.
   */
  ref?: Ref<FlashListRef<TripBundle>>;
}

// FlashList v2 auto-sizes — no estimatedItemSize prop (removed, no longer needed).
function FeedListComponent({ data, bottomInset, ref }: FeedListProps) {
  const renderItem = useCallback(({ item }: ListRenderItemInfo<TripBundle>) => <TripCard trip={item} />, []);
  const keyExtractor = useCallback((item: TripBundle) => item.id, []);

  return (
    <FlashList
      ref={ref}
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
