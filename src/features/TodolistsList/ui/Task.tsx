import React, { ChangeEvent, FC, useCallback, useState } from "react"
import Checkbox from "@mui/material/Checkbox"
import { pink } from "@mui/material/colors"
import IconButton from "@mui/material/IconButton"
import DeleteForever from "@mui/icons-material/DeleteForever"
import Divider from "@mui/material/Divider"
import { EditableSpan } from "shared/ui"
import { TaskStatuses } from "shared/lib"
import { TaskItemArgs } from "../api/taskApi"

export type TaskItemType = {
    task: TaskItemArgs
    id: string
    onUpdateTaskStatus: (todoListId: string, taskId: string, status: TaskStatuses) => void
    onUpdateTaskTitle: (todoListId: string, taskId: string, title: string) => void
    onDeleteTask: (todoListId: string, taskId: string) => void
}

export const Task: FC<TaskItemType> = React.memo(({ task, id, onUpdateTaskStatus, onUpdateTaskTitle, onDeleteTask }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const updateTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        onUpdateTaskStatus(id, task.id, status)
    }
    const updateTaskTitleHandler = useCallback((title: string) => onUpdateTaskTitle(id, task.id, title), [id, onUpdateTaskTitle, task.id])

    const deleteTaskHandler = () => {
        setIsLoading(true)
        onDeleteTask(id, task.id)
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
