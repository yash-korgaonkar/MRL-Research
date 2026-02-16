import { SegmentFeatures } from '../models/BradykinesiaTest';
import { BaselineMetrics } from '../models/UserBaseline';
import { mean, variance, slope, segmentTaps, interTapIntervals } from './stats';

export function computeSegmentFeatures(
    timestamps: number[],
    segmentDurationMs: number
): SegmentFeatures {
    const itis = interTapIntervals(timestamps);
    const tapFreq = timestamps.length / (segmentDurationMs / 1000);
    const itiVar = variance(itis);
    const fatigueSlope = slope(itis);

    return {
        rangeLabel: '',
        tapFrequency: tapFreq,
        interTapVariance: itiVar,
        fatigueSlopePerSec: fatigueSlope,
    };
}

export function extractAllFeatures(
    allTimestamps: number[]
): SegmentFeatures[] {
    const segments = segmentTaps(allTimestamps, 30000);
    return segments.map((seg) => {
        const segDuration = seg.endMs - seg.startMs;
        const features = computeSegmentFeatures(seg.timestamps, segDuration);
        features.rangeLabel = seg.rangeLabel;
        return features;
    });
}

export function computeBradykinesiaSeverity(
    features: SegmentFeatures[],
    baseline: BaselineMetrics | null
): number {
    if (features.length === 0) return 0;

    const avgFreq = mean(features.map((f) => f.tapFrequency));
    const avgVar = mean(features.map((f) => f.interTapVariance));
    const avgSlope = mean(features.map((f) => f.fatigueSlopePerSec));

    if (!baseline) {
        // No baseline: use absolute heuristics
        const freqScore = Math.max(0, Math.min(10, 10 - avgFreq));
        const varScore = Math.min(10, avgVar / 50);
        const slopeScore = Math.min(10, Math.abs(avgSlope) * 100);
        return Math.round(Math.min(10, (freqScore + varScore + slopeScore) / 3));
    }

    // Relative to baseline
    const freqDegradation = Math.max(
        0,
        (baseline.avgTapFrequency - avgFreq) / baseline.avgTapFrequency
    );
    const varIncrease = baseline.avgInterTapVariance > 0
        ? Math.max(0, (avgVar - baseline.avgInterTapVariance) / baseline.avgInterTapVariance)
        : 0;
    const slopeIncrease = Math.abs(avgSlope) - Math.abs(baseline.avgFatigueSlope);

    const rawScore =
        freqDegradation * 4 +
        Math.min(1, varIncrease) * 3 +
        Math.min(1, Math.max(0, slopeIncrease) * 10) * 3;

    return Math.round(Math.max(0, Math.min(10, rawScore)));
}

export function severityLabel(score: number): string {
    if (score <= 3) return 'Mild';
    if (score <= 6) return 'Moderate';
    return 'Severe';
}
