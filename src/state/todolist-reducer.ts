import {FilterType} from "../CommonTypes/FilterType";
import {todolistApi, TodolistItemArgs} from "../api/todolistApi";
import {Dispatch} from "redux";

export function todolistsReducer(todolists: TodolistUI[] = initialState, action: Actions): TodolistUI[] {
    switch (action.type) {
        case "todolist/set":
            return action.todolists.reduce((acc: TodolistUI[], cur) => [...acc, {...cur, filter: FilterType.All}], [])
        case "todolist/create":
            return [{...action.todolist, filter: FilterType.All}, ...todolists]
        case "todolist/delete":
            return todolists.filter(tl => tl.id !== action.todoListId)
        case "todolist/update-title":
            return todolists.map(tl => tl.id === action.todoListId ? {...tl, title: action.title} : tl)
        case "todolist/update-filter":
            return todolists.map(tl => tl.id === action.todoListId ? {...tl, filter: action.filter} : tl)
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


//thunks
export const thunkSetTodolist = () => (dispatch: Dispatch<Actions>) => {
    todolistApi.getTodolists().then(res => dispatch(setTodolists(res.data)))
}

export const thunkCreateTodolist = (title: string) => (dispatch: Dispatch<Actions>) => {
    todolistApi.createTodolist(title).then(res => dispatch(createTodolist(res.data.data.item)))
}

export const thunkDeleteTodolist = (todoListId: string) => (dispatch: Dispatch<Actions>) => {
    todolistApi.deleteTodolist(todoListId).then(res => dispatch(deleteTodolist(todoListId)))
}

export const thunkUpdateTodolist = (todoListId: string, title: string) => (dispatch: Dispatch<Actions>) => {
    todolistApi.updateTodolist(todoListId, title).then(res => dispatch(updateTodolistTitle(todoListId, title)))
}


//types
export type TodolistUI = TodolistItemArgs & {
    filter: FilterType
}
const initialState: TodolistUI[] = []

export type Actions = CreateTodolist | DeleteTodolist | UpdateTodolistTitle | UpdateTodolistFilter | SetTodolists
export type SetTodolists = ReturnType<typeof setTodolists>
export type CreateTodolist = ReturnType<typeof createTodolist>
export type DeleteTodolist = ReturnType<typeof deleteTodolist>
type UpdateTodolistTitle = ReturnType<typeof updateTodolistTitle>
type UpdateTodolistFilter = ReturnType<typeof updateTodolistFilter>
