import { Text, View } from 'react-native';

interface RatingPillProps {
  rating: number;
}

export function RatingPill({ rating }: RatingPillProps) {
  return (
    <View className="flex-row items-center gap-[3px] rounded-badge bg-[rgba(27,25,22,0.55)] px-2 py-1">
      <Text className="text-crew-micro text-surface">★ {rating.toFixed(1)}</Text>
    </View>
  );
}
