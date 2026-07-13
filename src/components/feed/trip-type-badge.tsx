import { Text, View } from 'react-native';

interface TripTypeBadgeProps {
  label: string;
  bg: string;
  fg: string;
}

/** Static layout/padding via NativeWind; bg/fg are per-instance colors passed as style, not className (§10.2). */
export function TripTypeBadge({ label, bg, fg }: TripTypeBadgeProps) {
  return (
    <View className="rounded-badge px-[10px] py-[5px]" style={{ backgroundColor: bg }}>
      <Text className="text-crew-micro" style={{ color: fg }}>
        {label}
      </Text>
    </View>
  );
}
