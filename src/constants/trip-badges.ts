import { colors } from '@/constants/design-tokens';
import type { TripType } from '@/types/trip';

export const TRIP_TYPE_BADGE: Record<TripType, { label: string; bg: string; fg: string }> = {
  FlightStay: { label: 'Flight + Stay', bg: colors.badgeFlightStayBg, fg: colors.badgeFlightStayFg },
  Villa: { label: 'Villa', bg: colors.badgeVillaBg, fg: colors.badgeVillaFg },
  Experience: { label: 'Experience', bg: colors.badgeExperienceBg, fg: colors.badgeExperienceFg },
};
