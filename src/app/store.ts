import { tasksReducer } from "features/TodolistsList/task-reducer"
import { todolistReducer } from "features/TodolistsList/todolist-reducer"
import { appReducer } from "app/app-slice"
import { authReducer } from "features/Login/auth-slice"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { configureStore, UnknownAction } from "@reduxjs/toolkit"

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        todolists: todolistReducer,
        app: appReducer,
        auth: authReducer,
    },
})

export type Store = ReturnType<typeof store.getState>

// export type AppDispatch = typeof store.dispatch
export type AppDispatch = ThunkDispatch<Store, unknown, UnknownAction>

// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, Store, unknown, UnknownAction>
export type AppThunk = ThunkAction<void, Store, unknown, UnknownAction>

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<Store> = useSelector
