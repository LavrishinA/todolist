import { AxiosResponse } from "axios"
import { instance } from "shared/api"
import { BaseResponse } from "shared/lib"

export class TodolistApi {
    static getTodolists() {
        return instance.get<TodolistItemArgs[]>("/todo-lists")
    }

    static createTodolist(title: string): Promise<AxiosResponse<BaseResponse<{ item: TodolistItemArgs }>>> {
        return instance.post("/todo-lists", { title })
    }

    static deleteTodolist(todolistId: string): Promise<AxiosResponse<BaseResponse>> {
        return instance.delete(`/todo-lists/${todolistId}`)
    }

    static updateTodolist(todolistId: string, title: string): Promise<AxiosResponse<BaseResponse>> {
        return instance.put(`/todo-lists/${todolistId}`, { title })
    }
}

export type TodolistItemArgs = {
    id: string
    title: string
    addedDate: Date
    order: number
}
