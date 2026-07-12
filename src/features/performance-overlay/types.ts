export type PerformanceSnapshot = {
  fps: number;
  frameDropCount: number;
  /** All-time worst single-frame duration (ms) recorded this session — unbounded, exact. */
  worstFrameMs: number;
  /** p50 frame duration (ms) over the rolling sample window. */
  p50Ms: number;
  /** p95 frame duration (ms) over the rolling sample window. */
  p95Ms: number;
};
