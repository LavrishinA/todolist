import {CreateTodolist, DeleteTodolist, SetTodolists} from "./todolist-reducer";
import {TaskItemArgs, TaskPriorities, TaskStatuses, todolistApi} from "../api/todolistApi";
import {Dispatch} from "redux";
import {Store} from "./store";


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
                    ...action.payload.model
                } : t)
            }
        case "todolist/create":
            return {...task, [action.todolist.id]: []}
        case "todolist/delete":
            const copyTask = {...task}
            delete copyTask[action.todoListId]
            return {...copyTask}
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
    todolistApi.getTasks(todolistId).then(res => dispatch(setTasks(todolistId, res.data.items)))
}

export const thunkCreateTask = (todolistId: string, title: string) => (dispatch: Dispatch<Actions>) => {
    todolistApi.createTask(todolistId, title).then(res => dispatch(createTask(todolistId, res.data.data.item)))
}

export const thunkDeleteTask = (todolistId: string, taskId: string) => (dispatch: Dispatch<Actions>) => {
    todolistApi.deleteTask(todolistId, taskId).then(res => dispatch(deleteTask(todolistId, taskId)))
}

export const thunkUpdateTask = (todolistId: string, taskId: string, model: payloadModel) =>
    (dispatch: Dispatch<Actions>, getState: () => Store) => {
        const task = getState().tasks[todolistId].find(t => t.id = taskId)

        if (task) {
            const payload = {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...model

            }
            todolistApi.updateTask(todolistId, taskId, payload).then(res => dispatch(updateTask(todolistId, taskId, payload)))
        }
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

type Actions = DeleteTask | CreateTask | UpdateTask | SetTasks | CreateTodolist | DeleteTodolist | SetTodolists
type DeleteTask = ReturnType<typeof deleteTask>
type CreateTask = ReturnType<typeof createTask>
type UpdateTask = ReturnType<typeof updateTask>
type SetTasks = ReturnType<typeof setTasks>