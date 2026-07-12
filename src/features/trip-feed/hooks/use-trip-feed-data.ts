import { useEffect, useState } from 'react';

import tripBundlesJson from '@/data/mock/trip-bundles.json';

import { TripBundle } from '../types';

const tripBundles = tripBundlesJson as TripBundle[];

// Simulates a network round-trip for the mocked feed data, per the assignment's
// "add mock delay to simulate loading states" constraint.
const MOCK_LOAD_DELAY_MS = 600;

export function useTripFeedData() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<TripBundle[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(tripBundles);
      setIsLoading(false);
    }, MOCK_LOAD_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}
