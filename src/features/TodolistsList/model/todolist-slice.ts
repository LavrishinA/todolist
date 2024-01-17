import { todolistApi, TodolistItemArgs } from "features/TodolistsList/api/todolistApi"
import { appActions, RequestStatusType } from "app/app-slice"
import { handleServerAppError, handleServerNetworkError } from "shared/lib/error-utils"
import { asyncThunkCreator, buildCreateSlice, PayloadAction } from "@reduxjs/toolkit"
import { authActions } from "features/Login/model/auth-slice"
import { FilterType, ResponseStatuses } from "shared/lib"

const createTodolistSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
})
const initialState: TodolistUI[] = []

const slice = createTodolistSlice({
    name: "todolist",
    initialState,
    reducers: (create) => ({
        updateEntityStatus: create.reducer((state, action: PayloadAction<{ id: string; status: RequestStatusType }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) state[index].entityStatus = action.payload.status
        }),
        updateFilter: create.reducer((state, action: PayloadAction<{ id: string; filter: FilterType }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) state[index].filter = action.payload.filter
        }),
        fetchTodolists: create.asyncThunk(
            async (arg: undefined, thunkAPI) => {
                const { dispatch, rejectWithValue } = thunkAPI
                dispatch(appActions.setStatus({ status: "loading" }))
                try {
                    const res = await todolistApi.getTodolists()
                    dispatch(appActions.setStatus({ status: "succeeded" }))
                    return res.data as TodolistItemArgs[]
                } catch (error) {
                    handleServerNetworkError(error, dispatch)
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    return action.payload.map((tl) => ({ ...tl, filter: FilterType.All, entityStatus: "idle" }))
                },
            },
        ),
        createTodolist: create.asyncThunk(
            async (arg: string, thunkAPI) => {
                const { dispatch, rejectWithValue } = thunkAPI
                dispatch(appActions.setStatus({ status: "loading" }))
                try {
                    const res = await todolistApi.createTodolist(arg)
                    if (res.data.resultCode === ResponseStatuses.succeeded) {
                        dispatch(appActions.setStatus({ status: "succeeded" }))
                        return res.data.data.item as TodolistItemArgs
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
                    state.unshift({ ...action.payload, filter: FilterType.All, entityStatus: "idle" })
                },
            },
        ),
        deleteTodolist: create.asyncThunk(
            async (id: string, thunkAPI) => {
                const { dispatch, rejectWithValue } = thunkAPI
                dispatch(appActions.setStatus({ status: "loading" }))
                dispatch(todolistActions.updateEntityStatus({ id, status: "loading" }))
                try {
                    const res = await todolistApi.deleteTodolist(id)
                    if (res.data.resultCode === ResponseStatuses.succeeded) {
                        dispatch(appActions.setStatus({ status: "succeeded" }))
                        return id
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
                    const index = state.findIndex((todo) => todo.id === action.payload)
                    if (index !== -1) state.splice(index, 1)
                },
            },
        ),
        updateTodolist: create.asyncThunk(
            async (arg: { id: string; title: string }, thunkAPI) => {
                const { dispatch, rejectWithValue } = thunkAPI
                dispatch(appActions.setStatus({ status: "loading" }))
                dispatch(todolistActions.updateEntityStatus({ id: arg.id, status: "loading" }))
                try {
                    const res = await todolistApi.updateTodolist(arg.id, arg.title)
                    if (res.data.resultCode === ResponseStatuses.succeeded) {
                        dispatch(appActions.setStatus({ status: "succeeded" }))
                        dispatch(todolistActions.updateEntityStatus({ id: arg.id, status: "succeeded" }))
                        return arg
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
                    const index = state.findIndex((todo) => todo.id === action.payload.id)
                    if (index !== -1) state[index].title = action.payload.title
                },
            },
        ),
    }),
    extraReducers: (builder) => {
        builder.addCase(authActions.logout.fulfilled, () => {
            return []
        })
    },
})

export const todolistReducer = slice.reducer
export const todolistActions = slice.actions

//types
export type TodolistUI = TodolistItemArgs & {
    filter: FilterType
    entityStatus: RequestStatusType
}
