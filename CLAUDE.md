# Crew SDE2/3 Take-Home — Project Context

## What this is

A React Native (Expo Router) take-home: a high-performance Trip Discovery
Feed, an "Ask Crew" AI bottom sheet, and a custom Performance Overlay.
Graded primarily on FPS/perf engineering, not feature count. Full brief
and phase plan live in project docs (Notion) — this file is the condensed
source of truth for in-repo decisions.

## Tech stack (do not substitute without asking)

Actually-installed versions, verified against live docs — this repo runs
ahead of what the original Notion planning docs assumed (they were written
against SDK 54 / Reanimated 3 / FlashList v1). Trust this section over
those docs when they conflict.

- Expo SDK 57, React Native 0.86, React 19.2, Expo Router, TypeScript strict,
  New Architecture (default in SDK 57 — required by FlashList v2 below)
- @shopify/flash-list **v2** for the feed (NOT FlatList). v2 dropped manual
  size estimation entirely — do NOT set `estimatedItemSize`/`estimatedListSize`;
  v2 auto-sizes. `overrideItemLayout` only supports span changes now, not
  custom item sizing.
- `@expo/ui/community/bottom-sheet` (native Material3 `ModalBottomSheet` on
  Android, native SwiftUI sheet on iOS) for the Ask Crew sheet, NOT
  `@gorhom/bottom-sheet`. We started with gorhom per the original plan, but
  on a real Android dev client `present()` returned successfully yet
  `onChange`/`onAnimate` never fired and the sheet never visually appeared —
  even in gorhom's own bare-minimum example, with React Compiler disabled,
  with a release build. Matches a currently-unresolved upstream issue (sheet
  invisible in dev-client builds on Android). `@expo/ui`'s bottom sheet API
  is deliberately gorhom-compatible (same `snapPoints`, `index`,
  `present()`/`dismiss()`, `BottomSheetView`/`BottomSheetFlatList`/
  `BottomSheetTextInput`), so treat its props as the source of truth over
  gorhom's docs where they diverge — notably: Android only supports 2 snap
  states (partial ~50%, expanded), custom `handleComponent`/`backgroundStyle`
  styling mostly has no effect (native chrome renders its own), and
  `BottomSheetModalProvider` is a no-op kept only for API parity.
  **KNOWN ISSUE, deferred, do not "fix" without asking:** on Android,
  `ChatInputBar` doesn't render until the sheet is fully expanded (92%) —
  invisible at the partial (50%) snap point. A from-scratch replacement
  (`Modal`/absolutely-positioned overlay + core `Animated` + `PanResponder`,
  no third-party sheet lib at all) got further — it fixed the sheet not
  presenting, and a separate Reanimated/secondary-Fabric-surface crash
  (`RetryableMountingLayerException: Unable to find SurfaceMountingManager`)
  — but hit a still-unexplained bug where any scrollable sibling (`FlatList`
  OR `ScrollView`) prevents `ChatInputBar` from rendering at all, regardless
  of sibling order, absolute positioning, elevation, or `overflow`. Chasing
  Android fixes for that replacement also broke iOS. Reverted back to
  `@expo/ui` rather than ship something broken on both platforms — the
  partial-height bug is Android-only and considered acceptable for now.
- react-native-reanimated 4 + react-native-worklets for everything else
  that animates (day-highlight chevron rotation, feed skeleton shimmer,
  typing-indicator dots) — NOT used for the sheet. Reanimated 4 needs
  `react-native-worklets` as a separate peer dependency (already installed).
  The Reanimated babel plugin is auto-configured by `babel-preset-expo` in
  SDK 57 — do not hand-add a babel plugin entry for it (doing so during
  Phase 2 debugging caused a stray babel.config.js edit that had to be
  reverted).
- expo-image for all remote images (explicit width/height + blurhash placeholder)
- @expo/vector-icons for all iconography (day-highlight icons, chevrons,
  FAB glyph, send button, minimize icon) — used in chat components
  (`SendIcon`, the minimize chevron in `SheetHeader`), NOT raw
  `react-native-svg`. NOTE: despite being an Expo package, it is NOT
  resolvable by default under this repo's pnpm setup — it was explicitly
  added as a direct dependency in Phase 0. Don't assume other "bundled with
  Expo" packages are present without checking. The rest of the app (FAB
  sparkle, day-highlight icons) still uses hand-rolled `react-native-svg`
  from Phase 0/1; that predates Phase 2 and is a pre-existing CLAUDE.md
  deviation, not something Phase 2 introduced or fixed — flag it if you
  touch those files, but don't silently "fix" it as a drive-by.
- @expo-google-fonts/inter + expo-font for the Inter type scale (loaded via
  `useFonts` in the root layout, gates splash screen hide).
