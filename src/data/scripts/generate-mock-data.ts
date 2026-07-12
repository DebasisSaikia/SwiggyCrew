import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { DayHighlight, HighlightKind, TripBundle, TripType } from '@/features/trip-feed/types';

const ITEM_COUNT = 132;
const SEED = 42;
const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 600;

// Deterministic PRNG (mulberry32) so the generated JSON is reproducible across runs.
function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(SEED);

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(random() * items.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number): number {
  const value = random() * (max - min) + min;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

const DESTINATIONS: { destination: string; country: string }[] = [
  { destination: 'Bali', country: 'Indonesia' },
  { destination: 'Santorini', country: 'Greece' },
  { destination: 'Kyoto', country: 'Japan' },
  { destination: 'Reykjavik', country: 'Iceland' },
  { destination: 'Cape Town', country: 'South Africa' },
  { destination: 'Lisbon', country: 'Portugal' },
  { destination: 'Queenstown', country: 'New Zealand' },
  { destination: 'Marrakesh', country: 'Morocco' },
  { destination: 'Phuket', country: 'Thailand' },
  { destination: 'Banff', country: 'Canada' },
  { destination: 'Amalfi Coast', country: 'Italy' },
  { destination: 'Maldives', country: 'Maldives' },
  { destination: 'Kerala', country: 'India' },
  { destination: 'Zermatt', country: 'Switzerland' },
  { destination: 'Tulum', country: 'Mexico' },
  { destination: 'Dubrovnik', country: 'Croatia' },
  { destination: 'Seoul', country: 'South Korea' },
  { destination: 'Patagonia', country: 'Argentina' },
  { destination: 'Sedona', country: 'USA' },
  { destination: 'Hoi An', country: 'Vietnam' },
  { destination: 'Ubud', country: 'Indonesia' },
  { destination: 'Porto', country: 'Portugal' },
  { destination: 'Interlaken', country: 'Switzerland' },
  { destination: 'Goa', country: 'India' },
  { destination: 'Costa Rica Rainforest', country: 'Costa Rica' },
  { destination: 'Santorini Caldera', country: 'Greece' },
  { destination: 'Kruger', country: 'South Africa' },
  { destination: 'Chiang Mai', country: 'Thailand' },
  { destination: 'Rajasthan', country: 'India' },
  { destination: 'Faroe Islands', country: 'Denmark' },
];

const TRIP_TYPES: readonly TripType[] = ['flight-stay', 'villa', 'experience'];

const CURRENCY = 'USD';

const HIGHLIGHT_TEMPLATES: Record<HighlightKind, { titles: string[]; description: string }> = {
  flight: {
    titles: ['Arrival & check-in', 'Scenic transfer'],
    description: 'Land, settle in, and get oriented before the trip kicks off.',
  },
  beach: {
    titles: ['Beach day', 'Sunset by the shore', 'Coastal walk'],
    description: 'Unwind on the sand with time to swim, read, or just watch the waves.',
  },
  food: {
    titles: ['Local food crawl', 'Cooking class', 'Market breakfast'],
    description: 'Taste your way through the region with a guided culinary stop.',
  },
  hike: {
    titles: ['Guided hike', 'Sunrise trek', 'Valley trail'],
    description: 'A moderate trail with viewpoints, guided by a local expert.',
  },
  city: {
    titles: ['Old town walking tour', 'City landmarks', 'Neighborhood exploration'],
    description: 'Explore the streets, architecture, and everyday life of the city center.',
  },
  relax: {
    titles: ['Spa & wellness', 'Free day to relax', 'Pool & lounge'],
    description: 'An unscheduled block to slow down, recover, and enjoy the property.',
  },
  adventure: {
    titles: ['Adventure excursion', 'Off-road day trip', 'Water sports'],
    description: 'An active, guided excursion built around the region’s terrain.',
  },
  culture: {
    titles: ['Museum & heritage visit', 'Cultural performance', 'Historic site tour'],
    description: 'A closer look at the local history and traditions with a guide.',
  },
};

const HIGHLIGHT_KIND_POOL_BY_TYPE: Record<TripType, readonly HighlightKind[]> = {
  'flight-stay': ['flight', 'city', 'food', 'relax', 'culture'],
  villa: ['relax', 'beach', 'food', 'adventure'],
  experience: ['adventure', 'hike', 'culture', 'food', 'city'],
};

function buildHighlights(tripType: TripType): DayHighlight[] {
  const pool = HIGHLIGHT_KIND_POOL_BY_TYPE[tripType];
  const dayCount = randomInt(3, 4);
  const highlights: DayHighlight[] = [];

  for (let day = 1; day <= dayCount; day++) {
    const kind = pick(pool);
    const template = HIGHLIGHT_TEMPLATES[kind];
    highlights.push({
      day,
      title: pick(template.titles),
      description: template.description,
      kind,
    });
  }

  return highlights;
}

function buildPrice(tripType: TripType, nights: number): number {
  const basePerNight = tripType === 'villa' ? 180 : tripType === 'experience' ? 140 : 110;
  const jitter = randomInt(-20, 40);
  return Math.round((basePerNight + jitter) * nights * 100) / 100;
}

function buildTripBundle(index: number): TripBundle {
  const { destination, country } = pick(DESTINATIONS);
  const tripType = pick(TRIP_TYPES);
  const nights = randomInt(3, 12);
  const id = `trip-${index.toString().padStart(4, '0')}`;

  return {
    id,
    destination,
    country,
    tripType,
    heroImageUrl: `https://picsum.photos/seed/${id}/${IMAGE_WIDTH}/${IMAGE_HEIGHT}`,
    heroImageWidth: IMAGE_WIDTH,
    heroImageHeight: IMAGE_HEIGHT,
    price: buildPrice(tripType, nights),
    currency: CURRENCY,
    durationNights: nights,
    rating: randomFloat(3.5, 5.0, 1),
    ratingCount: randomInt(18, 2400),
    highlights: buildHighlights(tripType),
  };
}

const bundles: TripBundle[] = Array.from({ length: ITEM_COUNT }, (_, i) => buildTripBundle(i));

const outputPath = join(__dirname, '..', 'mock', 'trip-bundles.json');
writeFileSync(outputPath, JSON.stringify(bundles, null, 2) + '\n');

console.log(`Generated ${bundles.length} trip bundles -> ${outputPath}`);
