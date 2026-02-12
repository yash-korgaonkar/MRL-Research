export interface TremorEvent {
  id: string;
  userId: string;
  timestamp: number; // Unix ms
  durationSec: number;
  frequencyHz: number;
  rms: number;
  severity: number; // 0–10
  probability: number;
}

export interface TremorEventCreate {
  userId: string;
  timestamp: number;
  durationSec: number;
  frequencyHz: number;
  rms: number;
  severity: number;
  probability: number;
}
