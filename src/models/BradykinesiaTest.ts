export type TestType = 'single' | 'alternating' | 'fine';

export interface SegmentFeatures {
    rangeLabel: string;
    tapFrequency: number;
    interTapVariance: number;
    fatigueSlopePerSec: number;
    accuracy?: number;
}

export interface BradykinesiaTest {
    id?: string;
    userId: string;
    timestamp: number;
    testType: TestType;
    taps: number;
    interTapIntervals: number[];
    features: SegmentFeatures[];
    severity: number;
}
