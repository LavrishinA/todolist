import { v1 } from "uuid"

import { FilterType } from "shared/lib"
import { todolistActions, todolistReducer, TodolistUI } from "features/TodolistsList/model"

let todolist1ID: string
let todolist2ID: string
let todolists: TodolistUI[]

beforeEach(() => {
    todolist1ID = v1()
    todolist2ID = v1()
    todolists = [
        {
            id: todolist1ID,
            title: "What to learn",
            addedDate: new Date(),
            order: 1,
            filter: FilterType.All,
            entityStatus: "idle",
        },
        {
            id: todolist2ID,
            title: "What to pay",
            addedDate: new Date(),
            order: 2,
            filter: FilterType.All,
            entityStatus: "idle",
        },
    ]
})

test("New todolist should be added", () => {
    const newTodolist = {
        id: "todolistId3",
        title: "What to buy",
        addedDate: new Date(),
        order: 3,
        filter: FilterType.All,
    }

    const todolistsAfterReduce = todolistReducer(
        todolists,
        todolistActions.createTodolist.fulfilled(newTodolist, "requestId", "What to buy"),
    )

    expect(todolistsAfterReduce.length).toBe(3)
    expect(todolistsAfterReduce[0].filter).toBe(FilterType.All)
    expect(todolistsAfterReduce[0].title).toBe("What to buy")
})

test("todolist should be removed todolist", () => {
    const todolistsAfterReduce = todolistReducer(todolists, todolistActions.deleteTodolist.fulfilled(todolist1ID, "requstId", todolist1ID))

    expect(todolistsAfterReduce.length).toBe(1)
    expect(todolistsAfterReduce[0].id).toBe(todolist2ID)
})

test("todolist title should be changed", () => {
    const todolistsAfterReduce = todolistReducer(
        todolists,
        todolistActions.updateTodolist.fulfilled({ id: todolist2ID, title: "What to pay" }, "requestId", {
            id: todolist2ID,
            title: "What to pay",
        }),
    )

    expect(todolistsAfterReduce[0].title).toBe("What to learn")
    expect(todolistsAfterReduce[1].title).toBe("What to pay")
})

test("todolist filter should be changed", () => {
    const todolistsAfterReduce = todolistReducer(todolists, todolistActions.updateFilter({ id: todolist2ID, filter: FilterType.Active }))
    expect(todolistsAfterReduce[0].filter).toBe(FilterType.All)
    expect(todolistsAfterReduce[1].filter).toBe(FilterType.Active)
})

test("todolists array should be not empty", () => {
    const initialState: TodolistUI[] = []
    const todolistsAfterReduce = todolistReducer(initialState, todolistActions.fetchTodolists.fulfilled(todolists, "requestId", undefined))
    expect(initialState.length).toBe(0)
    expect(todolistsAfterReduce.length).toBe(2)
})
