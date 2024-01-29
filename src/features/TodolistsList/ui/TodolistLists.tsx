import React, { useCallback, useEffect } from "react"
import Paper from "@mui/material/Paper/Paper"
import Grid from "@mui/material/Grid/Grid"
import { Navigate } from "react-router-dom"
import { AddItemForm } from "shared/ui"
import { Todolist } from "./Todolist"
import { useAppDispatch, useAppSelector } from "shared/lib"
import { taskSelectors, todolistActions, todolistSelectors } from "../model"
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

    const createTodolistHandler = useCallback(
        (title: string) => {
            dispatch(todolistActions.createTodolist(title))
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
                            />
                        </Paper>
                    </Grid>
                )
            })}
        </Grid>
    )
}
