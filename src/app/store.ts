import { configureStore } from "@reduxjs/toolkit"
import { authReducer } from "features/Login"
import { taskReducer, todolistReducer } from "features/TodolistsList/model"
import { appReducer } from "./app-slice"

export const store = configureStore({
    reducer: {
        task: taskReducer,
        todolist: todolistReducer,
        app: appReducer,
        auth: authReducer,
    },
})

export type Store = ReturnType<typeof store.getState>
