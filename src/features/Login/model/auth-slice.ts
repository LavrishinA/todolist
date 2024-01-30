import { asyncThunkCreator, buildCreateSlice, isAnyOf } from "@reduxjs/toolkit"
import { ResponseStatuses } from "shared/lib"
import { authApi, LoginParams } from "features/Login/api/authApi"
import { appActions } from "app/app-slice"

const initialState = {
    isLoggedIn: false as boolean,
}

const createAuthSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
})

const slice = createAuthSlice({
    name: "auth",
    initialState,
    reducers: (create) => ({
        login: create.asyncThunk(async (arg: LoginParams, thunkAPI) => {
            const { rejectWithValue } = thunkAPI
            const res = await authApi.login(arg)
            if (res.data.resultCode === ResponseStatuses.succeeded) {
                return true
            } else {
                return rejectWithValue(res.data)
            }
        }),
        me: create.asyncThunk(async (arg: undefined, thunkAPI) => {
            const { dispatch, rejectWithValue } = thunkAPI

            const res = await authApi.me().finally(() => {
                dispatch(appActions.setIsInitialized({ isInitialized: true }))
            })
            if (res.data.resultCode === ResponseStatuses.succeeded) {
                return true
            } else {
                return rejectWithValue(res.data)
            }
        }),
        logout: create.asyncThunk(async (_arg: undefined, thunkAPI) => {
            const { rejectWithValue } = thunkAPI

            const res = await authApi.logout()
            if (res.data.resultCode === ResponseStatuses.succeeded) {
                return false
            } else {
                return rejectWithValue(res.data)
            }
        }),
    }),
    extraReducers: (builder) => {
        builder.addMatcher(
            isAnyOf(authActions.logout.fulfilled, authActions.me.fulfilled, authActions.login.fulfilled),
            (state, action) => {
                state.isLoggedIn = action.payload
            },
        )
    },
    selectors: {
        isLoggedIn: (state) => state.isLoggedIn,
    },
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authSelectors = slice.selectors
