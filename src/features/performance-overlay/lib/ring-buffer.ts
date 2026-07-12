/**
 * Fixed-capacity circular buffer of frame durations, mutated in place from
 * inside the UI-thread frame-callback worklet (see use-frame-stats.ts).
 * Bounding capacity keeps the periodic snapshot-and-sort cheap regardless of
 * how long the overlay has been running.
 */
export type RingBufferState = {
  values: number[];
  writeIndex: number;
  filledCount: number;
};

export function createRingBufferState(capacity: number): RingBufferState {
  'worklet';
  return {
    values: new Array<number>(capacity).fill(0),
    writeIndex: 0,
    filledCount: 0,
  };
}

export function ringBufferPush(state: RingBufferState, capacity: number, value: number): void {
  'worklet';
  state.values[state.writeIndex] = value;
  state.writeIndex = (state.writeIndex + 1) % capacity;
  state.filledCount = Math.min(state.filledCount + 1, capacity);
}

export function ringBufferSnapshot(state: RingBufferState): number[] {
  'worklet';
  return state.values.slice(0, state.filledCount);
}
