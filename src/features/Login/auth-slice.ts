import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { authApi, ResponseStatuses } from "api/todolistApi"
import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit"
import { appActions } from "app/app-slice"
import { LoginParams } from "features/Login/login"

const initialState = {
    isLoggedIn: false,
}
const createAuthSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
})
export const slice = createAuthSlice({
    name: "auth",
    initialState,
    reducers: (create) => ({
        login: create.asyncThunk(
            async (arg: LoginParams, thunkAPI) => {
                const { dispatch, rejectWithValue } = thunkAPI
                dispatch(appActions.setStatus({ status: "loading" }))
                try {
                    const res = await authApi.login(arg)
                    if (res.data.resultCode === ResponseStatuses.succeeded) {
                        dispatch(appActions.setStatus({ status: "succeeded" }))
                        return true
                    } else {
                        handleServerAppError(res.data, dispatch)
                        return rejectWithValue(null)
                    }
                } catch (error) {
                    handleServerNetworkError(error, dispatch)
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    state.isLoggedIn = action.payload
                },
            },
        ),
        me: create.asyncThunk(
            async (arg: undefined, thunkAPI) => {
                const { dispatch, rejectWithValue } = thunkAPI
                dispatch(appActions.setStatus({ status: "loading" }))
                try {
                    const res = await authApi.me()
                    if (res.data.resultCode === ResponseStatuses.succeeded) {
                        dispatch(appActions.setStatus({ status: "succeeded" }))
                        return true
                    } else {
                        dispatch(appActions.setStatus({ status: "failed" }))
                        // handleServerAppError(res.data, dispatch)
                        return rejectWithValue(null)
                    }
                } catch (error) {
                    handleServerNetworkError(error, dispatch)
                    return rejectWithValue(null)
                } finally {
                    dispatch(appActions.setIsInitialized({ isInitialized: true }))
                }
            },
            {
                fulfilled: (state, action) => {
                    state.isLoggedIn = action.payload
                },
            },
        ),
        logout: create.asyncThunk(
            async (arg: undefined, thunkAPI) => {
                const { dispatch, rejectWithValue } = thunkAPI
                dispatch(appActions.setStatus({ status: "loading" }))
                try {
                    const res = await authApi.logout()
                    if (res.data.resultCode === ResponseStatuses.succeeded) {
                        dispatch(appActions.setStatus({ status: "succeeded" }))
                        return false
                    } else {
                        handleServerAppError(res.data, dispatch)
                        return rejectWithValue(null)
                    }
                } catch (error) {
                    handleServerNetworkError(error, dispatch)
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    state.isLoggedIn = action.payload
                },
            },
        ),
    }),
})

export const authReducer = slice.reducer
export const authActions = slice.actions
