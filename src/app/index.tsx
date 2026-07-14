import type { FlashListRef } from '@shopify/flash-list';
import { useRef } from 'react';
import { View } from 'react-native';

import { AskCrewSheet } from '@/components/chat/ask-crew-sheet';
import { Fab } from '@/components/feed/fab';
import { FeedList } from '@/components/feed/feed-list';
import { FeedSkeleton } from '@/components/feed/feed-skeleton';
import { FeedTopBar } from '@/components/feed/feed-top-bar';
import { PerfTestTrigger } from '@/components/perf/perf-test-trigger';
import { useTripFeedData } from '@/hooks/use-trip-feed-data';
import { useFeedStore } from '@/store/feed-store';
import type { TripBundle } from '@/types/trip';

const FAB_CLEARANCE = 56 + 24 + 16;

// isSheetOpen is deliberately never read here — only AskCrewSheet subscribes
// to it, so opening/closing the sheet can never re-render FeedList.
export default function TripFeedScreen() {
  const { data, isLoading } = useTripFeedData();
  const openSheet = useFeedStore((state) => state.openSheet);
  const listRef = useRef<FlashListRef<TripBundle>>(null);

  return (
    <View className="flex-1 bg-background">
      <FeedTopBar />
      {isLoading ? <FeedSkeleton /> : <FeedList ref={listRef} data={data} bottomInset={FAB_CLEARANCE} />}
      <Fab onPress={openSheet} />
      <AskCrewSheet />
      {!isLoading && <PerfTestTrigger listRef={listRef} data={data} />}
    </View>
  );
}
