import React, { ChangeEvent, useCallback, useState } from "react"
import Checkbox from "@mui/material/Checkbox"
import { pink } from "@mui/material/colors"
import IconButton from "@mui/material/IconButton"
import DeleteForever from "@mui/icons-material/DeleteForever"
import Divider from "@mui/material/Divider"
import { EditableSpan } from "shared/ui"
import { TaskStatuses, useAppDispatch } from "shared/lib"
import { TaskItemArgs } from "../api/taskApi"
import { tasksThunks } from "features/TodolistsList/model"

type Props = {
    task: TaskItemArgs
    id: string
}

export const Task = React.memo(({ task, id }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const updateTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(tasksThunks.updateTask({ id, taskId: task.id, task: { status } }))
    }

    const updateTaskTitleHandler = useCallback(
        (title: string) => dispatch(tasksThunks.updateTask({ id, taskId: task.id, task: { title } })),
        [id, task.id, dispatch],
    )

    const deleteTaskHandler = () => {
        setIsLoading(true)
        dispatch(tasksThunks.deleteTask({ id, taskId: task.id }))
    }

    return (
        <li key={id}>
            <Checkbox
                onChange={updateTaskStatusHandler}
                size="small"
                checked={task.status === TaskStatuses.Completed}
                sx={{
                    color: pink[800],
                    "&.Mui-checked": {
                        color: pink[600],
                    },
                }}
            />
            <EditableSpan title={task.title} onChange={updateTaskTitleHandler} />
            <IconButton aria-label="delete" size="small" color="primary" onClick={deleteTaskHandler} disabled={isLoading}>
                <DeleteForever fontSize="inherit" />
            </IconButton>
            <Divider />
        </li>
    )
})
