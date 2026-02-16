import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    uid: string | null;
    email: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    uid: null,
    email: null,
    isAuthenticated: false,
    loading: true,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<{ uid: string; email: string }>) {
            state.uid = action.payload.uid;
            state.email = action.payload.email;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },
        clearUser(state) {
            state.uid = null;
            state.email = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.loading = false;
        },
        clearError(state) {
            state.error = null;
        },
    },
});

export const { setUser, clearUser, setLoading, setError, clearError } = authSlice.actions;
export default authSlice.reducer;
