export interface BaselineMetrics {
    avgTapFrequency: number;
    avgInterTapVariance: number;
    avgFatigueSlope: number;
}

export interface UserBaseline {
    userId: string;
    singleTap: BaselineMetrics;
    alternatingTap: BaselineMetrics;
    fineMotorTap: BaselineMetrics;
    createdAt: number;
}
