export type TripType = 'FlightStay' | 'Villa' | 'Experience';

export interface DayHighlight {
  id: string;
  dayNumber: number;
  title: string;
  iconKey: string;
}

export interface TripBundle {
  id: string;
  destinationName: string;
  heroImageUrl: string;
  imageWidth: number;
  imageHeight: number;
  blurhash: string;
  tripType: TripType;
  price: number;
  currency: string;
  durationDays: number;
  rating: number;
  highlights: DayHighlight[];
}
