import type { FlashListRef } from '@shopify/flash-list';
import type { RefObject } from 'react';

import { getCardToggle } from '@/utils/card-expand-registry';
import { computeFrameStats } from '@/utils/perf-math';
import { startGlobalRecording, stopGlobalRecording } from '@/utils/perf-recorder';
import { useChatStore } from '@/store/chat-store';
import { useFeedStore } from '@/store/feed-store';
import type { ChatMessage } from '@/types/chat';
import type { PerfRun } from '@/types/perf';
import type { TripBundle } from '@/types/trip';

/**
 * Debug-only, reproducible scripted performance test — drives the app
 * programmatically instead of manual swipes, so runs are comparable
 * before/after a change. Mirrors the Architecture doc's 5-step ~60s
 * sequence. Real device/dev-client build only (imperative store + ref
 * access, not a headless script) — see PERFORMANCE.md for methodology.
 *
 * Step 3 can only reach the sheet's "half" (index 0) state — @expo/ui's
 * BottomSheetModal exposes only present()/dismiss(), no imperative
 * snap-to-full method (it's native chrome), so "drag to full" isn't
 * scriptable and isn't faked here.
 *
 * Step 4 is a synthetic JS-thread stress test, not a representative user
 * flow — a real user can't see/scroll the feed while the sheet covers it.
 */

const IDLE_SCROLL_MS = 30_000;
const SCROLL_STEP_MS = 300;
const SCROLL_MAX_OFFSET_GUESS = 20_000; // overshoots on purpose; FlashList clamps to real content size

const EXPAND_ITERATIONS = 3;
const EXPAND_SETTLE_MS = 500; // let onScroll->JS index catch up before reading it
const EXPAND_HOLD_MS = 800; // time spent expanded before collapsing again

const SHEET_OPEN_SETTLE_MS = 1000;
const MESSAGE_SCROLL_MS = 20_000;
const SHEET_CLOSE_SETTLE_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createMessageId() {
  return `perf-test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Sawtooth scroll: oscillates offset 0 -> guess -> 0 for `durationMs`, stepping every `SCROLL_STEP_MS`. */
async function sawtoothScroll(listRef: RefObject<FlashListRef<TripBundle> | null>, durationMs: number) {
  const steps = Math.floor(durationMs / SCROLL_STEP_MS);
  for (let i = 0; i < steps; i++) {
    const progress = (i % (steps / 2)) / (steps / 2);
    const goingDown = Math.floor(i / (steps / 2)) % 2 === 0;
    const offset = (goingDown ? progress : 1 - progress) * SCROLL_MAX_OFFSET_GUESS;
    listRef.current?.scrollToOffset({ offset, animated: true });
    await sleep(SCROLL_STEP_MS);
  }
}

async function expandCollapseCycle(listRef: RefObject<FlashListRef<TripBundle> | null>, data: TripBundle[]) {
  await sleep(EXPAND_SETTLE_MS);
  const index = listRef.current?.getFirstVisibleIndex() ?? -1;
  const trip = index >= 0 && index < data.length ? data[index] : undefined;
  const toggle = trip ? getCardToggle(trip.id) : undefined;

  if (!toggle) return; // card not currently registered (e.g. recycled mid-settle) — skip this cycle rather than throw

  toggle(); // expand
  await sleep(EXPAND_HOLD_MS);
  toggle(); // collapse
}

function pushScriptedMessage() {
  const now = Date.now();
  const userMessage: ChatMessage = {
    id: createMessageId(),
    role: 'user',
    content: 'What can you tell me about this trip?',
    status: 'complete',
    createdAt: now,
  };
  const assistantMessage: ChatMessage = {
    id: createMessageId(),
    role: 'assistant',
    content: '',
    status: 'streaming',
    createdAt: now,
  };
  useChatStore.getState().addMessage(userMessage);
  useChatStore.getState().addMessage(assistantMessage);
}

export async function runPerfScript(listRef: RefObject<FlashListRef<TripBundle> | null>, data: TripBundle[]): Promise<PerfRun> {
  const startedAt = Date.now();
  startGlobalRecording();

  // 1. Idle scroll
  await sawtoothScroll(listRef, IDLE_SCROLL_MS);

  // 2. Expand/collapse x3
  for (let i = 0; i < EXPAND_ITERATIONS; i++) {
    await expandCollapseCycle(listRef, data);
  }

  // 3. Open sheet (half only — see file doc comment)
  useFeedStore.getState().openSheet();
  await sleep(SHEET_OPEN_SETTLE_MS);

  // 4. Message + concurrent scroll (synthetic JS-thread stress test)
  pushScriptedMessage();
  await sawtoothScroll(listRef, MESSAGE_SCROLL_MS);

  // 5. Close sheet
  useFeedStore.getState().closeSheet();
  await sleep(SHEET_CLOSE_SETTLE_MS);

  const samples = stopGlobalRecording();
  const endedAt = Date.now();
  const stats = computeFrameStats(samples);

  return {
    id: `run-${startedAt}`,
    startedAt,
    endedAt,
    p50FrameTimeMs: stats.p50FrameTimeMs,
    p95FrameTimeMs: stats.p95FrameTimeMs,
    worstFrameTimeMs: stats.worstFrameTimeMs,
    frameDropCount: stats.frameDropCount,
    overlayVisible: true,
  };
}
