import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Store } from "app/store"
import { authActions } from "features/Login/model/auth-slice"
import { BaseResponse, ResponseStatuses } from "shared/lib"
import { TaskApi, TaskItemArgs, updateTaskModel } from "features/TodolistsList/api"
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
    rejectValue: BaseResponse | null
}>()

//thunks
export const fetchTasks = createTaskAsyncThunk<{ id: string; tasks: TaskItemArgs[] }, string>(
    `${slice.name}/fetchTasks`,
    async (id: string) => {
        const res = await TaskApi.getTasks(id)
        const tasks = res.data.items
        return { id, tasks } //payload
    },
)

export const createTask = createTaskAsyncThunk<TaskItemArgs, { id: string; title: string }>(
    `${slice.name}/createTask`,
    async (arg, thunkAPI) => {
        const { rejectWithValue } = thunkAPI

        const res = await TaskApi.createTask(arg.id, arg.title)
        if (res.data.resultCode === ResponseStatuses.succeeded) {
            return res.data.data.item
        } else {
            return rejectWithValue(res.data)
        }
    },
)

export const deleteTask = createTaskAsyncThunk<DeleteTaskArg, DeleteTaskArg>(`${slice.name}/deleteTask`, async (arg, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    const res = await TaskApi.deleteTask(arg.id, arg.taskId)
    if (res.data.resultCode === ResponseStatuses.succeeded) {
        return arg
    } else {
        return rejectWithValue(res.data)
    }
})

export const updateTask = createTaskAsyncThunk<updateTaskArg, updateTaskArg>(`${slice.name}/updateTask`, async (arg, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI

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
        return arg
    } else {
        return rejectWithValue(res.data)
    }
})

export const taskReducer = slice.reducer
export const taskActions = slice.actions
export const taskSelectors = slice.selectors
export const tasksThunks = { fetchTasks, createTask, deleteTask, updateTask }

export type Tasks = Record<string, TaskItemArgs[]>
export type payloadTaskModel = Partial<updateTaskModel>
type DeleteTaskArg = { id: string; taskId: string }
type updateTaskArg = { id: string; taskId: string; task: payloadTaskModel }
