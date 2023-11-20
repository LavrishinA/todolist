import {Tasks, tasksReducer} from "./task-reducer";
import {createTodolist, Todolist, todolistsReducer} from "./todolist-reducer";


test("ids should be equals", () => {
    const task: Tasks = {

    }

    const todolists: Todolist[] = [

    ]
    const action = createTodolist("todolist3")
    const tasksAfterReduce = tasksReducer(task, action)
    const todolistsAfterReduce = todolistsReducer(todolists, action)

    const keys = Object.keys(tasksAfterReduce)
    const idFromTask = keys[0]
    const idFromTodolists = todolistsAfterReduce[0].id

    expect(idFromTask).toBe(action.id)
    expect(idFromTodolists).toBe(action.id)
})