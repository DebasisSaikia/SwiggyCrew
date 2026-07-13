import { create } from 'zustand';

interface FeedState {
  isSheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
}

/**
 * Deliberately just a flag. Trip bundle data is a static module-level import
 * handed straight to FlashList, never store state — see Engineering Plan & ERD §5.
 * Nothing in this store may ever hold chat or trip data: that coupling is what
 * would let a chat update trigger a FeedList re-render.
 */
export const useFeedStore = create<FeedState>((set) => ({
  isSheetOpen: false,
  openSheet: () => set({ isSheetOpen: true }),
  closeSheet: () => set({ isSheetOpen: false }),
}));
