import { View } from 'react-native';

import { AskCrewSheet } from '@/components/chat/ask-crew-sheet';
import { DevFpsCounter } from '@/components/feed/dev-fps-counter';
import { Fab } from '@/components/feed/fab';
import { FeedList } from '@/components/feed/feed-list';
import { FeedSkeleton } from '@/components/feed/feed-skeleton';
import { FeedTopBar } from '@/components/feed/feed-top-bar';
import { useTripFeedData } from '@/hooks/use-trip-feed-data';
import { useFeedStore } from '@/store/feed-store';

const FAB_CLEARANCE = 56 + 24 + 16;

// isSheetOpen is deliberately never read here — only AskCrewSheet subscribes
// to it, so opening/closing the sheet can never re-render FeedList.
export default function TripFeedScreen() {
  const { data, isLoading } = useTripFeedData();
  const openSheet = useFeedStore((state) => state.openSheet);

  return (
    <View className="flex-1 bg-background">
      <FeedTopBar />
      {isLoading ? <FeedSkeleton /> : <FeedList data={data} bottomInset={FAB_CLEARANCE} />}
      <Fab onPress={openSheet} />
      <DevFpsCounter />
      <AskCrewSheet />
    </View>
  );
}
