
import {createTask, deleteTask, Tasks, tasksReducer, updateTaskStatus, updateTaskTitle,} from "./task-reducer";
import {createTodolist} from "./todolist-reducer";

let task: Tasks;

beforeEach(() => {
    task = {
        "todolist1": [
            {id: "1", title: "SocialNetwork", isDone: false},
            {id: "2", title: "TodoList", isDone: false},
            {id: "3", title: "MicroTask", isDone: true},
        ],
        "todolist2": [
            {id: "1", title: "Bread", isDone: true},
            {id: "2", title: "Milk", isDone: false},
            {id: "3", title: "Book", isDone: true},
        ]
    }
})


test("Task should be deleted", () => {
    const tasksAfterReduce = tasksReducer(task, deleteTask("todolist2", "2"))

    expect(tasksAfterReduce["todolist1"].length).toBe(3)
    expect(tasksAfterReduce["todolist2"].length).toBe(2)
    expect(tasksAfterReduce["todolist2"].every(t => t.id !== "2")).toBeTruthy()
})

test("Task should be added", () => {
    const tasksAfterReduce = tasksReducer(task, createTask("todolist2", "New task title"))

    expect(tasksAfterReduce["todolist1"].length).toBe(3)
    expect(tasksAfterReduce["todolist2"].length).toBe(4)
    expect(tasksAfterReduce["todolist2"][0].title).toBe("New task title")
    expect(tasksAfterReduce["todolist2"][0].isDone).toBeFalsy()
    expect(tasksAfterReduce["todolist2"][0].id).toBeDefined()
})

test("Task status should be changed", () => {
    const tasksAfterReduce = tasksReducer(task, updateTaskStatus("todolist2", "2", true))


    expect(tasksAfterReduce["todolist2"][1].isDone).toBeTruthy()
    expect(tasksAfterReduce["todolist1"][1].isDone).toBeFalsy()
})

test("Task name should be changed", () => {
    const tasksAfterReduce = tasksReducer(task, updateTaskTitle("todolist2", "2", "Task name changed"))


    expect(tasksAfterReduce["todolist2"][1].title).toBe("Task name changed")
    expect(tasksAfterReduce["todolist1"][1].title).toBe("TodoList")
})

test("New array should be added when new todolist is added", () => {


    const action = createTodolist("todolist3")
    const tasksAfterReduce = tasksReducer(task, action)

    const keys = Object.keys(tasksAfterReduce)
    const newKey = keys?.find(k => k !== "todolist1" && k !== "todolist2")
    if (!newKey) throw Error("New key undefined")

    expect(keys.length).toBe(3)

    expect(tasksAfterReduce[newKey].length).toBe(0)
    expect(tasksAfterReduce[newKey]).toEqual([])

})