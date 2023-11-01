import React, {useReducer} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";
import {FilterType} from "./CommonTypes/FilterType";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {Grid, Paper} from "@mui/material";
import {addTl, removeTl, todolistsReducer, updateFilterTl} from "./state/todolist-reducer";
import {addTask, changeTaskStatus, changeTaskTitle, deleteTask, tasksReducer} from "./state/task-reducer";


export type TodoListType = {
    id: string
    listTitle: string
    filter: FilterType
}

export type TasksObjType = {
    [key: string]: Array<TaskType>
}
const todolist1 = v1();
const todolist2 = v1();

function App() {

    const [todolists, dispatchTl] = useReducer(todolistsReducer, [
        {id: todolist1, listTitle: "What to learn", filter: FilterType.All},
        {id: todolist2, listTitle: "What to buy", filter: FilterType.All}
    ])

    const [tasksObj, dispatchTask] = useReducer(tasksReducer, {
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


    function onDeleteTaskItem(id: string, todoListId: string) {
        dispatchTask(deleteTask(id, todoListId))
    }


    function onAddTaskItem(taskItem: string, todoListId: string) {
        dispatchTask(addTask(taskItem, todoListId))
        console.log(tasksObj)
    }

    function onCheckTaskItem(id: string, isDone: boolean, todoListId: string) {
            dispatchTask(changeTaskStatus(id, isDone, todoListId))
    }


    function onChangeTaskTitle(id: string, title: string, todoListId: string) {
            dispatchTask(changeTaskTitle(id, title, todoListId))
    }

    function onFilterTasks( id: string, filterValue: FilterType) {
            dispatchTl(updateFilterTl(id, filterValue))
    }

    function onDeleteTodolist(todolistId: string) {
        dispatchTl(removeTl(todolistId))
        dispatchTask(removeTl(todolistId))
    }

    function onAddTodoList(title: string) {
        const action = addTl(title)
        dispatchTl(action)
        dispatchTask(action)

    }
    console.log(todolists)
    console.log(tasksObj)
    return (
        <Grid container className="App">
            <Grid item xs={2}>
                <AddItemForm onAddItem={onAddTodoList}/>
            </Grid>
            <Grid item container spacing={2} xs={10}>
                {
                    todolists.map(tl => {
                        let tasksForTodoList = tasksObj[tl.id]
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
                                              onDeleteTaskItem={onDeleteTaskItem}
                                              onFilterTasks={onFilterTasks}
                                              onChangeTaskTitle={onChangeTaskTitle}
                                              onAddTaskItem={onAddTaskItem}
                                              onCheckTaskItem={onCheckTaskItem}
                                              onDeleteTodolist={onDeleteTodolist}/>
                                </Paper>
                            </Grid>)
                    })
                }
            </Grid>
        </Grid>
    )
}

export default App;
