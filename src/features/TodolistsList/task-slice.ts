import { ResponseStatuses, TaskItemArgs, TaskPriorities, TaskStatuses, todolistApi } from "api/todolistApi"
import { AppDispatch, AppThunk, Store } from "app/store"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { appActions } from "app/app-slice"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { todolistActions } from "features/TodolistsList/todolist-slice"

const initialState: Tasks = {}

const slice = createSlice({
    name: "task",
    initialState,
    reducers: {
        read: (state, action: PayloadAction<{ id: string; tasks: TaskItemArgs[] }>) => {
            state[action.payload.id] = action.payload.tasks
        },
        delete: (state, action: PayloadAction<{ id: string; taskId: string }>) => {
            const index = state[action.payload.id].findIndex((t) => t.id === action.payload.taskId)
            if (index !== -1) state[action.payload.id].splice(index, 1)
        },
        create: (state, action: PayloadAction<{ id: string; task: TaskItemArgs }>) => {
            state[action.payload.id].unshift(action.payload.task)
        },
        update: (state, action: PayloadAction<{ id: string; taskId: string; task: payloadTaskModel }>) => {
            const index = state[action.payload.id].findIndex((t) => t.id === action.payload.taskId)
            if (index !== -1)
                state[action.payload.id][index] = { ...state[action.payload.id][index], ...action.payload.task }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(todolistActions.read, (state, action) => {
                action.payload.forEach((tl) => (state[tl.id] = []))
            })
            .addCase(todolistActions.create, (state, action) => {
                state[action.payload.id] = []
            })
            .addCase(todolistActions.delete, (state, action) => {
                delete state[action.payload]
            })
            .addCase(todolistActions.clearData, () => {
                return {}
            })
    },
})

export const taskReducer = slice.reducer
export const taskActions = slice.actions

//thunks
export const thunkSetTasks =
    (id: string): AppThunk =>
    (dispatch: AppDispatch) => {
        dispatch(appActions.setStatus({ status: "loading" }))
        todolistApi.getTasks(id).then((res) => {
            dispatch(taskActions.read({ id, tasks: res.data.items }))
            dispatch(appActions.setStatus({ status: "succeeded" }))
        })
    }

export const thunkCreateTask =
    (id: string, title: string): AppThunk =>
    (dispatch: AppDispatch) => {
        dispatch(appActions.setStatus({ status: "loading" }))
        todolistApi
            .createTask(id, title)
            .then((res) => {
                if (res.data.resultCode === ResponseStatuses.succeeded) {
                    dispatch(taskActions.create({ id, task: res.data.data.item }))
                    dispatch(appActions.setStatus({ status: "succeeded" }))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }

export const thunkDeleteTask =
    (id: string, taskId: string): AppThunk =>
    (dispatch: AppDispatch) => {
        dispatch(appActions.setStatus({ status: "loading" }))
        todolistApi
            .deleteTask(id, taskId)
            .then((res) => {
                if (res.data.resultCode === ResponseStatuses.succeeded) {
                    dispatch(taskActions.delete({ id, taskId }))
                    dispatch(appActions.setStatus({ status: "succeeded" }))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }

export const thunkUpdateTask =
    (id: string, taskId: string, model: payloadTaskModel): AppThunk =>
    (dispatch: AppDispatch, getState: () => Store) => {
        dispatch(appActions.setStatus({ status: "loading" }))
        const task = getState().tasks[id].find((t) => t.id === taskId)

        if (!task) {
            //throw new Error("task not found in the state");
            console.warn("task not found in the state")
            return
        }

        const taskModel = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...model,
        }

        todolistApi
            .updateTask(id, taskId, taskModel)
            .then((res) => {
                if (res.data.resultCode === ResponseStatuses.succeeded) {
                    dispatch(taskActions.update({ id, taskId, task: taskModel }))
                    dispatch(appActions.setStatus({ status: "succeeded" }))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }

export type Tasks = {
    [key: string]: Array<TaskItemArgs>
}

export type payloadTaskModel = {
    title?: string
    description?: string | null
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: Date | null
    deadline?: Date | null
}
