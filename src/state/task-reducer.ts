import {TasksObjType} from "../App";
import {v1} from "uuid";
import {AddTl, RemoveTl} from "./todolist-reducer";


export function tasksReducer(task: TasksObjType, action: Actions): TasksObjType {
    switch (action.type) {
        case "DELTE-TASK":
            return {
                ...task,
                [action.payload.todoListId]: task[action.payload.todoListId].filter(t => t.id !== action.payload.id)
            }
        case "ADD-TASK":
            const newTaskItem = {id: v1(), title: action.payload.title, isDone: false};
            return {
                ...task,
                [action.payload.todoListId]: [newTaskItem, ...task[action.payload.todoListId]]
            }
        case "CHANGE-STATUS":
            return {
                ...task,
                [action.payload.todoListId]: task[action.payload.todoListId].map(t => t.id === action.payload.taskId ? {...t, isDone: action.payload.isDone} : t )
            }
        case "CHANGE-TITLE":
            return {
                ...task,
                [action.payload.todoListId]: task[action.payload.todoListId].map(t => t.id === action.payload.taskId ? {...t, title: action.payload.title} : t )
            }
        case "addtl":
            return { ...task, [action.id]: []}
        case "removetl":
            delete task[action.id]
            return {...task}
        default:
            throw new Error("Unknown action type")
    }
}

type DeleteTask = ReturnType<typeof deleteTask>
type AddTask = ReturnType<typeof addTask>
type changeTaskStatus = ReturnType<typeof changeTaskStatus>
type changeTaskTitle = ReturnType<typeof changeTaskTitle>
type Actions = DeleteTask | AddTask | changeTaskStatus | changeTaskTitle | AddTl | RemoveTl

export const deleteTask = (id: string, todoListId: string) => {
    return {
        type: "DELTE-TASK",
        payload: {
            id,
            todoListId
        }

    } as const
}
export const addTask = (title: string, todoListId: string) => {
    return {
        type: "ADD-TASK",
        payload: {
            title,
            todoListId
        }

    } as const
}
export const changeTaskStatus = (taskId: string, isDone: boolean, todoListId: string) => {
    return {
        type: "CHANGE-STATUS",
        payload: {
            taskId,
            isDone,
            todoListId
        }

    } as const
}

export const changeTaskTitle = (taskId: string, title: string, todoListId: string) => {
    return {
        type: "CHANGE-TITLE",
        payload: {
            taskId,
            title,
            todoListId
        }

    } as const
}