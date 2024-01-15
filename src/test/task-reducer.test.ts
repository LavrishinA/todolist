import { Tasks, taskReducer, taskActions, tasksThunks } from "features/TodolistsList/task-slice"

import { TaskPriorities, TaskStatuses } from "api/todolistApi"
import { todolistActions } from "features/TodolistsList/todolist-slice"

let task: Tasks

beforeEach(() => {
    task = {
        todolist1: [
            {
                id: "1",
                title: "CSS",
                status: TaskStatuses.New,
                todoListId: "todolistId1",
                description: "",
                startDate: null,
                deadline: null,
                addedDate: null,
                order: 0,
                priority: TaskPriorities.Low,
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.Completed,
                todoListId: "todolistId1",
                description: "",
                startDate: null,
                deadline: null,
                addedDate: null,
                order: 0,
                priority: TaskPriorities.Low,
            },
            {
                id: "3",
                title: "React",
                status: TaskStatuses.New,
                todoListId: "todolistId1",
                description: "",
                startDate: null,
                deadline: null,
                addedDate: null,
                order: 0,
                priority: TaskPriorities.Low,
            },
        ],
        todolist2: [
            {
                id: "1",
                title: "bread",
                status: TaskStatuses.New,
                todoListId: "todolistId2",
                description: "",
                startDate: null,
                deadline: null,
                addedDate: null,
                order: 0,
                priority: TaskPriorities.Low,
            },
            {
                id: "2",
                title: "milk",
                status: TaskStatuses.Completed,
                todoListId: "todolistId2",
                description: "",
                startDate: null,
                deadline: null,
                addedDate: null,
                order: 0,
                priority: TaskPriorities.Low,
            },
            {
                id: "3",
                title: "tea",
                status: TaskStatuses.New,
                todoListId: "todolistId2",
                description: "",
                startDate: null,
                deadline: null,
                addedDate: null,
                order: 0,
                priority: TaskPriorities.Low,
            },
        ],
    }
})

test("Task should be deleted", () => {
    const tasksAfterReduce = taskReducer(
        task,
        tasksThunks.deleteTask.fulfilled({ id: "todolist2", taskId: "2" }, "requestId", {
            id: "todolist2",
            taskId: "2",
        }),
    )

    expect(tasksAfterReduce["todolist1"].length).toBe(3)
    expect(tasksAfterReduce["todolist2"].length).toBe(2)
    expect(tasksAfterReduce["todolist2"].every((t) => t.id !== "2")).toBeTruthy()
})

test("Task should be added", () => {
    const tasksAfterReduce = taskReducer(
        task,
        tasksThunks.createTask.fulfilled(
            {
                id: "d3c4ef92-2d05-4670-bb9c-6f4b98c89ff6",
                title: "New task title",
                description: null,
                todoListId: "todolist2",
                order: -3,
                status: 0,
                priority: 1,
                startDate: null,
                deadline: null,
                addedDate: new Date(),
            },
            "requestId",
            { id: "todolist2", title: "New task title" },
        ),
    )

    expect(tasksAfterReduce["todolist1"].length).toBe(3)
    expect(tasksAfterReduce["todolist2"].length).toBe(4)
    expect(tasksAfterReduce["todolist2"][0].title).toBe("New task title")

    expect(tasksAfterReduce["todolist2"][0].id).toBeDefined()
})

test("Task status should be changed", () => {
    const tasksAfterReduce = taskReducer(
        task,
        taskActions.update({ id: "todolist2", taskId: "2", task: { status: TaskStatuses.New } }),
    )

    expect(tasksAfterReduce["todolist2"][1].status).toBe(TaskStatuses.New)
    expect(tasksAfterReduce["todolist1"][1].status).toBe(TaskStatuses.Completed)
})

test("Task name should be changed", () => {
    const tasksAfterReduce = taskReducer(
        task,
        taskActions.update({ id: "todolist2", taskId: "2", task: { title: "Task name changed" } }),
    )

    expect(tasksAfterReduce["todolist2"][1].title).toBe("Task name changed")
    expect(tasksAfterReduce["todolist1"][1].title).toBe("JS")
})

test("New array should be added when new todolist is added", () => {
    const newTodolist = { id: "todolistId3", title: "What to buy", addedDate: new Date(), order: 3 }

    const tasksAfterReduce = taskReducer(task, todolistActions.create(newTodolist))

    const keys = Object.keys(tasksAfterReduce)
    const newKey = keys?.find((k) => k !== "todolist1" && k !== "todolist2")
    if (!newKey) throw Error("New key undefined")

    expect(keys.length).toBe(3)

    expect(tasksAfterReduce[newKey].length).toBe(0)
    expect(tasksAfterReduce[newKey]).toEqual([])
})

test("tasks should be added for todolist", () => {
    // 1 var
    const action = tasksThunks.fetchTasks.fulfilled(
        { id: "todolist1", tasks: task["todolist1"] },
        "requestId",
        "todolistId1",
    )

    // 2 var
    // type ActionType = {
    //     type: string
    //     payload: { tasks: Tasks[]; todolistId: string }
    // }

    // const action: ActionType = {
    //     type: tasksThunks.fetchTasks.fulfilled.type,
    //     payload: { todolistId: "todolistId1", tasks: task["todolistId1"] },
    // }

    const endState = taskReducer(
        {
            todolist1: [],
            todolist2: [],
        },
        action,
    )

    expect(endState["todolist1"].length).toBe(3)
    expect(endState["todolist2"].length).toBe(0)
})
