import React, { FC, useCallback, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "app/store"
import {
    FilterType,
    thunkCreateTodolist,
    thunkDeleteTodolist,
    thunkSetTodolist,
    thunkUpdateTodolist,
    todolistActions,
} from "features/TodolistsList/todolist-slice"
import { thunkCreateTask, thunkDeleteTask, thunkUpdateTask } from "features/TodolistsList/task-slice"
import { TaskStatuses } from "api/todolistApi"
import { AddItemForm } from "components/AddItemForm/AddItemForm"
import { Todolist } from "./Todolist/Todolist"
import Paper from "@mui/material/Paper/Paper"
import Grid from "@mui/material/Grid/Grid"
import { Navigate } from "react-router-dom"
import { selectIsLoggedIn } from "features/Login/auth-selectors"
import { selectTodolist } from "features/TodolistsList/todolist-selectors"
import { selectTask } from "features/TodolistsList/task-selectors"

export const TodolistLists: FC = () => {
    const todolists = useAppSelector(selectTodolist)
    const tasks = useAppSelector(selectTask)
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isLoggedIn) return
        dispatch(thunkSetTodolist())
    }, [dispatch, isLoggedIn])

    //CRUD TASK
    const createTaskHandler = useCallback(
        (todoListId: string, title: string) => {
            dispatch(thunkCreateTask(todoListId, title))
        },
        [dispatch],
    )
    const updateTaskStatusHandler = useCallback(
        (todoListId: string, taskId: string, status: TaskStatuses) => {
            dispatch(thunkUpdateTask(todoListId, taskId, { status }))
        },
        [dispatch],
    )
    const updateTaskTitleHandler = useCallback(
        (todoListId: string, taskId: string, title: string) => {
            dispatch(thunkUpdateTask(todoListId, taskId, { title }))
        },
        [dispatch],
    )
    const deleteTaskHandler = useCallback(
        (todoListId: string, taskId: string) => {
            dispatch(thunkDeleteTask(todoListId, taskId))
        },
        [dispatch],
    )

    //CRUD TODOLIST
    const createTodolistHandler = useCallback(
        (title: string) => {
            dispatch(thunkCreateTodolist(title))
        },
        [dispatch],
    )
    const updateFilterHandler = useCallback(
        (id: string, filterValue: FilterType) => {
            dispatch(todolistActions.updateFilter({ id, filter: filterValue }))
        },
        [dispatch],
    )
    const updateTodolistTitleHandler = useCallback(
        (todolistId: string, title: string) => {
            dispatch(thunkUpdateTodolist(todolistId, title))
        },
        [dispatch],
    )
    const deleteTodolistHandler = useCallback(
        (todolistId: string) => {
            dispatch(thunkDeleteTodolist(todolistId))
        },
        [dispatch],
    )

    if (!isLoggedIn) {
        return <Navigate to={"/login"} />
    }

    return (
        <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12}>
                <AddItemForm onCreate={createTodolistHandler} />
            </Grid>

            {todolists.map((tl) => {
                return (
                    <Grid item xs={4} sm={4} md={"auto"} key={tl.id}>
                        <Paper elevation={3} className="todolist">
                            <Todolist
                                key={tl.id}
                                id={tl.id}
                                entityStatus={tl.entityStatus}
                                title={tl.title}
                                filterValue={tl.filter}
                                tasks={tasks[tl.id]}
                                onDeleteTask={deleteTaskHandler}
                                onCreateTask={createTaskHandler}
                                onUpdateTaskStatus={updateTaskStatusHandler}
                                onUpdateTaskTitle={updateTaskTitleHandler}
                                onUpdateFilter={updateFilterHandler}
                                onDeleteTodolist={deleteTodolistHandler}
                                onUpdateTodolistTitle={updateTodolistTitleHandler}
                            />
                        </Paper>
                    </Grid>
                )
            })}
        </Grid>
    )
}
