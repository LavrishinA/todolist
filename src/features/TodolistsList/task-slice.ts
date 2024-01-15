import { ResponseStatuses, TaskItemArgs, TaskPriorities, TaskStatuses, todolistApi } from "api/todolistApi"
import { AppDispatch, Store } from "app/store"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { appActions } from "app/app-slice"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { todolistActions } from "features/TodolistsList/todolist-slice"

const initialState: Tasks = {}

const slice = createSlice({
    name: "task",
    initialState,
    reducers: {
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
            .addCase(tasksThunks.fetchTasks.fulfilled, (state, action) => {
                state[action.payload.id] = action.payload.tasks
            })
            .addCase(tasksThunks.createTask.fulfilled, (state, action) => {
                state[action.payload.todoListId].unshift(action.payload)
            })
            .addCase(tasksThunks.deleteTask.fulfilled, (state, action) => {
                const index = state[action.payload.id].findIndex((t) => t.id === action.payload.taskId)
                if (index !== -1) state[action.payload.id].splice(index, 1)
            })
            .addCase(tasksThunks.updateTask.fulfilled, (state, action) => {
                const index = state[action.payload.id].findIndex((t) => t.id === action.payload.taskId)
                if (index !== -1)
                    state[action.payload.id][index] = { ...state[action.payload.id][index], ...action.payload.task }
            })
    },
})
export const createTaskAsyncThunk = createAsyncThunk.withTypes<{
    state: Store
    dispatch: AppDispatch
    rejectValue: null
}>()
//thunks
export const fetchTasks = createTaskAsyncThunk<{ id: string; tasks: TaskItemArgs[] }, string>(
    `${slice.name}/fetchTasks`,
    async (id: string, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        dispatch(appActions.setStatus({ status: "loading" }))
        try {
            const res = await todolistApi.getTasks(id)
            const tasks = res.data.items
            dispatch(appActions.setStatus({ status: "succeeded" }))
            return { id, tasks } //payload
        } catch (error: any) {
            handleServerAppError(error, dispatch)
            return rejectWithValue(null)
        }
    },
)

export const createTask = createTaskAsyncThunk<TaskItemArgs, { id: string; title: string }>(
    `${slice.name}/createTask`,
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        dispatch(appActions.setStatus({ status: "loading" }))

        try {
            const res = await todolistApi.createTask(arg.id, arg.title)
            if (res.data.resultCode === ResponseStatuses.succeeded) {
                dispatch(appActions.setStatus({ status: "succeeded" }))

                return res.data.data.item
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
    },
)

export const deleteTask = createTaskAsyncThunk<DeleteTaskArg, DeleteTaskArg>(
    `${slice.name}/deleteTask`,
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        dispatch(appActions.setStatus({ status: "loading" }))

        try {
            const res = await todolistApi.deleteTask(arg.id, arg.taskId)
            if (res.data.resultCode === ResponseStatuses.succeeded) {
                dispatch(appActions.setStatus({ status: "succeeded" }))

                return arg
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
    },
)

export const updateTask = createTaskAsyncThunk<updateTaskArg, updateTaskArg>(
    `${slice.name}/updateTask`,
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue, getState } = thunkAPI
        dispatch(appActions.setStatus({ status: "loading" }))

        try {
            const task = getState().tasks[arg.id].find((t) => t.id === arg.taskId)

            if (!task) {
                console.warn("task not found in the state")
                return rejectWithValue(null)
            }

            const taskModel = {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...arg.task,
            }

            const res = await todolistApi.updateTask(arg.id, arg.taskId, taskModel)
            if (res.data.resultCode === ResponseStatuses.succeeded) {
                dispatch(appActions.setStatus({ status: "succeeded" }))

                return arg
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
    },
)

export const taskReducer = slice.reducer
export const taskActions = slice.actions
export const tasksThunks = { fetchTasks, createTask, deleteTask, updateTask }

export type Tasks = {
    [key: string]: Array<TaskItemArgs>
}
type updateTaskArg = { id: string; taskId: string; task: payloadTaskModel }
type DeleteTaskArg = { id: string; taskId: string }

export type payloadTaskModel = {
    title?: string
    description?: string | null
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: Date | null
    deadline?: Date | null
}
