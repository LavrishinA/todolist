import {TasksObjType} from "../App";
import {addTask, changeTaskStatus, changeTaskTitle, deleteTask, tasksReducer} from "./task-reducer";
import {FilterType} from "../CommonTypes/FilterType";
import {addTl} from "./todolist-reducer";

let task: TasksObjType;

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
    const tasksAfterReduce = tasksReducer(task, deleteTask("2", "todolist2"))

    expect(tasksAfterReduce["todolist1"].length).toBe(3)
    expect(tasksAfterReduce["todolist2"].length).toBe(2)
    expect(tasksAfterReduce["todolist2"].every(t => t.id !== "2")).toBeTruthy()
})

test("Task should be added", () => {
    const tasksAfterReduce = tasksReducer(task, addTask("New task title", "todolist2"))

    expect(tasksAfterReduce["todolist1"].length).toBe(3)
    expect(tasksAfterReduce["todolist2"].length).toBe(4)
    expect(tasksAfterReduce["todolist2"][0].title).toBe("New task title")
    expect(tasksAfterReduce["todolist2"][0].isDone).toBeFalsy()
    expect(tasksAfterReduce["todolist2"][0].id).toBeDefined()
})

test("Task status should be changed", () => {
    const tasksAfterReduce = tasksReducer(task, changeTaskStatus("2", true, "todolist2"))


    expect(tasksAfterReduce["todolist2"][1].isDone).toBeTruthy()
    expect(tasksAfterReduce["todolist1"][1].isDone).toBeFalsy()
})

test("Task name should be changed", () => {
    const tasksAfterReduce = tasksReducer(task, changeTaskTitle("2", "Task name changed", "todolist2"))


    expect(tasksAfterReduce["todolist2"][1].title).toBe("Task name changed")
    expect(tasksAfterReduce["todolist1"][1].title).toBe("TodoList")
})

test("New array shoul be added when new todolist is added", () => {
    debugger
    const todolists = [
        {id: "todolist1", listTitle: "What to learn", filter: FilterType.All},
        {id: "todolist2", listTitle: "What to buy", filter: FilterType.All}
    ]

    const action = addTl("todolist3")
    const tasksAfterReduce = tasksReducer(task, action)

    const keys = Object.keys(tasksAfterReduce)
    const newKey = keys?.find(k => k !== "todolist1" && k !== "todolist2")
    if(!newKey) throw Error("New key undefined")

    expect(keys.length).toBe(3)

    expect(tasksAfterReduce[newKey].length).toBe(0)
    expect(tasksAfterReduce[newKey]).toEqual([])

})