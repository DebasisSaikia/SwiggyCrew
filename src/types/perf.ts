export interface FrameSample {
  timestamp: number;
  frameTimeMs: number;
  jsThreadBusy: boolean;
}

export interface PerfRun {
  id: string;
  startedAt: number;
  endedAt: number;
  p50FrameTimeMs: number;
  p95FrameTimeMs: number;
  worstFrameTimeMs: number;
  frameDropCount: number;
  overlayVisible: boolean;
}
