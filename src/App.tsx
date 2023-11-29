import React, {useCallback} from 'react';
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


export function App() {
    const todolists = useSelector<Store, Todolist[]>(state => state.todolists)
    const tasks = useSelector<Store, Tasks>(state => state.tasks)
    const dispatch = useDispatch()

    //CRUD TASK
    const createTaskHandler = useCallback((todoListId: string, title: string) => dispatch(createTask(todoListId, title)), [dispatch])
    const updateTaskStatusHandler = useCallback((todoListId: string, taskId: string, isDone: boolean) => dispatch(updateTaskStatus(todoListId, taskId, isDone)), [dispatch])
    const updateTaskTitleHandler = useCallback((todoListId: string, taskId: string, title: string) => dispatch(updateTaskTitle(todoListId, taskId, title)), [dispatch])
    const deleteTaskHandler = useCallback((todoListId: string, taskId: string) => dispatch(deleteTask(todoListId, taskId)), [dispatch])

    //CRUD TODOLIST
    const createTodolistHandler = useCallback((title: string) => dispatch(createTodolist(title)), [dispatch])
    const updateFilterHandler = useCallback((todolistId: string, filterValue: FilterType) => dispatch(updateTodolistFilter(todolistId, filterValue)), [dispatch])
    const updateTodolistTitleHandler = useCallback((todolistId: string, title: string) => dispatch(updateTodolistTitle(todolistId, title)), [dispatch])
    const deleteTodolistHandler = useCallback((todolistId: string) => dispatch(deleteTodolist(todolistId)), [dispatch])


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
                                              title={tl.listTitle}
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
