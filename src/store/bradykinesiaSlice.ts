import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BradykinesiaTest, TestType } from '../models/BradykinesiaTest';
import { UserBaseline } from '../models/UserBaseline';

interface BradykinesiaState {
    currentTestType: TestType | null;
    isRunning: boolean;
    tapTimestamps: number[];
    tapSide: ('left' | 'right')[];
    history: BradykinesiaTest[];
    baseline: UserBaseline | null;
    lastResult: BradykinesiaTest | null;
}

const initialState: BradykinesiaState = {
    currentTestType: null,
    isRunning: false,
    tapTimestamps: [],
    tapSide: [],
    history: [],
    baseline: null,
    lastResult: null,
};

const bradykinesiaSlice = createSlice({
    name: 'bradykinesia',
    initialState,
    reducers: {
        startTest(state, action: PayloadAction<TestType>) {
            state.currentTestType = action.payload;
            state.isRunning = true;
            state.tapTimestamps = [];
            state.tapSide = [];
            state.lastResult = null;
        },
        recordTap(state, action: PayloadAction<{ timestamp: number; side?: 'left' | 'right' }>) {
            state.tapTimestamps.push(action.payload.timestamp);
            if (action.payload.side) {
                state.tapSide.push(action.payload.side);
            }
        },
        finishTest(state) {
            state.isRunning = false;
        },
        setLastResult(state, action: PayloadAction<BradykinesiaTest>) {
            state.lastResult = action.payload;
            state.history.unshift(action.payload);
        },
        setHistory(state, action: PayloadAction<BradykinesiaTest[]>) {
            state.history = action.payload;
        },
        setBaseline(state, action: PayloadAction<UserBaseline | null>) {
            state.baseline = action.payload;
        },
        resetTest(state) {
            state.currentTestType = null;
            state.isRunning = false;
            state.tapTimestamps = [];
            state.tapSide = [];
        },
    },
});

export const {
    startTest,
    recordTap,
    finishTest,
    setLastResult,
    setHistory,
    setBaseline,
    resetTest,
} = bradykinesiaSlice.actions;
export default bradykinesiaSlice.reducer;
