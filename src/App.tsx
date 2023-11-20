import React from 'react';
import {AddItemForm} from "./AddItemForm";
import {TodoList} from "./TodoList";
import {
    createTodolist,
    deleteTodolist,
    Todolist,
    updateTodolistFilter,
    updateTodolistTitle
} from "./state/todolist-reducer";
import {createTask, deleteTask, Tasks, updateTaskStatus, updateTaskTitle} from "./state/task-reducer";
import {Grid, Paper} from "@mui/material";
import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {Store} from "./state/store";
import {FilterType} from "./CommonTypes/FilterType";



function App() {
    const todolists = useSelector<Store, Todolist[]>(state => state.todolists)
    const tasks = useSelector<Store, Tasks>(state => state.tasks)
    const dispatch = useDispatch()

    //CRUD TASK
    function createTaskHandler(todoListId: string, title: string) {
        dispatch(createTask(todoListId, title))
    }

    function updateTaskStatusHandler(todoListId: string, taskId: string, isDone: boolean) {
        dispatch(updateTaskStatus(todoListId, taskId, isDone))
    }

    function updateTaskTitleHandler(todoListId: string, taskId: string, title: string, ) {
        dispatch(updateTaskTitle(todoListId, taskId, title))
    }

    function deleteTaskHandler(todoListId: string, taskId: string) {
        dispatch(deleteTask(todoListId, taskId))
    }

    //CRUD TODOLIST
    function createTodolistHandler(title: string) {
        dispatch(createTodolist(title))
    }

    function updateFilterHandler(todolistId: string, filterValue: FilterType) {
        dispatch(updateTodolistFilter(todolistId, filterValue))
    }

    function updateTodolistTitleHandler(todolistId: string, title: string) {
        dispatch(updateTodolistTitle(todolistId, title))
    }

    function deleteTodolistHandler(todolistId: string) {
        dispatch(deleteTodolist(todolistId))
    }


    return (
        <Grid container className="App">
            <Grid item xs={2}>
                <AddItemForm onCreate={createTodolistHandler}/>
            </Grid>
            <Grid item container spacing={2} xs={10}>
                {
                    todolists.map(tl => {
                        let tasksForTodoList = tasks[tl.id]
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
