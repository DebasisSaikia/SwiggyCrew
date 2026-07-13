# Crew SDE2/3 Take-Home — Project Context

## What this is

A React Native (Expo Router) take-home: a high-performance Trip Discovery
Feed, an "Ask Crew" AI bottom sheet, and a custom Performance Overlay.
Graded primarily on FPS/perf engineering, not feature count. Full brief
and phase plan live in project docs (Notion) — this file is the condensed
source of truth for in-repo decisions.

## Tech stack (do not substitute without asking)

- Expo SDK 54+, Expo Router, TypeScript strict
- @shopify/flash-list for the feed (NOT FlatList — this is a deliberate
  choice for the 100+ item / 55+ FPS requirement)
- @gorhom/bottom-sheet + react-native-reanimated 3 + react-native-gesture-handler
  for the Ask Crew sheet
- expo-image for all remote images (explicit width/height + blurhash placeholder)
- @expo/vector-icons for all iconography (day-highlight icons, chevrons,
  FAB glyph, send button, minimize icon) — bundled with Expo, no extra
  install needed. Don't reach for a separate icon package.
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

## Data model (see Engineering Plan & ERD doc for full detail)

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

(see Architecture & Implementation Plan doc §3 for the full tree —
keep components/store/data/services/hooks/utils separated as specified
there; don't collapse everything into one components folder)

## What "done" looks like for this repo

- PERFORMANCE.md at root with real measured p50/p95/worst-frame numbers
  from a scripted 60s test, not estimates
- README.md covering setup, state management rationale, known limitations
- A public GitHub repo, all frame-rate targets from the brief met on a
  mid-range Android profile (not just a fast simulator)
