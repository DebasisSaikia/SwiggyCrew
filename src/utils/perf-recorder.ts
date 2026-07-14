import type { FpsMeter } from '@/utils/fps-meter';
import type { FrameSample } from '@/types/perf';

/**
 * Lets code outside PerfOverlay (the scripted test harness) reach the one
 * live FpsMeter instance to start/stop a full-session recording. A narrow
 * imperative surface, not a raw ref — the harness can't call meter.start()/
 * stop() through here and fight PerfOverlay's own mount/unmount lifecycle.
 *
 * Deliberately NOT __DEV__-gated: PerfOverlay itself runs unconditionally in
 * _layout.tsx, and this is inert data (unlike PerfOverlay's actively unsafe
 * blockJsThreadForMs), so gating this module would tree-shake it out of
 * exactly the release-profile build the scripted test is meant to run
 * against. Deliberately not a Zustand store either — nothing needs to
 * subscribe to the meter, and CLAUDE.md scopes this repo to two narrow
 * stores for feed/chat state, not a place for an unrelated imperative handle.
 */
let activeMeter: FpsMeter | null = null;

export function setActiveMeter(meter: FpsMeter | null) {
  activeMeter = meter;
}

export function startGlobalRecording() {
  activeMeter?.startRecording();
}

export function stopGlobalRecording(): FrameSample[] {
  return activeMeter?.stopRecording() ?? [];
}
