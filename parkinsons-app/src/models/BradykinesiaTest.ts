export type BradyTestType = 'single' | 'alternating' | 'fine';

export interface BradykinesiaTest {
  id: string;
  userId: string;
  timestamp: number;
  testType: BradyTestType;
  taps: number[];
  interTapIntervals: number[];
  features: BradyFeatures;
  severity: number; // 0–10
}

export interface BradyFeatures {
  tapFrequency: number;
  interTapVariance: number;
  fatigueSlope: number;
  accuracy?: number;
  segment0_5?: number;
  segment5_10?: number;
  segment10_20?: number;
  segment20_30?: number;
}

export interface BradykinesiaTestCreate {
  userId: string;
  timestamp: number;
  testType: BradyTestType;
  taps: number[];
  interTapIntervals: number[];
  features: BradyFeatures;
  severity: number;
}
