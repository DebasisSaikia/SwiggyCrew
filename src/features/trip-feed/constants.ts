import { SymbolViewProps } from 'expo-symbols';

import { ThemeColor } from '@/constants/theme';

import { HighlightKind, TripType } from './types';

type SymbolName = Extract<SymbolViewProps['name'], object>;

export const TRIP_TYPE_META: Record<
  TripType,
  { label: string; icon: SymbolName; bgColor: ThemeColor; textColor: ThemeColor }
> = {
  'flight-stay': {
    label: 'Flight + Stay',
    icon: { ios: 'airplane', android: 'flight', web: 'flight' },
    bgColor: 'badgeFlightStay',
    textColor: 'badgeFlightStayText',
  },
  villa: {
    label: 'Villa',
    icon: { ios: 'house.fill', android: 'holiday_village', web: 'holiday_village' },
    bgColor: 'badgeVilla',
    textColor: 'badgeVillaText',
  },
  experience: {
    label: 'Experience',
    icon: { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' },
    bgColor: 'badgeExperience',
    textColor: 'badgeExperienceText',
  },
};

export const HIGHLIGHT_KIND_ICON: Record<HighlightKind, SymbolName> = {
  flight: { ios: 'airplane', android: 'flight', web: 'flight' },
  beach: { ios: 'beach.umbrella.fill', android: 'beach_access', web: 'beach_access' },
  food: { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' },
  hike: { ios: 'figure.hiking', android: 'hiking', web: 'hiking' },
  city: { ios: 'building.2.fill', android: 'location_city', web: 'location_city' },
  relax: { ios: 'leaf.fill', android: 'spa', web: 'spa' },
  adventure: { ios: 'mountain.2.fill', android: 'terrain', web: 'terrain' },
  culture: { ios: 'building.columns.fill', android: 'museum', web: 'museum' },
};

export const TRIP_CARD_IMAGE_ASPECT_RATIO = 4 / 3;
