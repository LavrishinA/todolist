import { instance } from "shared/api"
import { AxiosResponse } from "axios"
import { BaseResponse, TaskPriorities, TaskStatuses } from "shared/lib"

export class TaskApi {
    static getTasks(todolistId: string) {
        return instance.get<TasksResponse>(`/todo-lists/${todolistId}/tasks`)
    }

    static createTask(todolistId: string, title: string) {
        return instance.post<
            BaseResponse<{ item: TaskItemArgs }>,
            AxiosResponse<
                BaseResponse<{
                    item: TaskItemArgs
                }>
            >,
            { title: string }
        >(`/todo-lists/${todolistId}/tasks`, { title })
    }

    static deleteTask(todolistId: string, taskId: string) {
        return instance.delete<BaseResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    }

    static updateTask(todolistId: string, taskId: string, payload: updateTaskModel) {
        return instance.put<
            BaseResponse<{ item: TaskItemArgs }>,
            AxiosResponse<
                BaseResponse<{
                    item: TaskItemArgs
                }>
            >,
            updateTaskModel
        >(`/todo-lists/${todolistId}/tasks/${taskId}`, payload)
    }
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

export type TasksResponse = {
    items: TaskItemArgs[]
    totalCount: number
    error: string | null
}
