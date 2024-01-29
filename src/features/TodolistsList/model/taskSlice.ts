import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Store } from "app/store"
import { handleServerAppError, handleServerNetworkError } from "shared/lib/error-utils"
import { appActions } from "app/app-slice"
import { authActions } from "features/Login/model/auth-slice"
import { ResponseStatuses, TaskPriorities, TaskStatuses } from "shared/lib"
import { TaskApi, TaskItemArgs } from "features/TodolistsList/api"
import { todolistActions } from "./todolistSlice"
import { AppDispatch } from "shared/lib/hooks"

const initialState: Tasks = {}

const slice = createSlice({
    name: "task",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(todolistActions.fetchTodolists.fulfilled, (state, action) => {
                action.payload?.forEach((tl) => (state[tl.id] = []))
            })
            .addCase(todolistActions.createTodolist.fulfilled, (state, action) => {
                state[action.payload.id] = []
            })
            .addCase(todolistActions.deleteTodolist.fulfilled, (state, action) => {
                delete state[action.payload]
            })
            .addCase(authActions.logout.fulfilled, () => {
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
                if (index !== -1) state[action.payload.id][index] = { ...state[action.payload.id][index], ...action.payload.task }
            })
    },
    selectors: {
        tasks: (state) => state,
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
            const res = await TaskApi.getTasks(id)
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
            const res = await TaskApi.createTask(arg.id, arg.title)
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

export const deleteTask = createTaskAsyncThunk<DeleteTaskArg, DeleteTaskArg>(`${slice.name}/deleteTask`, async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(appActions.setStatus({ status: "loading" }))

    try {
        const res = await TaskApi.deleteTask(arg.id, arg.taskId)
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
})

export const updateTask = createTaskAsyncThunk<updateTaskArg, updateTaskArg>(`${slice.name}/updateTask`, async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI
    dispatch(appActions.setStatus({ status: "loading" }))

    try {
        const task = getState().task[arg.id].find((t) => t.id === arg.taskId)

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

        const res = await TaskApi.updateTask(arg.id, arg.taskId, taskModel)
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
})

export const taskReducer = slice.reducer
export const taskActions = slice.actions
export const taskSelectors = slice.selectors
export const tasksThunks = { fetchTasks, createTask, deleteTask, updateTask }

export type Tasks = Record<string, TaskItemArgs[]>
type DeleteTaskArg = { id: string; taskId: string }
type updateTaskArg = { id: string; taskId: string; task: payloadTaskModel }

export type payloadTaskModel = {
    title?: string
    description?: string | null
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: Date | null
    deadline?: Date | null
}
