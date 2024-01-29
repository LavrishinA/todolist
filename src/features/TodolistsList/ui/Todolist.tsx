import React, { useCallback, useEffect } from "react"
import { Task } from "features/TodolistsList/ui/Task"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import IconButton from "@mui/material/IconButton"
import DeleteForever from "@mui/icons-material/DeleteForever"
import ToggleButton from "@mui/material/ToggleButton"
import { RequestStatus } from "app/app-slice"
import { AddItemForm, EditableSpan } from "shared/ui"
import { FilterType, useAppDispatch } from "shared/lib"
import { tasksThunks, todolistActions } from "../model"
import { TaskItemArgs } from "../api"
import { filterTasks } from "features/TodolistsList/lib/filterTask"

type Props = {
    id: string
    title: string
    entityStatus: RequestStatus
    tasks: Array<TaskItemArgs>
    filterValue: FilterType
}

export const Todolist = React.memo(({ id, title, entityStatus, tasks, filterValue }: Props) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(tasksThunks.fetchTasks(id))
    }, [dispatch, id])

    const filterAllHandler = () => dispatch(todolistActions.updateFilter({ id, filter: FilterType.All }))
    const filterActiveHandler = () => dispatch(todolistActions.updateFilter({ id, filter: FilterType.Active }))
    const filterCompletedHandler = () => dispatch(todolistActions.updateFilter({ id, filter: FilterType.Completed }))

    const deleteTodolistHandler = () => dispatch(todolistActions.deleteTodolist(id))
    const todolistTitleHandler = useCallback((title: string) => dispatch(todolistActions.updateTodolist({ id, title })), [id, dispatch])
    const createTaskHandler = useCallback((title: string) => dispatch(tasksThunks.createTask({ id, title })), [id, dispatch])

    const taskItems = filterTasks(tasks, filterValue)

    const tasksForRender = taskItems.map((task) => <Task key={task.id} task={task} id={id} />)

    return (
        <>
            <h4>
                <EditableSpan title={title} onChange={todolistTitleHandler} disabled={entityStatus === "loading"} />
                <IconButton
                    aria-label="delete"
                    size="small"
                    color="primary"
                    onClick={deleteTodolistHandler}
                    disabled={entityStatus === "loading"}
                >
                    <DeleteForever fontSize="inherit" />
                </IconButton>
            </h4>

            <AddItemForm onCreate={createTaskHandler} disabled={entityStatus === "loading"} />
            <ul>{tasksForRender}</ul>
            <div>
                <ToggleButtonGroup color="primary" size="small" value={filterValue} exclusive aria-label="Platform">
                    <ToggleButton onClick={filterAllHandler} value={FilterType.All}>
                        All
                    </ToggleButton>
                    <ToggleButton onClick={filterActiveHandler} value={FilterType.Active}>
                        Active
                    </ToggleButton>
                    <ToggleButton onClick={filterCompletedHandler} value={FilterType.Completed}>
                        Completed
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
        </>
    )
})
