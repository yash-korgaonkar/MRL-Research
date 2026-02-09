/**
 * Severity 0–10 to label. No medical jargon.
 */
export function severityLabel(severity: number): 'Mild' | 'Moderate' | 'Severe' {
  if (severity <= 3) return 'Mild';
  if (severity <= 6) return 'Moderate';
  return 'Severe';
}

export function severityColor(severity: number): string {
  if (severity <= 3) return '#3FB950'; // success
  if (severity <= 6) return '#D29922'; // warning
  return '#F85149'; // tremorActive
}

/**
 * Map raw tremor/brady metrics to 0–10 using baseline (when available).
 */
export function tremorToSeverity(rms: number, frequencyHz: number, _baseline?: unknown): number {
  // Simple heuristic; can be replaced with baseline-relative scoring
  const rmsNorm = Math.min(1, rms / 1.5);
  const freqNorm = Math.min(1, Math.abs(frequencyHz - 5) / 5);
  const raw = (rmsNorm * 0.6 + freqNorm * 0.4) * 10;
  return Math.round(Math.min(10, Math.max(0, raw)));
}

export function bradyToSeverity(
  meanInterval: number,
  variance: number,
  baseline?: { meanInterval: number; variance: number }
): number {
  if (!baseline) {
    const raw = (meanInterval / 500) * 3 + (variance / 10000);
    return Math.round(Math.min(10, Math.max(0, raw * 2)));
  }
  const ratio = meanInterval / baseline.meanInterval;
  const varRatio = variance / (baseline.variance || 1);
  const raw = (ratio - 1) * 3 + (varRatio - 1) * 2;
  return Math.round(Math.min(10, Math.max(0, raw * 2)));
}
