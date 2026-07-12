import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AskCrewFab } from '@/features/ask-crew/components/ask-crew-fab';
import { AskCrewSheet } from '@/features/ask-crew/components/ask-crew-sheet';
import { PerformanceOverlay } from '@/features/performance-overlay/components/performance-overlay';
import { TripFeedList } from '@/features/trip-feed/components/trip-feed-list';
import { useTripFeedData } from '@/features/trip-feed/hooks/use-trip-feed-data';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const FAB_CLEARANCE = 56 + Spacing.four * 2;

export default function TripFeedScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useTripFeedData();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <TripFeedList
          data={data}
          topInset={insets.top + Spacing.three}
          bottomInset={insets.bottom + FAB_CLEARANCE}
        />
      )}

      <AskCrewFab bottomOffset={insets.bottom + Spacing.four} />
      <PerformanceOverlay
        bottomOffset={insets.bottom + Spacing.four}
        topOffset={insets.top + Spacing.three}
      />
      <AskCrewSheet />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
