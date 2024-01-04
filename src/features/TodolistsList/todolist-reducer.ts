import {ResponseStatuses, todolistApi, TodolistItemArgs} from "../../api/todolistApi";
import {Dispatch} from "redux";
import {RequestStatusType, setStatus, SetStatus} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


export function todolistsReducer(todolists: TodolistUI[] = initialState, action: Actions): TodolistUI[] {
    switch (action.type) {
        case "todolist/set":
            return action.todolists.reduce((acc: TodolistUI[], cur) => [...acc, {
                ...cur,
                filter: FilterType.All,
                entityStatus: "idle"
            }], [])
        case "todolist/create":
            return [{...action.todolist, filter: FilterType.All, entityStatus: "idle"}, ...todolists]
        case "todolist/delete":
            return todolists.filter(tl => tl.id !== action.todoListId)
        case "todolist/update-title":
            return todolists.map(tl => tl.id === action.todoListId ? {...tl, title: action.title} : tl)
        case "todolist/update-filter":
            return todolists.map(tl => tl.id === action.todoListId ? {...tl, filter: action.filter} : tl)
        case "todolist/set-entity-status":
            return todolists.map(tl => tl.id === action.todoListId ? {...tl, entityStatus: action.entityStatus} : tl)
        default:
            return todolists
    }
}

//actions
export const createTodolist = (todolist: TodolistItemArgs) =>
    ({type: "todolist/create", todolist} as const)

export const deleteTodolist = (todoListId: string) =>
    ({type: "todolist/delete", todoListId} as const)

export const updateTodolistTitle = (todoListId: string, title: string) =>
    ({type: "todolist/update-title", todoListId, title} as const)

export const updateTodolistFilter = (todoListId: string, filter: FilterType) =>
    ({type: "todolist/update-filter", todoListId, filter} as const)

export const setTodolists = (todolists: TodolistItemArgs[]) =>
    ({type: "todolist/set", todolists} as const)

export const setEntityStatus = (todoListId: string, entityStatus: RequestStatusType) =>
    ({type: "todolist/set-entity-status", todoListId, entityStatus} as const)

//thunks
export const thunkSetTodolist = () => (dispatch: Dispatch<Actions>) => {
    dispatch(setStatus("loading"))
    todolistApi.getTodolists().then(res => {
        dispatch(setTodolists(res.data))
        dispatch(setStatus("succeeded"))
    })
}

export const thunkCreateTodolist = (title: string) => (dispatch: Dispatch<Actions>) => {
    dispatch(setStatus("loading"))
    todolistApi.createTodolist(title).then(res => {
        if (res.data.resultCode === ResponseStatuses.succeeded) {
            dispatch(createTodolist(res.data.data.item))
            dispatch(setStatus("succeeded"))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch((e) => {
        handleServerNetworkError(e, dispatch)
    })

}

export const thunkDeleteTodolist = (todoListId: string) => (dispatch: Dispatch<Actions>) => {
    dispatch(setStatus("loading"))
    dispatch(setEntityStatus(todoListId, "loading"))
    todolistApi.deleteTodolist(todoListId).then(res => {
        if (res.data.resultCode === ResponseStatuses.succeeded) {
            dispatch(deleteTodolist(todoListId))
            dispatch(setStatus("succeeded"))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch((e) => {
        handleServerNetworkError(e, dispatch)
    })
}

export const thunkUpdateTodolist = (todoListId: string, title: string) => (dispatch: Dispatch<Actions>) => {
    dispatch(setStatus("loading"))
    dispatch(setEntityStatus(todoListId, "loading"))
    todolistApi.updateTodolist(todoListId, title).then(res => {
        if (res.data.resultCode === ResponseStatuses.succeeded) {
            dispatch(updateTodolistTitle(todoListId, title))
            dispatch(setStatus("succeeded"))
            dispatch(setEntityStatus(todoListId, "succeeded"))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch((e) => {
        handleServerNetworkError(e, dispatch)
    })
}


//types
export type TodolistUI = TodolistItemArgs & {
    filter: FilterType
    entityStatus: RequestStatusType
}
const initialState: TodolistUI[] = []

export type Actions = CreateTodolist
    | DeleteTodolist
    | UpdateTodolistTitle
    | UpdateTodolistFilter
    | SetTodolists
    | SetStatus
    | SetEntityStatus

export type SetTodolists = ReturnType<typeof setTodolists>
export type CreateTodolist = ReturnType<typeof createTodolist>
export type DeleteTodolist = ReturnType<typeof deleteTodolist>
export type SetEntityStatus = ReturnType<typeof setEntityStatus>
type UpdateTodolistTitle = ReturnType<typeof updateTodolistTitle>
type UpdateTodolistFilter = ReturnType<typeof updateTodolistFilter>

export enum FilterType {
    All = "all",
    Active = "active",
    Completed = "completed"
}