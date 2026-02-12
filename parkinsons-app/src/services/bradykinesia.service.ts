import { mean, variance, slope, segmentIntervals } from '../utils/stats';
import { bradyToSeverity } from '../utils/severity';
import { saveBradyTest, getBaseline, saveBaseline } from './firebase.service';
import type { BradyTestType } from '../models/BradykinesiaTest';
import type { BradyFeatures } from '../models/BradykinesiaTest';
import type { UserBaseline, BaselineSegment } from '../models/UserBaseline';

const TEST_DURATION_MS = 30 * 1000;

export function getTestDurationMs(): number {
  return TEST_DURATION_MS;
}

export function computeFeatures(timestamps: number[], startTime: number): BradyFeatures {
  if (timestamps.length < 2) {
    return { tapFrequency: 0, interTapVariance: 0, fatigueSlope: 0 };
  }
  const intervals: number[] = [];
  for (let i = 1; i < timestamps.length; i++) {
    intervals.push((timestamps[i] - timestamps[i - 1]) / 1000);
  }
  const seg = segmentIntervals(timestamps, startTime);
  const segMeans = {
    segment0_5: seg['0_5'].length ? mean(seg['0_5']) : 0,
    segment5_10: seg['5_10'].length ? mean(seg['5_10']) : 0,
    segment10_20: seg['10_20'].length ? mean(seg['10_20']) : 0,
    segment20_30: seg['20_30'].length ? mean(seg['20_30']) : 0,
  };
  const meanInterval = mean(intervals);
  const varInterval = variance(intervals);
  const x = intervals.map((_, i) => i);
  const fatigueSlope = slope(x, intervals);
  const tapFrequency = intervals.length / (TEST_DURATION_MS / 1000);
  return {
    tapFrequency,
    interTapVariance: varInterval,
    fatigueSlope,
    ...segMeans,
  };
}

export async function finishTest(
  userId: string,
  testType: BradyTestType,
  timestamps: number[],
  startTime: number,
  isBaselineRun: boolean
): Promise<{ severity: number; features: BradyFeatures }> {
  const features = computeFeatures(timestamps, startTime);
  const intervals = timestamps.length >= 2
    ? timestamps.slice(1).map((t, i) => (t - timestamps[i]) / 1000)
    : [];
  const meanInterval = intervals.length ? mean(intervals) : 0;
  const varInterval = variance(intervals);
  const baseline = await getBaseline(userId);
  const segmentKey =
    testType === 'single'
      ? 'singleTap'
      : testType === 'alternating'
        ? 'alternatingTap'
        : 'fineMotorTap';
  const baseSeg: BaselineSegment | undefined = baseline?.[segmentKey];
  const severity = bradyToSeverity(meanInterval, varInterval, baseSeg);

  const defaultSeg = (): BaselineSegment => ({ meanInterval: 0, variance: 0, tapCount: 0 });
  if (isBaselineRun) {
    const current: UserBaseline = baseline ?? {
      userId,
      singleTap: defaultSeg(),
      alternatingTap: defaultSeg(),
      fineMotorTap: defaultSeg(),
      updatedAt: 0,
    };
    const next: UserBaseline = {
      ...current,
      [segmentKey]: { meanInterval, variance: varInterval, tapCount: timestamps.length },
      updatedAt: Date.now(),
    };
    await saveBaseline(next);
  } else {
    await saveBradyTest({
      userId,
      timestamp: startTime,
      testType,
      taps: timestamps,
      interTapIntervals: intervals,
      features,
      severity,
    });
  }

  return { severity, features };
}
