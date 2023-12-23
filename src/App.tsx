import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "./AddItemForm";
import {TodoList} from "./TodoList";
import {
    thunkCreateTodolist,
    thunkDeleteTodolist,
    thunkSetTodolist,
    thunkUpdateTodolist,
    updateTodolistFilter
} from "./state/todolist-reducer";
import {thunkCreateTask, thunkDeleteTask, thunkUpdateTask} from "./state/task-reducer";
import {Grid, Paper} from "@mui/material";
import './App.css';
import {useAppDispatch, useAppSelector} from "./state/store";
import {FilterType} from "./CommonTypes/FilterType";
import {TaskStatuses} from "./api/todolistApi";


export function App() {
    const todolists = useAppSelector(state => state.todolists)
    const tasks = useAppSelector(state => state.tasks)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(thunkSetTodolist())
    }, [dispatch]);

    //CRUD TASK
    const createTaskHandler = useCallback((todoListId: string, title: string) => {
        dispatch(thunkCreateTask(todoListId, title))
    }, [dispatch])
    const updateTaskStatusHandler = useCallback((todoListId: string, taskId: string, status: TaskStatuses) => {
        dispatch(thunkUpdateTask(todoListId, taskId, {status}))
    }, [dispatch])
    const updateTaskTitleHandler = useCallback((todoListId: string, taskId: string, title: string) => {
        dispatch(thunkUpdateTask(todoListId, taskId, {title}))
    }, [dispatch])
    const deleteTaskHandler = useCallback((todoListId: string, taskId: string) => {
        dispatch(thunkDeleteTask(todoListId, taskId))
    }, [dispatch])

    //CRUD TODOLIST
    const createTodolistHandler = useCallback((title: string) => {
        dispatch(thunkCreateTodolist(title))
    }, [dispatch])
    const updateFilterHandler = useCallback((todolistId: string, filterValue: FilterType) => {
        dispatch(updateTodolistFilter(todolistId, filterValue))
    }, [dispatch])
    const updateTodolistTitleHandler = useCallback((todolistId: string, title: string) => {
        dispatch(thunkUpdateTodolist(todolistId, title))
    }, [dispatch])
    const deleteTodolistHandler = useCallback((todolistId: string) => {
        dispatch(thunkDeleteTodolist(todolistId))
    }, [dispatch])


    return (
        <Grid container className="App">
            <Grid item xs={2}>
                <AddItemForm onCreate={createTodolistHandler}/>
            </Grid>
            <Grid item container spacing={2} xs={10}>
                {
                    todolists.map(tl => {
                        return (
                            <Grid item>
                                <Paper elevation={3} className="todolist">
                                    <TodoList key={tl.id}
                                              id={tl.id}
                                              title={tl.title}
                                              filterValue={tl.filter}
                                              tasks={tasks[tl.id]}
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
