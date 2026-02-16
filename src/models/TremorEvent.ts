export interface TremorEvent {
    id?: string;
    userId: string;
    timestamp: number;
    durationSec: number;
    frequencyHz: number;
    rms: number;
    severity: number;
    probability: number;
}

export interface LiveTremorReading {
    t: number;
    tremor: boolean;
    freq: number;
    rms: number;
    sev: number;
    p: number;
    source?: 'live' | 'mock';
}
