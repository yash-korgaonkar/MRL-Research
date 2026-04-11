import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LiveTremorReading, TremorEvent } from '../models/TremorEvent';

interface TremorState {
    live: LiveTremorReading | null;
    isStreaming: boolean;
    history: TremorEvent[];
    lastTremorTime: number | null;
    tremorStartTime: number | null;
    currentTremorStats: { count: number, sumFreq: number, sumRms: number, maxSev: number } | null;
}

const initialState: TremorState = {
    live: null,
    isStreaming: false,
    history: [],
    lastTremorTime: null,
    tremorStartTime: null,
    currentTremorStats: null,
};

const tremorSlice = createSlice({
    name: 'tremor',
    initialState,
    reducers: {
        updateLiveReading(state, action: PayloadAction<LiveTremorReading>) {
            const reading = action.payload;
            const prev = state.live;

            state.live = reading;
            state.isStreaming = true;

            if (reading.tremor) {
                if (!prev?.tremor) {
                    state.tremorStartTime = reading.t;
                    state.currentTremorStats = { count: 0, sumFreq: 0, sumRms: 0, maxSev: 0 };
                }
                if (state.currentTremorStats) {
                    state.currentTremorStats.count += 1;
                    state.currentTremorStats.sumFreq += reading.freq;
                    state.currentTremorStats.sumRms += reading.rms;
                    state.currentTremorStats.maxSev = Math.max(state.currentTremorStats.maxSev, reading.sev);
                }
                state.lastTremorTime = reading.t;
            } else if (prev?.tremor && state.tremorStartTime) {
                // Tremor just ended — duration tracked
                const durationSec = (reading.t - state.tremorStartTime) / 1000;
                
                if (durationSec >= 1 && state.currentTremorStats && state.currentTremorStats.count > 0) {
                    const avgFreq = state.currentTremorStats.sumFreq / state.currentTremorStats.count;
                    const avgRms = state.currentTremorStats.sumRms / state.currentTremorStats.count;
                    
                    const newEvent: TremorEvent = {
                        id: `event-${Date.now()}`,
                        userId: 'local',
                        timestamp: state.tremorStartTime,
                        durationSec: durationSec,
                        frequencyHz: avgFreq,
                        rms: avgRms,
                        severity: Math.round(state.currentTremorStats.maxSev),
                        probability: 1, // Placeholder
                    };
                    state.history.unshift(newEvent);
                }

                state.tremorStartTime = null;
                state.currentTremorStats = null;
            }
        },
        setStreamingStatus(state, action: PayloadAction<boolean>) {
            state.isStreaming = action.payload;
        },
        setHistory(state, action: PayloadAction<TremorEvent[]>) {
            state.history = action.payload;
        },
        addEvent(state, action: PayloadAction<TremorEvent>) {
            state.history.unshift(action.payload);
        },
        clearLive(state) {
            state.live = null;
            state.isStreaming = false;
            state.tremorStartTime = null;
            state.currentTremorStats = null;
        },
    },
});

export const {
    updateLiveReading,
    setStreamingStatus,
    setHistory,
    addEvent,
    clearLive,
} = tremorSlice.actions;
export default tremorSlice.reducer;
