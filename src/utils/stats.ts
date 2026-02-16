export function mean(arr: number[]): number {
    if (arr.length === 0) return 0;
    return arr.reduce((sum, v) => sum + v, 0) / arr.length;
}

export function variance(arr: number[]): number {
    if (arr.length < 2) return 0;
    const m = mean(arr);
    return arr.reduce((sum, v) => sum + (v - m) ** 2, 0) / (arr.length - 1);
}

export function standardDeviation(arr: number[]): number {
    return Math.sqrt(variance(arr));
}

export function slope(arr: number[]): number {
    if (arr.length < 2) return 0;
    const n = arr.length;
    const xMean = (n - 1) / 2;
    const yMean = mean(arr);
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
        num += (i - xMean) * (arr[i] - yMean);
        den += (i - xMean) ** 2;
    }
    return den === 0 ? 0 : num / den;
}

export interface TapSegment {
    rangeLabel: string;
    startMs: number;
    endMs: number;
    timestamps: number[];
}

export function segmentTaps(
    timestamps: number[],
    durationMs: number = 30000
): TapSegment[] {
    const segments: TapSegment[] = [
        { rangeLabel: '0-5s', startMs: 0, endMs: 5000, timestamps: [] },
        { rangeLabel: '5-10s', startMs: 5000, endMs: 10000, timestamps: [] },
        { rangeLabel: '10-20s', startMs: 10000, endMs: 20000, timestamps: [] },
        { rangeLabel: '20-30s', startMs: 20000, endMs: 30000, timestamps: [] },
    ];

    const baseTime = timestamps[0] || 0;
    for (const t of timestamps) {
        const elapsed = t - baseTime;
        for (const seg of segments) {
            if (elapsed >= seg.startMs && elapsed < seg.endMs) {
                seg.timestamps.push(t);
                break;
            }
        }
    }

    return segments;
}

export function interTapIntervals(timestamps: number[]): number[] {
    const intervals: number[] = [];
    for (let i = 1; i < timestamps.length; i++) {
        intervals.push(timestamps[i] - timestamps[i - 1]);
    }
    return intervals;
}
