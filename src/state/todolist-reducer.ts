import {TodoListType} from "../App";
import {v1} from "uuid";
import {FilterType} from "../CommonTypes/FilterType";


export type AddTl = {
    type: "addtl"
    listTitle: string
    id: string
}
export type RemoveTl = {
    type: "removetl"
    id: string
}
export type UpdateTltitle = {
    type: "updatetl"
    id: string
    listTitle: string
}
export type UpdateTlfilter = {
    type: "updatefilter"
    id: string
    filter: FilterType
}

type Actions = AddTl | RemoveTl | UpdateTltitle | UpdateTlfilter


export function todolistsReducer(todolists: TodoListType[], action: Actions): TodoListType[] {
    switch (action.type) {
        case "addtl":
            return [...todolists,
                {id: action.id, listTitle: action.listTitle, filter: FilterType.All},
            ]
        case "removetl":
            return todolists.filter(tl => tl.id !== action.id)
        case "updatetl":
            return todolists.map(tl => tl.id === action.id ? {...tl, listTitle: action.listTitle} : tl)
        case "updatefilter":
            return todolists.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        default:
            throw new Error("Unknown action type")
    }
}

export function removeTl(id: string): RemoveTl {
    return {
        type: "removetl",
        id,
    } as const
}

export function addTl(listTitle: string): AddTl {
    return {type: "addtl", listTitle, id: v1()} as const
}

export function updateTl(id: string, listTitle: string): UpdateTltitle {
    return {type: "updatetl", id, listTitle} as const
}

export function updateFilterTl(id: string, filter: FilterType): UpdateTlfilter {
    return {type: "updatefilter", id, filter} as const
}