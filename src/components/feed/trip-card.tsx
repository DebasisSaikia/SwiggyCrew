import { useLayoutState } from '@shopify/flash-list';
import { memo, useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';

import { TripCardDetails } from '@/components/feed/trip-card-details';
import { TripCardImage } from '@/components/feed/trip-card-image';
import { elevation } from '@/constants/design-tokens';
import type { TripBundle } from '@/types/trip';
import { registerCardToggle, unregisterCardToggle } from '@/utils/card-expand-registry';
import { formatMeta, formatPrice } from '@/utils/format-trip';

interface TripCardProps {
  trip: TripBundle;
}

/**
 * `trip` is a stable reference from the static mock array (never spread into
 * a new object per render), so this single-object prop stays memo-safe.
 * Expand/collapse is local state — no callback prop ever crosses back to
 * FeedList, so a card expanding can never re-render its siblings or the list.
 *
 * Two FlashList-recycling gotchas this works around:
 * 1. `useLayoutState` (not plain `useState`) tells FlashList a resize is
 *    coming so it re-measures immediately instead of discovering the new
 *    height via a laggy `onLayout`, which read as cards "jumping" on scroll.
 * 2. FlashList reuses this component instance for different trips as you
 *    scroll — plain `useState` would leave a stale `expanded=true` attached
 *    to whatever trip gets recycled into this slot next, which read as
 *    cards randomly overlapping/expanding. Resetting on `trip.id` change
 *    fixes that. A root-level Reanimated `layout` animation was removed for
 *    the same reason — it fought FlashList's own cell positioning.
 */
function TripCardComponent({ trip }: TripCardProps) {
  const [expanded, setExpanded] = useLayoutState(false);

  useEffect(() => {
    setExpanded(false);
  }, [trip.id, setExpanded]);

  const toggleExpanded = useCallback(() => setExpanded((prev) => !prev), [setExpanded]);

  // Debug-only: lets the scripted perf-test harness trigger this exact
  // card's expand/collapse directly (see card-expand-registry.ts) instead
  // of synthesizing a touch event, which isn't viable against a live app.
  useEffect(() => {
    if (!__DEV__) return;
    registerCardToggle(trip.id, toggleExpanded);
    return () => unregisterCardToggle(trip.id);
  }, [trip.id, toggleExpanded]);

  return (
    <View className="w-full overflow-hidden rounded-card bg-surface" style={cardShadow}>
      <TripCardImage
        heroImageUrl={trip.heroImageUrl}
        blurhash={trip.blurhash}
        tripType={trip.tripType}
        rating={trip.rating}
      />

      <View className="gap-2 px-4 py-[14px]">
        <Text className="text-crew-heading text-text-primary">{trip.destinationName}</Text>

        <View className="flex-row items-center justify-between">
          <Text className="text-crew-body text-text-secondary">{formatMeta(trip)}</Text>
          <Text className="text-crew-body-strong text-primary">{formatPrice(trip.price, trip.currency)}</Text>
        </View>

        <View className="h-px w-full bg-border" />

        <TripCardDetails expanded={expanded} onToggle={toggleExpanded} highlights={trip.highlights} />
      </View>
    </View>
  );
}

const cardShadow = { boxShadow: elevation.card.boxShadow };

export const TripCard = memo(TripCardComponent);
