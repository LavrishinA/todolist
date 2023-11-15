import React from 'react';
import {AddItemForm} from "./AddItemForm";
import {TodoList} from "./TodoList";
import {createTodolist, Todolist} from "./state/todolist-reducer";
import {Grid, Paper} from "@mui/material";
import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {Store} from "./state/store";


function App() {
    const todolists = useSelector<Store, Array<Todolist>>(state => state.todolists)
    const dispatch = useDispatch()

    //CRUD TASK
    // function createTaskHandler(todoListId: string, title: string) {
    //     dispatch(createTask(todoListId, title))
    // }
    //
    // function updateTaskStatusHandler(todoListId: string, taskId: string, isDone: boolean) {
    //     dispatch(updateTaskStatus(todoListId, taskId, isDone))
    // }
    //
    // function updateTaskTitleHandler(todoListId: string, taskId: string, title: string) {
    //     dispatch(updateTaskTitle(todoListId, taskId, title))
    // }
    //
    // function deleteTaskHandler(todoListId: string, taskId: string) {
    //     dispatch(deleteTask(todoListId, taskId))
    // }

    //CRUD TODOLIST
    function createTodolistHandler(title: string) {
        dispatch(createTodolist(title))
    }

    // function updateFilterHandler(todolistId: string, filterValue: FilterType) {
    //     dispatch(updateTodolistFilter(todolistId, filterValue))
    // }
    //
    // function updateTodolistTitleHandler(todolistId: string, title: string) {
    //     dispatch(updateTodolistTitle(todolistId, title))
    // }
    //
    // function deleteTodolistHandler(todolistId: string) {
    //     dispatch(deleteTodolist(todolistId))
    // }


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
                                              listTitle={tl.listTitle}
                                              filter={tl.filter}/>
                                </Paper>
                            </Grid>)
                    })
                }
            </Grid>
        </Grid>
    )
}

export default App;
