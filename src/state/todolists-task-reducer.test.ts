import {FilterType} from "../CommonTypes/FilterType";
import {tasksReducer} from "./task-reducer";
import {addTl, todolistsReducer} from "./todolist-reducer";
import {TasksObjType, TodoListType} from "../App";


test("ids should be equals", () => {
    const task: TasksObjType = {

    }

    const todolists: TodoListType[] = [

    ]
    const action = addTl("todolist3")
    const tasksAfterReduce = tasksReducer(task, action)
    const todolistsAfterReduce = todolistsReducer(todolists, action)

    const keys = Object.keys(tasksAfterReduce)
    const idFromTask = keys[0]
    const idFromTodolists = todolistsAfterReduce[0].id

    expect(idFromTask).toBe(action.id)
    expect(idFromTodolists).toBe(action.id)
})