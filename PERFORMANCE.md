# PERFORMANCE.md

Real, on-device measurements from a scripted, reproducible test — not
estimates. This document covers methodology, the numbers from a full
scripted run, one deliberately reproduced-and-fixed bottleneck with
before/after evidence, target-matrix results, and one honest trade-off.

## Methodology

**Device**: Pixel 9 Pro Fold, physical device (not a simulator), **120Hz
display**. This is a real device, but it is a current-generation flagship,
not the "mid-range Android profile" the original project docs scoped
testing against — no mid-range device was available for this pass. Numbers
here should be read as "this device's ceiling," not as evidence the app
would hit the same numbers on genuinely mid-range hardware. Flagging this
honestly rather than implying otherwise.

**Build**: dev-client build with Metro attached (`expo start` + a custom dev
client, since `@expo/ui` requires one — Expo Go doesn't support it), not a
release/profile build. This is a deliberate, documented trade-off — see
[Honest trade-off](#honest-trade-off) below.

**Sampling**: `FpsMeter` (`src/utils/fps-meter.ts`) samples every frame via
`requestAnimationFrame` on the main JS thread. Two destinations from the
same sample, simultaneously:
- A ~300-sample (~5s) circular ring buffer feeds the live `PerfOverlay` HUD,
  throttled to redraw at ~4Hz (CLAUDE.md rule #5) so the overlay itself
  isn't a meaningful source of the jank it measures.
- A separate, unthrottled full-session array (`startRecording()`/
  `stopRecording()`) captures every sample for the duration of a scripted
  test run — this is what the numbers below come from.

A parallel, independent UI-thread heartbeat (`src/hooks/use-js-thread-heartbeat.ts`,
via Reanimated's `useFrameCallback` + `runOnJS`) flags JS-thread stalls
specifically, distinct from raw FPS — not used for the numbers below (no JS
thread stalls were deliberately induced during these runs), but is what
`jsThreadBusy`/`frameDropCount`-adjacent instrumentation is built on.

**Frame-drop threshold**: `frameTimeMs > 22.2` (i.e. <45 FPS), per the
original spec.

**Scripted sequence** (`src/utils/perf-test-harness.ts`, triggered via a
`__DEV__`-only "Run Perf Test" button, drives the app programmatically, not
manual swipes — reproducible run to run):
1. 30s idle scroll (sawtooth `scrollToOffset` calls)
2. 3x expand/collapse, targeting whichever card is on-screen via a debug-only
   registry (`src/utils/card-expand-registry.ts`) — no synthetic touch
   events, since those aren't viable against a live running app
3. Open the Ask Crew sheet — only the "half" (50%) state is reachable
   programmatically; `@expo/ui`'s `BottomSheetModal` exposes only
   `present()`/`dismiss()`, no imperative snap-to-full method (it's native
   chrome), so "drag to full" isn't scriptable and isn't faked here
4. Push one scripted chat message, then 20s of concurrent scroll while it
   streams — **empirically confirmed the feed does still scroll/repaint
   behind the open native sheet** (screenshots 2s apart during this phase
   show a different card and a different live FPS reading), so this segment
   does measure something real. That said, this step is a **synthetic
   JS-thread stress test**, not a representative user flow — a real user
   can't see or scroll the feed while the sheet covers it
5. Close the sheet

**Known measurement-granularity limitation**: `PerfRun` reports aggregate
stats over the whole ~57s script, not broken down per step. So while the
target matrix below reports against the full-run numbers, it can't cleanly
attribute *which* step any given dropped frame happened during (e.g.
whether a drop happened specifically during sheet open/close vs. during
expand/collapse). A future iteration could tag samples by active script
step to close this gap.

## Full scripted run — baseline numbers

From `perf-runs/run-baseline.json` (~57.2s actual duration):

| Metric | Value |
|---|---|
| p50 frame time | 8.47ms (~118 FPS) |
| p95 frame time | 32.28ms (~31 FPS) |
| Worst frame | 145.07ms |
| Frame-drop count (>22.2ms) | 317 |

## Target matrix

| Interaction | Target | Result |
|---|---|---|
| Feed idle scroll | ≥58 FPS | p50 ≈118 FPS — met, with large headroom (see 120Hz/flagship-device caveat above) |
| Bottom sheet open/close | Zero frames <45 FPS | **Not confirmed clean** — 317 frame-drops occurred somewhere across the full run; the harness can't currently attribute them to this specific step (see granularity limitation above). Worth a targeted follow-up measurement isolating just open/close. |
| Card expand/collapse | ≥55 FPS throughout | Same attribution limitation as above — p50/p95 across the whole run comfortably clear 55 FPS, but a step-isolated number wasn't captured this pass |
| AI streaming + feed scroll simultaneously | No visible jank on either surface | Feed visibly continued animating during this segment (confirmed via screenshots); no crash, no dropped-to-a-standstill behavior observed. This step is explicitly a synthetic JS-thread stress test, not representative UX (see methodology) |

## Bottleneck: nested day-highlights lazy-mount (CLAUDE.md rule #2)

**Reproduction**: temporarily removed the `expanded &&` guard in
`trip-card-details.tsx` so every one of the 120 cards' day-highlight
`ScrollView`s mounts unconditionally on load, instead of lazily only when a
card is expanded. Reverted afterward — confirmed via `git diff` that the
file is byte-identical to its pre-regression state.

**Most dramatic, directly observed effect — cold mount**: the live
`PerfOverlay` reading immediately after app launch (before any scroll):

| Build | Cold-mount FPS |
|---|---|
| Regressed (all 120 mounted) | **47 FPS** |
| Fixed (lazy, current code) | **113 FPS** |

**Full scripted-run aggregate** (`perf-runs/run-bottleneck-before.json` vs
`run-bottleneck-after.json`):

| Metric | Before (regressed) | After (fixed) | Δ |
|---|---|---|---|
| p50 frame time | 8.47ms | 8.46ms | ~unchanged |
| p95 frame time | 26.06ms | 27.82ms | no clear signal (within run-to-run noise) |
| Worst frame | 165.40ms | 122.98ms | **-25.6%** |
| Frame-drop count | 341 | 318 | **-6.7%** |

**Honest read on this data**: the effect is *front-loaded*, not a sustained
steady-state FPS floor drop on this particular flagship/120Hz device — p50
barely moves because this hardware has enough headroom to keep up with
ordinary recycled-cell rendering either way. What does move consistently in
the right direction is worst-frame-time and frame-drop-count, which matches
what the rule actually predicts ("high initial mount cost" — i.e., a
concentrated burst of expensive work, not a permanently higher per-frame
cost). p95 is noisy between the two runs and isn't a reliable
differentiator here. On genuinely mid-range hardware (this device's
opposite — see the device caveat above), I'd expect the steady-state p50/p95
gap to be far more pronounced, since there'd be much less headroom to
absorb 120 extra mounted `ScrollView`s worth of initial layout/measure work.

## Honest trade-off

**Dev-client build vs. release build for these numbers.** I ran the scripted
test against the existing dev-client build (Metro attached) rather than
building a fresh release/profile Android variant. `console.log` is
confirmed not stripped by this repo's babel config either way, so nothing
technically blocked a release-build run — the choice was about scope and
risk for a take-home: standing up a fresh release build is real added time
and, per this repo's own history (`@expo/vector-icons` needing an explicit
install, the gorhom→`@expo/ui` migration, the Reanimated/secondary-Fabric-
surface crash), new build variants in this project have not been
friction-free. The numbers above are still real on-device measurements from
physical hardware, not a simulator — just more pessimistic than a release
build's JS would be, since dev-client JS isn't optimized. Anyone re-running
`perf-test-harness.ts` against a release build should expect equal-or-better
numbers, not worse.
