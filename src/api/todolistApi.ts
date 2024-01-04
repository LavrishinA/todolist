import axios, {AxiosResponse} from "axios";
import {LoginParams} from "../features/Login/login";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1",
    withCredentials: true,
    headers: {
        'API-KEY': 'b00ccd4a-cf77-4c91-bdbe-aa7fb7f8fcd9'
    }
})

export const authApi = {
    login(data: LoginParams) {
        return instance.post<TodolistResponse<{ userId: number }>,
            AxiosResponse<TodolistResponse<{ userId: number }>>,
            LoginParams>
        ('/auth/login', data)
    },
    me() {
        return instance.get<TodolistResponse<User>>('/auth/me')
    },
    logout() {
        return instance.delete<TodolistResponse>('/auth/login')
    }
}

export const todolistApi = {
    getTodolists(): Promise<AxiosResponse<TodolistItemArgs[]>> {
        return instance.get('/todo-lists')
    },
    createTodolist(title: string): Promise<AxiosResponse<TodolistResponse<{ item: TodolistItemArgs }>>> {
        return instance.post('/todo-lists', {title})
    },
    deleteTodolist(todolistId: string): Promise<AxiosResponse<TodolistResponse>> {
        return instance.delete(`/todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string): Promise<AxiosResponse<TodolistResponse>> {
        return instance.put(`/todo-lists/${todolistId}`, {title})
    },
    getTasks(todolistId: string) {
        return instance.get<TasksResponse>(`/todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<TodolistResponse<{ item: TaskItemArgs }>, AxiosResponse<TodolistResponse<{
            item: TaskItemArgs
        }>>, { title: string }>
        (`/todo-lists/${todolistId}/tasks`, {title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<TodolistResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, payload: updateTaskModel) {
        return instance.put<TodolistResponse<{ item: TaskItemArgs }>, AxiosResponse<TodolistResponse<{
            item: TaskItemArgs
        }>>, updateTaskModel>(`/todo-lists/${todolistId}/tasks/${taskId}`, payload)
    }


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
    data: T,
    resultCode: number
    messages: string[]
    fieldsErrors: string[]
}

export type TasksResponse = {
    items: TaskItemArgs[]
    totalCount: number
    error: string | null
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export enum ResponseStatuses {
    succeeded = 0,
    failed = 1
}

