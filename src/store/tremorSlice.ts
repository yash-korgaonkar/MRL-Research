import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LiveTremorReading, TremorEvent } from '../models/TremorEvent';

interface TremorState {
    live: LiveTremorReading | null;
    isStreaming: boolean;
    history: TremorEvent[];
    lastTremorTime: number | null;
    tremorStartTime: number | null;
}

const initialState: TremorState = {
    live: null,
    isStreaming: false,
    history: [],
    lastTremorTime: null,
    tremorStartTime: null,
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
                }
                state.lastTremorTime = reading.t;
            } else if (prev?.tremor && state.tremorStartTime) {
                // Tremor just ended — duration tracked
                state.tremorStartTime = null;
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
