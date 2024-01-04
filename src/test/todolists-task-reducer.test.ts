import {Tasks, tasksReducer} from "../features/TodolistsList/task-reducer";
import {createTodolist, TodolistUI, todolistsReducer, FilterType} from "../features/TodolistsList/todolist-reducer";


test("ids should be equals", () => {
    const task: Tasks = {}
    const todolists: TodolistUI[] = []

    const newTodolist = {id: "todolistId3", title: "What to buy", addedDate: new Date(), order: 3, filter: FilterType.All}
    const action = createTodolist(newTodolist)
    const tasksAfterReduce = tasksReducer(task, action)
    const todolistsAfterReduce = todolistsReducer(todolists, action)

    const keys = Object.keys(tasksAfterReduce)
    const idFromTask = keys[0]
    const idFromTodolists = todolistsAfterReduce[0].id

    expect(idFromTask).toBe(action.todolist.id)
    expect(idFromTodolists).toBe(action.todolist.id)
})