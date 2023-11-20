import React, {useReducer} from 'react';
import {AddItemForm} from "./AddItemForm";
import {TodoList, Task} from "./TodoList";
import {
    createTodolist,
    deleteTodolist,
    todolistsReducer,
    updateTodolistFilter,
    updateTodolistTitle
} from "./state/todolist-reducer";
import {createTask, deleteTask, tasksReducer, updateTaskStatus, updateTaskTitle} from "./state/task-reducer";
import {v1} from "uuid";
import {Grid, Paper} from "@mui/material";
import {FilterType} from "./CommonTypes/FilterType";
import './App.css';


export type Todolist = {
    id: string
    listTitle: string
    filter: FilterType
}

export type Tasks = {
    [key: string]: Array<Task>
}

const todolist1 = v1();
const todolist2 = v1();

function App() {
    const [todolists, dispatchTl] = useReducer(todolistsReducer, [
        {id: todolist1, listTitle: "What to learn", filter: FilterType.All},
        {id: todolist2, listTitle: "What to buy", filter: FilterType.All}
    ])

    const [task, dispatchTask] = useReducer(tasksReducer, {
        [todolist1]: [
            {id: v1(), title: "SocialNetwork", isDone: false},
            {id: v1(), title: "TodoList", isDone: false},
            {id: v1(), title: "MicroTask", isDone: true},
        ],
        [todolist2]: [
            {id: v1(), title: "Bread", isDone: true},
            {id: v1(), title: "Milk", isDone: false},
            {id: v1(), title: "Book", isDone: true},
        ]
    })
    //CRUD TASK
    function createTaskHandler(todoListId: string, title: string) {
        dispatchTask(createTask(todoListId, title))
    }

    function updateTaskStatusHandler(todoListId: string, taskId: string, isDone: boolean) {
        dispatchTask(updateTaskStatus(todoListId, taskId, isDone))
    }

    function updateTaskTitleHandler(todoListId: string, taskId: string, title: string, ) {
        dispatchTask(updateTaskTitle(todoListId, taskId, title))
    }

    function deleteTaskHandler(todoListId: string, taskId: string) {
        dispatchTask(deleteTask(todoListId, taskId))
    }

    //CRUD TODOLIST
    function createTodolistHandler(title: string) {
        const action = createTodolist(title)
        dispatchTl(action)
        dispatchTask(action)
    }

    function updateFilterHandler(todolistId: string, filterValue: FilterType) {
        dispatchTl(updateTodolistFilter(todolistId, filterValue))
    }

    function updateTodolistTitleHandler(todolistId: string, title: string) {
        dispatchTl(updateTodolistTitle(todolistId, title))
    }

    function deleteTodolistHandler(todolistId: string) {
        dispatchTl(deleteTodolist(todolistId))
        dispatchTask(deleteTodolist(todolistId))
    }


    return (
        <Grid container className="App">
            <Grid item xs={2}>
                <AddItemForm onCreate={createTodolistHandler}/>
            </Grid>
            <Grid item container spacing={2} xs={10}>
                {
                    todolists.map(tl => {
                        let tasksForTodoList = task[tl.id]
                        if (tl.filter === "active") {
                            tasksForTodoList = tasksForTodoList.filter(task => !task.isDone)
                        }
                        if (tl.filter === "completed") {
                            tasksForTodoList = tasksForTodoList.filter(task => task.isDone)
                        }
                        return (
                            <Grid item>
                                <Paper elevation={3} className="todolist">
                                    <TodoList key={tl.id}
                                              id={tl.id}
                                              title={tl.listTitle}
                                              filterValue={tl.filter}
                                              tasks={tasksForTodoList}
                                              onDeleteTask={deleteTaskHandler}
                                              onCreateTask={createTaskHandler}
                                              onUpdateTaskStatus={updateTaskStatusHandler}
                                              onUpdateTaskTitle={updateTaskTitleHandler}
                                              onUpdateFilter={updateFilterHandler}
                                              onDeleteTodolist={deleteTodolistHandler}
                                              onUpdateTodolistTitle={updateTodolistTitleHandler}/>
                                </Paper>
                            </Grid>)
                    })
                }
            </Grid>
        </Grid>
    )
}

export default App;
