import { ResponseStatuses, todolistApi, TodolistItemArgs } from "api/todolistApi"
import { appActions, RequestStatusType } from "app/app-slice"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { AppDispatch, AppThunk } from "app/store"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: TodolistUI[] = []

export enum FilterType {
    All = "all",
    Active = "active",
    Completed = "completed",
}

const slice = createSlice({
    name: "todolist",
    initialState,
    reducers: {
        read: (state, action: PayloadAction<TodolistItemArgs[]>) => {
            // return action.payload.map((tl) => ({ ...tl, filter: FilterType.All, entityStatus: "idle" }))
            action.payload.forEach((tl) => state.push({ ...tl, filter: FilterType.All, entityStatus: "idle" }))
        },
        create: (state, action: PayloadAction<TodolistItemArgs>) => {
            state.unshift({ ...action.payload, filter: FilterType.All, entityStatus: "idle" })
        },
        delete: (state, action: PayloadAction<string>) => {
            const index = state.findIndex((todo) => todo.id === action.payload)
            if (index !== -1) state.splice(index, 1)
        },
        updateEntityStatus: (state, action: PayloadAction<{ id: string; status: RequestStatusType }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) state[index].entityStatus = action.payload.status
        },
        updateTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) state[index].title = action.payload.title
        },
        updateFilter: (state, action: PayloadAction<{ id: string; filter: FilterType }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) state[index].filter = action.payload.filter
        },
        clearData: () => {
            return []
        },
    },
})

export const todolistReducer = slice.reducer
export const todolistActions = slice.actions

//thunks
export const thunkSetTodolist = (): AppThunk => (dispatch: AppDispatch) => {
    dispatch(appActions.setStatus({ status: "loading" }))
    todolistApi.getTodolists().then((res) => {
        dispatch(todolistActions.read(res.data))
        dispatch(appActions.setStatus({ status: "succeeded" }))
    })
}

export const thunkCreateTodolist =
    (title: string): AppThunk =>
    (dispatch: AppDispatch) => {
        dispatch(appActions.setStatus({ status: "loading" }))
        todolistApi
            .createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === ResponseStatuses.succeeded) {
                    dispatch(todolistActions.create(res.data.data.item))
                    dispatch(appActions.setStatus({ status: "succeeded" }))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((e) => {
                handleServerNetworkError(e, dispatch)
            })
    }

export const thunkDeleteTodolist =
    (id: string): AppThunk =>
    (dispatch: AppDispatch) => {
        dispatch(appActions.setStatus({ status: "loading" }))
        dispatch(todolistActions.updateEntityStatus({ id, status: "loading" }))
        todolistApi
            .deleteTodolist(id)
            .then((res) => {
                if (res.data.resultCode === ResponseStatuses.succeeded) {
                    dispatch(todolistActions.delete(id))
                    dispatch(appActions.setStatus({ status: "succeeded" }))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((e) => {
                handleServerNetworkError(e, dispatch)
            })
    }

export const thunkUpdateTodolist =
    (id: string, title: string): AppThunk =>
    (dispatch: AppDispatch) => {
        dispatch(appActions.setStatus({ status: "loading" }))
        dispatch(todolistActions.updateEntityStatus({ id, status: "loading" }))
        todolistApi
            .updateTodolist(id, title)
            .then((res) => {
                if (res.data.resultCode === ResponseStatuses.succeeded) {
                    dispatch(todolistActions.updateTitle({ id, title }))
                    dispatch(appActions.setStatus({ status: "succeeded" }))
                    dispatch(todolistActions.updateEntityStatus({ id, status: "succeeded" }))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((e) => {
                handleServerNetworkError(e, dispatch)
            })
    }

//types
export type TodolistUI = TodolistItemArgs & {
    filter: FilterType
    entityStatus: RequestStatusType
}
