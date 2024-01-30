import { AnyAction, createSlice, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
    isInitialized: false,
    status: "idle" as RequestStatus,
    error: null as string | null,
}

const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        },
    },

    extraReducers: (builder) => {
        builder
            .addMatcher(isPending, (state) => {
                state.status = "loading"
            })
            .addMatcher(isFulfilled, (state) => {
                state.status = "succeeded"
            })
            .addMatcher(isRejected, (state, action: AnyAction) => {
                state.status = "failed"
                if (action.payload) {
                    if (action.type === "auth/me/rejected") return
                    state.error = action.payload.messages[0]
                } else {
                    state.error = action.error.message ? action.error.message : "Some error occurred"
                }
            })
    },
    selectors: {
        status: (state) => state.status,
        appError: (state) => state.error,
        isInitialized: (status) => status.isInitialized,
    },
})

export const appReducer = slice.reducer
export const appActions = slice.actions
export const appSelectors = slice.selectors
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"
