import { taskReducer } from "features/TodolistsList/model/task-slice"
import { todolistReducer } from "features/TodolistsList/model/todolist-slice"
import { appReducer } from "app/app-slice"
import { authReducer } from "features/Login/model/auth-slice"
import { ThunkDispatch } from "redux-thunk"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { configureStore, UnknownAction } from "@reduxjs/toolkit"

export const store = configureStore({
    reducer: {
        tasks: taskReducer,
        todolists: todolistReducer,
        app: appReducer,
        auth: authReducer,
    },
})

export type Store = ReturnType<typeof store.getState>

// export type AppDispatch = typeof store.dispatch
export type AppDispatch = ThunkDispatch<Store, unknown, UnknownAction>

// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, Store, unknown, UnknownAction>
// export type AppThunk = ThunkAction<void, Store, unknown, UnknownAction>

export const useAppDispatch = useDispatch<AppDispatch>
export const useAppSelector: TypedUseSelectorHook<Store> = useSelector
