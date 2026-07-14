/**
 * Lets the debug-only scripted perf-test harness trigger a specific card's
 * expand/collapse without synthesizing a touch event (not viable against a
 * live running app — that's a Jest/testing-library-only concept). TripCard
 * registers its own toggleExpanded here, gated by __DEV__ at the call site
 * in trip-card.tsx, keyed by trip.id. No store-driven expand mechanism
 * exists otherwise — expand state is deliberately local per rule #2/#4.
 */
const toggles = new Map<string, () => void>();

export function registerCardToggle(id: string, toggle: () => void) {
  toggles.set(id, toggle);
}

export function unregisterCardToggle(id: string) {
  toggles.delete(id);
}

export function getCardToggle(id: string): (() => void) | undefined {
  return toggles.get(id);
}
