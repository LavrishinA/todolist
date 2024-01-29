import React, { FC, useCallback, useEffect } from "react"
import Paper from "@mui/material/Paper/Paper"
import Grid from "@mui/material/Grid/Grid"
import { Navigate } from "react-router-dom"

import { AddItemForm } from "shared/ui"
import { Todolist } from "./Todolist"
import { FilterType, TaskStatuses, useAppDispatch, useAppSelector } from "shared/lib"
import { taskSelectors, tasksThunks, todolistActions, todolistSelectors } from "../model"
import { authSelectors } from "features/Login"

export const TodolistLists = () => {
    const todolists = useAppSelector(todolistSelectors.todolists)
    const tasks = useAppSelector(taskSelectors.tasks)
    const isLoggedIn = useAppSelector(authSelectors.isLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isLoggedIn) return
        dispatch(todolistActions.fetchTodolists())
    }, [dispatch, isLoggedIn])

    //CRUD TASK
    const createTaskHandler = useCallback(
        (id: string, title: string) => {
            dispatch(tasksThunks.createTask({ id, title }))
        },
        [dispatch],
    )
    const updateTaskStatusHandler = useCallback(
        (id: string, taskId: string, status: TaskStatuses) => {
            dispatch(tasksThunks.updateTask({ id, taskId, task: { status } }))
        },
        [dispatch],
    )
    const updateTaskTitleHandler = useCallback(
        (id: string, taskId: string, title: string) => {
            dispatch(tasksThunks.updateTask({ id, taskId, task: { title } }))
        },
        [dispatch],
    )
    const deleteTaskHandler = useCallback(
        (id: string, taskId: string) => {
            dispatch(tasksThunks.deleteTask({ id, taskId }))
        },
        [dispatch],
    )

    //CRUD TODOLIST
    const createTodolistHandler = useCallback(
        (title: string) => {
            dispatch(todolistActions.createTodolist(title))
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
        (id: string, title: string) => {
            dispatch(todolistActions.updateTodolist({ id, title }))
        },
        [dispatch],
    )
    const deleteTodolistHandler = useCallback(
        (todolistId: string) => {
            dispatch(todolistActions.deleteTodolist(todolistId))
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
