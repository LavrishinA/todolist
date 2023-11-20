import {v1} from "uuid";
import {CreateTodolist, DeleteTodolist} from "./todolist-reducer";


export type Task = {
    id: string
    title: string
    isDone: boolean
}

export type Tasks = {
    [key: string]: Array<Task>
}

const initialState: Tasks = {

}

export function tasksReducer(task: Tasks = initialState, action: Actions): Tasks {
    switch (action.type) {
        case "task/delete":
            return {
                ...task,
                [action.payload.todolistId]: task[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
            }
        case "task/create":
            const newTaskItem = {id: v1(), title: action.payload.title, isDone: false};
            return {
                ...task,
                [action.payload.todolistId]: [newTaskItem, ...task[action.payload.todolistId]]
            }
        case "task/update-status":
            return {
                ...task,
                [action.payload.todolistId]: task[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                    ...t,
                    isDone: action.payload.isDone
                } : t)
            }
        case "task/update-title":
            return {
                ...task,
                [action.payload.todolistId]: task[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                    ...t,
                    title: action.payload.title
                } : t)
            }
        case "todolist/create":
            return {...task, [action.id]: []}
        case "todolist/delete":
            const copyTask = {...task}
            delete copyTask[action.todoListId]
            return {...copyTask}
        // 1)
        // const {[action.id]: [], ...rest} = task
        // return rest
        default:
            return task
    }
}

type Actions = DeleteTask | CreateTask | UpdateTaskStatus | UpdateTaskTitle | CreateTodolist | DeleteTodolist
type DeleteTask = ReturnType<typeof deleteTask>
type CreateTask = ReturnType<typeof createTask>
type UpdateTaskStatus = ReturnType<typeof updateTaskStatus>
type UpdateTaskTitle = ReturnType<typeof updateTaskTitle>

export const deleteTask = (todolistId: string, taskId: string) => {
    return {
        type: "task/delete",
        payload: {
            todolistId,
            taskId,
        }
    } as const
}
export const createTask = (todolistId: string, title: string) => {
    return {
        type: "task/create",
        payload: {
            todolistId,
            title
        }
    } as const
}
export const updateTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
    return {
        type: "task/update-status",
        payload: {
            todolistId,
            taskId,
            isDone,
        }
    } as const
}

export const updateTaskTitle = (todolistId: string, taskId: string, title: string) => {
    return {
        type: "task/update-title",
        payload: {
            todolistId,
            taskId,
            title,
        }
    } as const
}