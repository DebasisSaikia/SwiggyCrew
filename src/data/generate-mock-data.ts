import { encode } from 'blurhash';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { DayHighlight, TripBundle, TripType } from '@/types/trip';

const ITEM_COUNT = 120;
const SEED = 42;
const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 600;
const CURRENCY = 'USD';

// Deterministic PRNG (mulberry32) so mockBundles.json is reproducible across runs
// and trip `id`s stay stable across app restarts (see ERD §8).
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

const DESTINATIONS: string[] = [
  'Bali, Indonesia',
  'Santorini, Greece',
  'Kyoto, Japan',
  'Reykjavik, Iceland',
  'Cape Town, South Africa',
  'Lisbon, Portugal',
  'Queenstown, New Zealand',
  'Marrakesh, Morocco',
  'Phuket, Thailand',
  'Banff, Canada',
  'Amalfi Coast, Italy',
  'Maldives',
  'Kerala, India',
  'Zermatt, Switzerland',
  'Tulum, Mexico',
  'Dubrovnik, Croatia',
  'Seoul, South Korea',
  'Patagonia, Argentina',
  'Sedona, USA',
  'Hoi An, Vietnam',
  'Ubud, Indonesia',
  'Porto, Portugal',
  'Interlaken, Switzerland',
  'Goa, India',
  'Costa Rica Rainforest',
  'Kruger, South Africa',
  'Chiang Mai, Thailand',
  'Rajasthan, India',
  'Faroe Islands, Denmark',
  'Queenstown, New Zealand',
];

const TRIP_TYPES: readonly TripType[] = ['FlightStay', 'Villa', 'Experience'];

const HIGHLIGHT_TEMPLATES: Record<string, { titles: string[]; iconKey: string }> = {
  flight: { titles: ['Arrival & check-in', 'Scenic transfer'], iconKey: 'flight' },
  beach: { titles: ['Beach day', 'Sunset by the shore', 'Coastal walk'], iconKey: 'beach' },
  food: { titles: ['Local food crawl', 'Cooking class', 'Market breakfast'], iconKey: 'food' },
  hike: { titles: ['Guided hike', 'Sunrise trek + local breakfast', 'Valley trail'], iconKey: 'hike' },
  city: { titles: ['Old town walking tour', 'City landmarks', 'Neighborhood exploration'], iconKey: 'city' },
  relax: { titles: ['Spa & wellness', 'Free day to relax', 'Pool & lounge'], iconKey: 'relax' },
  adventure: { titles: ['Adventure excursion', 'Off-road day trip', 'Water sports'], iconKey: 'adventure' },
  culture: { titles: ['Museum & heritage visit', 'Cultural performance', 'Historic site tour'], iconKey: 'culture' },
};

const HIGHLIGHT_POOL_BY_TYPE: Record<TripType, readonly string[]> = {
  FlightStay: ['flight', 'city', 'food', 'relax', 'culture'],
  Villa: ['relax', 'beach', 'food', 'adventure'],
  Experience: ['adventure', 'hike', 'culture', 'food', 'city'],
};

// Muted, warm-toned gradients per trip type — encoded into real blurhash
// strings below rather than hand-typed, so every hash is guaranteed valid.
const GRADIENTS: Record<TripType, [[number, number, number], [number, number, number]]> = {
  FlightStay: [[69, 60, 169], [229, 230, 252]],
  Villa: [[37, 117, 53], [230, 241, 231]],
  Experience: [[190, 104, 29], [255, 238, 224]],
};

function buildBlurhash(tripType: TripType): string {
  const [from, to] = GRADIENTS[tripType];
  const width = 32;
  const height = 32;
  const pixels = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const t = x / (width - 1);
      const i = (y * width + x) * 4;
      pixels[i] = from[0] + (to[0] - from[0]) * t;
      pixels[i + 1] = from[1] + (to[1] - from[1]) * t;
      pixels[i + 2] = from[2] + (to[2] - from[2]) * t;
      pixels[i + 3] = 255;
    }
  }

  return encode(pixels, width, height, 4, 3);
}

function buildHighlights(tripType: TripType, tripId: string): DayHighlight[] {
  const pool = HIGHLIGHT_POOL_BY_TYPE[tripType];
  const dayCount = randomInt(3, 4);
  const highlights: DayHighlight[] = [];

  for (let day = 1; day <= dayCount; day++) {
    const kind = pick(pool);
    const template = HIGHLIGHT_TEMPLATES[kind];
    highlights.push({
      id: `${tripId}-day-${day}`,
      dayNumber: day,
      title: pick(template.titles),
      iconKey: template.iconKey,
    });
  }

  return highlights;
}

function buildPrice(tripType: TripType, days: number): number {
  const basePerDay = tripType === 'Villa' ? 180 : tripType === 'Experience' ? 140 : 110;
  const jitter = randomInt(-20, 40);
  return Math.round(basePerDay + jitter) * days;
}

function buildTripBundle(index: number): TripBundle {
  const destinationName = pick(DESTINATIONS);
  const tripType = pick(TRIP_TYPES);
  const durationDays = randomInt(3, 12);
  const id = `trip-${index.toString().padStart(4, '0')}`;

  return {
    id,
    destinationName,
    heroImageUrl: `https://picsum.photos/seed/${id}/${IMAGE_WIDTH}/${IMAGE_HEIGHT}`,
    imageWidth: IMAGE_WIDTH,
    imageHeight: IMAGE_HEIGHT,
    blurhash: buildBlurhash(tripType),
    tripType,
    price: buildPrice(tripType, durationDays),
    currency: CURRENCY,
    durationDays,
    rating: randomFloat(3.5, 5.0, 1),
    highlights: buildHighlights(tripType, id),
  };
}

const bundles: TripBundle[] = Array.from({ length: ITEM_COUNT }, (_, i) => buildTripBundle(i));

const outputPath = join(__dirname, 'mock-bundles.json');
writeFileSync(outputPath, JSON.stringify(bundles, null, 2) + '\n');

console.log(`Generated ${bundles.length} trip bundles -> ${outputPath}`);
