import { TRIP_TYPE_BADGE } from '@/constants/trip-badges';
import type { TripBundle } from '@/types/trip';

export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatMeta(trip: Pick<TripBundle, 'durationDays' | 'tripType'>): string {
  const days = trip.durationDays === 1 ? '1 day' : `${trip.durationDays} days`;
  return `${days} · ${TRIP_TYPE_BADGE[trip.tripType].label}`;
}
