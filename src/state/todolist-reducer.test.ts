import {v1} from "uuid";
import {FilterType} from "../CommonTypes/FilterType";
import {TodoListType} from "../App";
import {addTl, removeTl, updateFilterTl, updateTl, todolistsReducer} from "./todolist-reducer";


let todolist1ID: string
let todolist2ID: string
let todolists: TodoListType[]

beforeEach(() => {
    todolist1ID = v1()
    todolist2ID = v1()
    todolists = [
        {id: todolist1ID, listTitle: "What to learn", filter: FilterType.All},
        {id: todolist2ID, listTitle: "What to buy", filter: FilterType.All}
    ]
})


test("New todolist should be added", () => {
    const todolistsAfterReduce = todolistsReducer(todolists, addTl("New todolist title"))

    expect(todolistsAfterReduce.length).toBe(3)
    expect(todolistsAfterReduce[2].filter).toBe(FilterType.All)
    expect(todolistsAfterReduce[2].listTitle).toBe("New todolist title")
})

test("todolist should be removed todolist", () => {
    const todolistsAfterReduce = todolistsReducer(todolists, removeTl(todolist1ID))

    expect(todolistsAfterReduce.length).toBe(1)
    expect(todolistsAfterReduce[0].id).toBe(todolist2ID)
})

test("todolist title should be changed", () => {
    const todolistsAfterReduce = todolistsReducer(todolists, updateTl(todolist2ID, "What to pay"))

    expect(todolistsAfterReduce[0].listTitle).toBe("What to learn")
    expect(todolistsAfterReduce[1].listTitle).toBe("What to pay")
})

test("todolist filter should be changed", () => {

    const todolistsAfterReduce = todolistsReducer(todolists, updateFilterTl(todolist2ID, FilterType.Active))
    expect(todolistsAfterReduce[0].filter).toBe(FilterType.All)
    expect(todolistsAfterReduce[1].filter).toBe(FilterType.Active)
})