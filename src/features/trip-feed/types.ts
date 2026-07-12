export type TripType = 'flight-stay' | 'villa' | 'experience';

export type HighlightKind =
  | 'flight'
  | 'beach'
  | 'food'
  | 'hike'
  | 'city'
  | 'relax'
  | 'adventure'
  | 'culture';

export type DayHighlight = {
  day: number;
  title: string;
  description: string;
  kind: HighlightKind;
};

export type TripBundle = {
  id: string;
  destination: string;
  country: string;
  tripType: TripType;
  heroImageUrl: string;
  heroImageWidth: number;
  heroImageHeight: number;
  price: number;
  currency: string;
  durationNights: number;
  rating: number;
  ratingCount: number;
  highlights: DayHighlight[];
};
