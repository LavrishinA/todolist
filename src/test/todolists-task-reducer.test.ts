import { FilterType } from "shared/lib"
import { taskReducer, Tasks, todolistActions, todolistReducer, TodolistUI } from "features/TodolistsList/model"

test("ids should be equals", () => {
    const task: Tasks = {}
    const todolists: TodolistUI[] = []

    const newTodolist = {
        id: "todolistId3",
        title: "What to buy",
        addedDate: new Date(),
        order: 3,
        filter: FilterType.All,
    }
    const action = todolistActions.createTodolist.fulfilled(newTodolist, "requestId", "What to buy")
    const tasksAfterReduce = taskReducer(task, action)
    const todolistsAfterReduce = todolistReducer(todolists, action)

    const keys = Object.keys(tasksAfterReduce)
    const idFromTask = keys[0]
    const idFromTodolists = todolistsAfterReduce[0].id

    expect(idFromTask).toBe(action.payload.id)
    expect(idFromTodolists).toBe(action.payload.id)
})
