/**
 * Raw design-token values, for contexts that can't use static NativeWind
 * classNames (Reanimated `useAnimatedStyle`, dynamic icon colors, etc).
 * Keep in sync with `tailwind.config.js` theme.extend — this file and the
 * Tailwind config are two views of the same source (Design Docs — Exact Spec §1).
 */

export const colors = {
  background: '#FAF7F2',
  surface: '#FFFFFF',
  surfaceMuted: '#F1ECE4',
  border: '#E7E1D6',
  textPrimary: '#211F1D',
  textSecondary: '#726C63',
  textTertiary: '#A39C90',
  primary: '#372F73',
  primaryForeground: '#FFFFFF',
  accent: '#FF6B4A',
  accentForeground: '#FFFFFF',
  badgeFlightStayBg: '#E5E6FC',
  badgeFlightStayFg: '#453CA9',
  badgeVillaBg: '#E6F1E7',
  badgeVillaFg: '#257535',
  badgeExperienceBg: '#FFEEE0',
  badgeExperienceFg: '#BE681D',
  scrim: '#1B1916',
} as const;

export const radii = {
  card: 16,
  badge: 6,
  chip: 10,
  sheetTop: 24,
  fab: 28,
  bubble: 16,
  bubbleTail: 4,
} as const;

export const spacing = {
  screenMargin: 16,
  cardGap: 16,
} as const;

export const elevation = {
  card: { color: '#1A1714', opacity: 0.12, offset: { width: 0, height: 4 }, radius: 16 },
  fab: { color: '#000000', opacity: 0.18, offset: { width: 0, height: 6 }, radius: 20 },
  sheet: { color: '#000000', opacity: 0.15, offset: { width: 0, height: -8 }, radius: 24 },
} as const;

export const typography = {
  title: { fontSize: 22, lineHeight: 22 * 1.3, fontWeight: '700' as const },
  heading: { fontSize: 17, lineHeight: 17 * 1.3, fontWeight: '600' as const },
  bodyStrong: { fontSize: 15, lineHeight: 15 * 1.4, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 15 * 1.4, fontWeight: '400' as const },
  caption: { fontSize: 13, lineHeight: 13 * 1.3, fontWeight: '400' as const },
  micro: { fontSize: 11, lineHeight: 11 * 1.2, fontWeight: '500' as const },
} as const;

export const layout = {
  artboardWidth: 390,
  artboardHeight: 844,
  statusBarHeight: 44,
  homeIndicatorHeight: 34,
  topBarHeight: 56,
} as const;
