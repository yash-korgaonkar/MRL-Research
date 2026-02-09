export interface UserBaseline {
  userId: string;
  singleTap: BaselineSegment;
  alternatingTap: BaselineSegment;
  fineMotorTap: BaselineSegment;
  updatedAt: number;
}

export interface BaselineSegment {
  meanInterval: number;
  variance: number;
  tapCount: number;
}
