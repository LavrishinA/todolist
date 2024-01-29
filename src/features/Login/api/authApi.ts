import { instance } from "shared/api"
import { AxiosResponse } from "axios"
import { BaseResponse } from "shared/lib"

export const authApi = {
    login(data: LoginParams) {
        return instance.post<BaseResponse<{ userId: number }>, AxiosResponse<BaseResponse<{ userId: number }>>, LoginParams>(
            "/auth/login",
            data,
        )
    },
    me() {
        return instance.get<BaseResponse<User>>("/auth/me")
    },
    logout() {
        return instance.delete<BaseResponse>("/auth/login")
    },
}

export type LoginParams = {
    email: string
    password: string
    rememberMe?: boolean
}

export type User = {
    id: number
    email: string
    login: string
}
