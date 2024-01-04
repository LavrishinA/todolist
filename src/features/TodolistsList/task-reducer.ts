import {
    ClearData,
    CreateTodolist,
    DeleteTodolist,
    setEntityStatus,
    SetEntityStatus,
    SetTodolists
} from "./todolist-reducer";
import {ResponseStatuses, TaskItemArgs, TaskPriorities, TaskStatuses, todolistApi} from "../../api/todolistApi";
import {Dispatch} from "redux";
import {Store} from "../../app/store";
import {setError, SetError, SetStatus, setStatus} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


const initialState: Tasks = {}

export function tasksReducer(task: Tasks = initialState, action: Actions): Tasks {
    switch (action.type) {
        case "todolist/set":
            return action.todolists.reduce((acc, tl) => ({...acc, [tl.id]: []}), {})
        case "task/set":
            return {...task, [action.payload.todolistId]: [...action.payload.tasks]}
        case "task/delete":
            return {
                ...task,
                [action.payload.todolistId]: task[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
            }
        case "task/create":
            return {
                ...task,
                [action.payload.todolistId]: [action.payload.newTaskItem, ...task[action.payload.todolistId]]
            }
        case "task/update-task":
            return {
                ...task,
                [action.payload.todolistId]: task[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                    ...t,
                    ...action.payload.model,
                } : t)
            }
        case "todolist/create":
            return {...task, [action.todolist.id]: []}
        case "todolist/delete":
            const copyTask = {...task}
            delete copyTask[action.todoListId]
            return {...copyTask}
        case "todolist/clear-data":
            return {}
        default:
            return task
    }
}

//actions
export const setTasks = (todolistId: string, tasks: Array<TaskItemArgs>) =>
    ({type: "task/set", payload: {todolistId, tasks}} as const)

export const deleteTask = (todolistId: string, taskId: string) =>
    ({type: "task/delete", payload: {todolistId, taskId}} as const)

export const createTask = (todolistId: string, newTaskItem: TaskItemArgs) =>
    ({type: "task/create", payload: {todolistId, newTaskItem}} as const)

export const updateTask = (todolistId: string, taskId: string, model: payloadModel) =>
    ({type: "task/update-task", payload: {todolistId, taskId, model}} as const)

//thunks
export const thunkSetTasks = (todolistId: string) => (dispatch: Dispatch<Actions>) => {
    dispatch(setStatus("loading"))
    todolistApi.getTasks(todolistId).then(res => {
        dispatch(setTasks(todolistId, res.data.items))
        dispatch(setStatus("succeeded"))
    })
}

export const thunkCreateTask = (todolistId: string, title: string) => (dispatch: Dispatch<Actions>) => {
    dispatch(setStatus("loading"))
    todolistApi.createTask(todolistId, title).then(res => {
        if (res.data.resultCode === ResponseStatuses.succeeded) {
            dispatch(createTask(todolistId, res.data.data.item))
            dispatch(setStatus("succeeded"))
        } else {
            handleServerAppError(res.data, dispatch)
        }

    }).catch((error) => {
        handleServerNetworkError(error, dispatch)
    })
}

export const thunkDeleteTask = (todolistId: string, taskId: string) => (dispatch: Dispatch<Actions>) => {
    dispatch(setStatus("loading"))
    todolistApi.deleteTask(todolistId, taskId).then(res => {
        if (res.data.resultCode === ResponseStatuses.succeeded) {
            dispatch(deleteTask(todolistId, taskId))
            dispatch(setStatus("succeeded"))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch((error) => {
        handleServerNetworkError(error, dispatch)
    })
}

export const thunkUpdateTask = (todolistId: string, taskId: string, model: payloadModel) =>
    (dispatch: Dispatch<Actions>, getState: () => Store) => {
        dispatch(setStatus("loading"))
        const task = getState().tasks[todolistId].find(t => t.id === taskId)

        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const payload = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...model

        }

        todolistApi.updateTask(todolistId, taskId, payload).then(res => {
            if (res.data.resultCode === ResponseStatuses.succeeded) {
                dispatch(updateTask(todolistId, taskId, payload))
                dispatch(setStatus("succeeded"))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }).catch((error) => {
            handleServerNetworkError(error, dispatch)

        })

    }

export type Tasks = {
    [key: string]: Array<TaskItemArgs>
}

export type payloadModel = {
    title?: string
    description?: string | null
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: Date | null
    deadline?: Date | null
}

type Actions =
    DeleteTask
    | CreateTask
    | UpdateTask
    | SetTasks
    | CreateTodolist
    | DeleteTodolist
    | SetTodolists
    | SetStatus
    | SetEntityStatus
    | ClearData

type DeleteTask = ReturnType<typeof deleteTask>
type CreateTask = ReturnType<typeof createTask>
type UpdateTask = ReturnType<typeof updateTask>
type SetTasks = ReturnType<typeof setTasks>