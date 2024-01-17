import { instance } from "shared/api"
import { AxiosResponse } from "axios"
import { TodolistResponse, User } from "features/TodolistsList/api/todolistApi"

export const authApi = {
    login(data: LoginParams) {
        return instance.post<TodolistResponse<{ userId: number }>, AxiosResponse<TodolistResponse<{ userId: number }>>, LoginParams>(
            "/auth/login",
            data,
        )
    },
    me() {
        return instance.get<TodolistResponse<User>>("/auth/me")
    },
    logout() {
        return instance.delete<TodolistResponse>("/auth/login")
    },
}

export type LoginParams = {
    email: string
    password: string
    rememberMe?: boolean
}
