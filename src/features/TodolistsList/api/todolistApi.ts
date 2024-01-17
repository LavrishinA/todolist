import { AxiosResponse } from "axios"
import { instance } from "shared/api"
import { TaskPriorities, TaskStatuses } from "shared/lib"

export const todolistApi = {
    getTodolists() {
        return instance.get<TodolistItemArgs[]>("/todo-lists")
    },
    createTodolist(title: string): Promise<AxiosResponse<TodolistResponse<{ item: TodolistItemArgs }>>> {
        return instance.post("/todo-lists", { title })
    },
    deleteTodolist(todolistId: string): Promise<AxiosResponse<TodolistResponse>> {
        return instance.delete(`/todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string): Promise<AxiosResponse<TodolistResponse>> {
        return instance.put(`/todo-lists/${todolistId}`, { title })
    },
    getTasks(todolistId: string) {
        return instance.get<TasksResponse>(`/todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<
            TodolistResponse<{ item: TaskItemArgs }>,
            AxiosResponse<TodolistResponse<{ item: TaskItemArgs }>>,
            { title: string }
        >(`/todo-lists/${todolistId}/tasks`, { title })
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<TodolistResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, payload: updateTaskModel) {
        return instance.put<
            TodolistResponse<{ item: TaskItemArgs }>,
            AxiosResponse<
                TodolistResponse<{
                    item: TaskItemArgs
                }>
            >,
            updateTaskModel
        >(`/todo-lists/${todolistId}/tasks/${taskId}`, payload)
    },
}

export type User = {
    id: number
    email: string
    login: string
}

export type TodolistItemArgs = {
    id: string
    title: string
    addedDate: Date
    order: number
}

export type TaskItemArgs = {
    id: string
    title: string
    description: string | null
    todoListId: string
    order: number
    status: TaskStatuses
    priority: TaskPriorities
    startDate: Date | null
    deadline: Date | null
    addedDate: Date | null
}

export type updateTaskModel = {
    title: string
    description: string | null
    status: TaskStatuses
    priority: TaskPriorities
    startDate: Date | null
    deadline: Date | null
}

export type TodolistResponse<T = {}> = {
    data: T
    resultCode: number
    messages: string[]
    fieldsErrors: string[]
}

export type TasksResponse = {
    items: TaskItemArgs[]
    totalCount: number
    error: string | null
}
