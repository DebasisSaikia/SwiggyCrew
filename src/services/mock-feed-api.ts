import mockBundles from '@/data/mock-bundles.json';
import type { TripBundle } from '@/types/trip';

const MIN_DELAY_MS = 400;
const MAX_DELAY_MS = 800;

export function getBundles(): Promise<TripBundle[]> {
  const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockBundles as TripBundle[]), delay);
  });
}
