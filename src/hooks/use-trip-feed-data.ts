import { useEffect, useState } from 'react';

import { getBundles } from '@/services/mock-feed-api';
import type { TripBundle } from '@/types/trip';

interface TripFeedData {
  data: TripBundle[];
  isLoading: boolean;
}

export function useTripFeedData(): TripFeedData {
  const [data, setData] = useState<TripBundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getBundles().then((bundles) => {
      if (!cancelled) {
        setData(bundles);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading };
}
