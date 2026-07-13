import { Image } from 'expo-image';
import { View } from 'react-native';

import { RatingPill } from '@/components/feed/rating-pill';
import { TripTypeBadge } from '@/components/feed/trip-type-badge';
import { TRIP_TYPE_BADGE } from '@/constants/trip-badges';
import type { TripType } from '@/types/trip';

interface TripCardImageProps {
  heroImageUrl: string;
  blurhash: string;
  tripType: TripType;
  rating: number;
}

/** Hero image area: fixed 180px height reserved before the remote image loads, so layout never shifts. */
export function TripCardImage({ heroImageUrl, blurhash, tripType, rating }: TripCardImageProps) {
  const badge = TRIP_TYPE_BADGE[tripType];

  return (
    <View className="h-[180px] w-full bg-surface-muted">
      <Image
        source={{ uri: heroImageUrl }}
        placeholder={{ blurhash }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        transition={200}
        recyclingKey={heroImageUrl}
      />
      <View className="absolute left-3 top-3">
        <TripTypeBadge label={badge.label} bg={badge.bg} fg={badge.fg} />
      </View>
      <View className="absolute right-3 top-3">
        <RatingPill rating={rating} />
      </View>
    </View>
  );
}
