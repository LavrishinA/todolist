import { RequestStatus } from "app/app-slice"
import { asyncThunkCreator, buildCreateSlice, isRejected, PayloadAction } from "@reduxjs/toolkit"
import { FilterType, ResponseStatuses } from "shared/lib"
import { TodolistApi, TodolistItemArgs } from "../api"
import { authActions } from "features/Login"

const createTodolistSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
})
const initialState: TodolistUI[] = []

const slice = createTodolistSlice({
    name: "todolist",
    initialState,
    reducers: (create) => ({
        updateEntityStatus: create.reducer((state, action: PayloadAction<{ id: string; status: RequestStatus }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) state[index].entityStatus = action.payload.status
        }),
        updateFilter: create.reducer((state, action: PayloadAction<{ id: string; filter: FilterType }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) state[index].filter = action.payload.filter
        }),
        fetchTodolists: create.asyncThunk(
            async (_arg: undefined) => {
                const res = await TodolistApi.getTodolists()
                return res.data
            },
            {
                fulfilled: (state, action) => {
                    return action.payload.map((tl) => ({ ...tl, filter: FilterType.All, entityStatus: "idle" }))
                },
            },
        ),
        createTodolist: create.asyncThunk(
            async (arg: string, thunkAPI) => {
                const { rejectWithValue } = thunkAPI
                const res = await TodolistApi.createTodolist(arg)
                if (res.data.resultCode === ResponseStatuses.succeeded) {
                    return res.data.data.item as TodolistItemArgs
                } else {
                    return rejectWithValue(res.data)
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
                dispatch(todolistActions.updateEntityStatus({ id, status: "loading" }))
                const res = await TodolistApi.deleteTodolist(id)
                if (res.data.resultCode === ResponseStatuses.succeeded) {
                    return id
                } else {
                    return rejectWithValue(res.data)
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

                dispatch(todolistActions.updateEntityStatus({ id: arg.id, status: "loading" }))

                const res = await TodolistApi.updateTodolist(arg.id, arg.title)
                if (res.data.resultCode === ResponseStatuses.succeeded) {
                    dispatch(todolistActions.updateEntityStatus({ id: arg.id, status: "succeeded" }))
                    return arg
                } else {
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
        builder
            .addCase(authActions.logout.fulfilled, () => {
                return []
            })
            .addMatcher(isRejected(todolistActions.deleteTodolist), (state, action) => {
                const todo = state.find((todo) => todo.id === action.meta.arg)
                if (todo) {
                    todo.entityStatus = "idle"
                }
            })
    },
    selectors: {
        todolists: (state) => state,
    },
})

export const todolistReducer = slice.reducer
export const todolistActions = slice.actions
export const todolistSelectors = slice.selectors

//types
export type TodolistUI = TodolistItemArgs & {
    filter: FilterType
    entityStatus: RequestStatus
}
