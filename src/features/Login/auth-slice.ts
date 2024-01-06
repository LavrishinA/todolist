import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { authApi, ResponseStatuses } from "api/todolistApi"
import { LoginParams } from "./login"
import { clearData } from "../TodolistsList/todolist-reducer"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppDispatch, AppThunk } from "app/store"
import { appActions } from "app/app-slice"

const initialState = {
    isLoggedIn: false,
}

export const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        },
    },
})

export const authReducer = slice.reducer
export const authActions = slice.actions

// thunks
export const login =
    (data: LoginParams): AppThunk =>
    async (dispatch: AppDispatch) => {
        dispatch(appActions.setStatus({ status: "loading" }))
        try {
            const res = await authApi.login(data)
            if (res.data.resultCode === ResponseStatuses.succeeded) {
                dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
                dispatch(appActions.setStatus({ status: "succeeded" }))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        } catch (e) {
            handleServerNetworkError(e as Error, dispatch)
        }
    }

export const me = (): AppThunk => async (dispatch: AppDispatch) => {
    dispatch(appActions.setStatus({ status: "loading" }))
    try {
        const res = await authApi.me()
        if (res.data.resultCode === ResponseStatuses.succeeded) {
            dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
            dispatch(appActions.setStatus({ status: "succeeded" }))
        } else {
            dispatch(appActions.setStatus({ status: "failed" }))
        }
    } catch (e) {
        handleServerNetworkError(e as Error, dispatch)
    } finally {
        dispatch(appActions.setIsInitialized({ isInitialized: true }))
    }
}

export const logout = (): AppThunk => async (dispatch: AppDispatch) => {
    dispatch(appActions.setStatus({ status: "loading" }))
    try {
        const res = await authApi.logout()
        if (res.data.resultCode === ResponseStatuses.succeeded) {
            dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
            dispatch(appActions.setStatus({ status: "succeeded" }))
            dispatch(clearData())
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e as Error, dispatch)
    }
}
