import { appReducer } from "app/app-slice"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { authReducer } from "features/Login/model/auth-slice"
import { taskReducer, todolistReducer } from "features/TodolistsList/model"

export const store = configureStore({
    reducer: {
        tasks: taskReducer,
        todolists: todolistReducer,
        app: appReducer,
        auth: authReducer,
    },
})

export type Store = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<Store> = useSelector
