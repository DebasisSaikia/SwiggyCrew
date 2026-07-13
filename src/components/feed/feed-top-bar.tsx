import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function FeedTopBar() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center justify-between border-b border-border bg-surface px-5"
      style={{ paddingTop: insets.top, height: insets.top + 56 }}
    >
      <Text className="text-crew-title text-primary">Crew</Text>
      <View className="h-8 w-8 rounded-full bg-surface-muted" />
    </View>
  );
}
