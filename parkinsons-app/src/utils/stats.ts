/**
 * Basic stats for tremor and bradykinesia feature extraction.
 */
export function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function variance(arr: number[]): number {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const sq = arr.map((x) => (x - m) ** 2);
  return mean(sq);
}

export function std(arr: number[]): number {
  return Math.sqrt(variance(arr));
}

/**
 * Linear regression slope (e.g. fatigue over time).
 */
export function slope(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);
  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return 0;
  return (n * sumXY - sumX * sumY) / denom;
}

/**
 * Segment timestamps into buckets (0–5s, 5–10s, 10–20s, 20–30s).
 */
export function segmentIntervals(
  timestamps: number[],
  startTime: number
): { '0_5': number[]; '5_10': number[]; '10_20': number[]; '20_30': number[] } {
  const rel = timestamps.map((t) => (t - startTime) / 1000);
  const seg = { '0_5': [] as number[], '5_10': [] as number[], '10_20': [] as number[], '20_30': [] as number[] };
  for (let i = 1; i < rel.length; i++) {
    const interval = (timestamps[i] - timestamps[i - 1]) / 1000;
    if (rel[i] <= 5) seg['0_5'].push(interval);
    else if (rel[i] <= 10) seg['5_10'].push(interval);
    else if (rel[i] <= 20) seg['10_20'].push(interval);
    else if (rel[i] <= 30) seg['20_30'].push(interval);
  }
  return seg;
}
