import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
    isInitialized: false,
    status: "idle" as RequestStatusType,
    error: null as string | null,
}

const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        },
    },
})

export const appReducer = slice.reducer
export const appActions = slice.actions

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
