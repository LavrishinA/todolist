
import {FilterType} from "../CommonTypes/FilterType";
import {v1} from "uuid";

export type Todolist = {
    id: string
    listTitle: string
    filter: FilterType
}


const todolistsInit: Todolist[]  =  []

export function todolistsReducer(todolists: Todolist[] = todolistsInit, action: Actions): Todolist[] {
    switch (action.type) {
        case "todolist/create":
            return [
                {id: action.id, listTitle: action.title, filter: FilterType.All},
                ...todolists
            ]
        case "todolist/delete":
            return todolists.filter(tl => tl.id !== action.todoListId)
        case "todolist/update-title":
            return todolists.map(tl => tl.id === action.todoListId ? {...tl, listTitle: action.title} : tl)
        case "todolist/update-filter":
            return todolists.map(tl => tl.id === action.todoListId ? {...tl, filter: action.filter} : tl)
        default:
            return todolists
    }
}

export type Actions = CreateTodolist | DeleteTodolist | UpdateTodolistTitle | UpdateTodolistFilter
export type CreateTodolist = ReturnType<typeof createTodolist>
export type DeleteTodolist = ReturnType<typeof deleteTodolist>
export type UpdateTodolistTitle = ReturnType<typeof updateTodolistTitle>
export type UpdateTodolistFilter = ReturnType<typeof updateTodolistFilter>

export function createTodolist(title: string) {
    const id = v1()
    return {type: "todolist/create", title, id} as const
}

export function deleteTodolist(todoListId: string) {
    return {type: "todolist/delete", todoListId,} as const
}

export function updateTodolistTitle(todoListId: string, title: string) {
    return {type: "todolist/update-title", todoListId, title} as const
}

export function updateTodolistFilter(todoListId: string, filter: FilterType) {
    return {type: "todolist/update-filter", todoListId, filter} as const
}