- NativeWind v4 + Tailwind for styling — STATIC classNames only on anything
  that renders inside the feed list (TripCard). Never build a className
  string dynamically per-item. Anything animated (expand/collapse, sheet
  position, press feedback) goes through Reanimated `useAnimatedStyle`,
  never through className.
- Zustand for state — two narrow stores, not one global store, not Context:
  - `feedStore`: just `isSheetOpen: boolean`
  - `chatStore`: chat messages, streaming flag, sheet snap index
- No backend. Mock data from a local JSON file + a mock AI streaming
  generator (see Data Model below).

## Non-negotiable performance rules

1. `TripCard` must be `React.memo`'d with primitive props only. No inline
   arrow functions or object literals passed as props from the parent list.
2. The nested day-highlights horizontal scroll inside an expanded card is
   LAZY-MOUNTED only when that card is expanded — never pre-rendered
   hidden for all 100+ cards.
3. While an assistant chat message is streaming, the growing text lives in
   LOCAL component state inside the message bubble, not in `chatStore`.
   Only commit to the store once, when the stream completes. Never write
   to the store on every token.
4. `FeedList` (the FlashList wrapper) must never re-render when the Ask
   Crew sheet opens/closes. The FAB only ever touches `feedStore.isSheetOpen`.
5. The Performance Overlay's own re-render is throttled to ~4Hz even
   though its internal sampling runs every frame via requestAnimationFrame.
   The overlay must not be a meaningful source of the jank it measures.

## Resolved ambiguity: AI streaming

The brief's Screens section and Technical Constraints table disagree on
whether streaming is required — Screens says AI responses stream
token-by-token, but the Technical Constraints table says mock AI needs
"no streaming required." We follow the Screens section (the more
specific, feature-level spec): mockAI.ts simulates token-by-token
streaming via chunked async generator yields with randomized delay. This
is not a real API call — it's a client-side simulation, which satisfies
both the "mock data is fine" constraint and the "appears progressively"
requirement. Don't flip-flop on this mid-build.

## Data model (see Engineering Plan & ERD doc for full detail; canonical
types live in `src/types/trip.ts`, `src/types/chat.ts`, `src/types/perf.ts`)

```ts
type TripType = 'FlightStay' | 'Villa' | 'Experience';

interface DayHighlight {
  id: string;
  dayNumber: number;
  title: string;
  iconKey: string;
}

interface TripBundle {
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
  highlights: DayHighlight[]; // embedded, nested in the mock JSON
}

type ChatRole = 'user' | 'assistant';
type MessageStatus = 'pending' | 'streaming' | 'complete';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string; // committed text only, empty while streaming
  status: MessageStatus;
  createdAt: number;
}
```

## Design tokens (from Design Docs — Exact Spec)

- Colors: background #FAF7F2, surface #FFFFFF, surface-muted #F1ECE4,
  border #E7E1D6, text-primary #211F1D, text-secondary #726C63,
  text-tertiary #A39C90, primary #372F73, accent #FF6B4A
- Badge tints: FlightStay #E5E6FC/#453CA9, Villa #E6F1E7/#257535,
  Experience #FFEEE0/#BE681D
- Type: Inter — Title 22/Bold, Heading 17/SemiBold, Body 15/Regular,
  Body Strong 15/SemiBold, Caption 13/Regular, Micro 11/Medium
- Corner radii: cards 16, badges/rating pill 6, day-highlight chips 10,
  sheet top corners 24, FAB fully circular (56x56), chat bubbles 16
  with a 4px "tail" corner

## Project structure

Filenames are kebab-case throughout (repo convention), not the camelCase
shown in the Architecture doc's tree — same structure, different casing:

```
src/
├── app/                       # Expo Router — _layout.tsx, index.tsx (feed screen)
├── components/{feed,chat,perf}/  # per-domain, pure/presentational
├── store/                     # feed-store.ts (isSheetOpen only), chat-store.ts
├── data/                      # mock-bundles.json, generate-mock-data.ts
├── services/                  # mock-feed-api.ts, mock-ai.ts (Phase 1/2)
├── types/                     # trip.ts, chat.ts, perf.ts — shared contracts
├── constants/                 # design-tokens.ts (raw values for Reanimated/dynamic use)
├── hooks/
└── utils/                     # perf-math.ts (Phase 3)
```

Keep these separated — don't collapse everything into one components folder.
`tailwind.config.js` theme.extend and `src/constants/design-tokens.ts` are
two views of the same values (Design Docs §1); keep them in sync by hand.

## What "done" looks like for this repo

- PERFORMANCE.md at root with real measured p50/p95/worst-frame numbers
  from a scripted 60s test, not estimates
- README.md covering setup, state management rationale, known limitations
- A public GitHub repo, all frame-rate targets from the brief met on a
  mid-range Android profile (not just a fast simulator)
