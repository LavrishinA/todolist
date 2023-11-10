import React, {ChangeEvent, FC} from "react";
import {FilterType} from "./CommonTypes/FilterType";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import DeleteForever from '@mui/icons-material/DeleteForever';
import {pink} from "@mui/material/colors";
import ToggleButton from "@mui/material/ToggleButton/ToggleButton";

export type Task = {
    id: string
    title: string
    isDone: boolean
}

type Todolist = {
    id: string
    title: string
    tasks: Array<Task>
    filterValue: FilterType
    onCreateTask: (todoListId: string, taskTitle: string) => void
    onUpdateTaskStatus: (todoListId: string, taskId: string, isDone: boolean) => void
    onUpdateTaskTitle: (todoListId: string, taskId: string, title: string) => void
    onDeleteTask: (todoListId: string, taskId: string) => void
    onUpdateFilter: (todolistId: string, value: FilterType) => void
    onUpdateTodolistTitle: (todolistId: string, title: string) => void
    onDeleteTodolist: (todolistId: string) => void
}

export const TodoList: FC<Todolist> = ({
                                           id,
                                           title,
                                           tasks,
                                           filterValue,
                                           onCreateTask,
                                           onUpdateFilter,
                                           onUpdateTaskStatus,
                                           onUpdateTaskTitle,
                                           onDeleteTask,
                                           onDeleteTodolist,
                                           onUpdateTodolistTitle
                                       }) => {

    const filterAllHandler = () => onUpdateFilter(id, FilterType.All)
    const filterActiveHandler = () => onUpdateFilter(id, FilterType.Active)
    const filterCompletedHandler = () => onUpdateFilter(id, FilterType.Completed)

    const updateTaskTitleHandler = (taskId: string, title: string) => onUpdateTaskTitle(id, taskId, title)
    const deleteTodolistHandler = () => onDeleteTodolist(id)
    const todolistTitleHandler = (title: string) => onUpdateTodolistTitle(id, title)

    function createTaskHandler(title: string) {
        onCreateTask(id, title)
    }

    const tasksItems = tasks.map(task => {
            const deleteTaskHandler = () => onDeleteTask(id, task.id)
            const updateTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => onUpdateTaskStatus(id, task.id, e.currentTarget.checked)

            return (

                <li key={task.id}>
                    <Checkbox onChange={updateTaskStatusHandler} size="small" checked={task.isDone} sx={{
                        color: pink[800],
                        '&.Mui-checked': {
                            color: pink[600],
                        },
                    }}/>
                    <EditableSpan title={task.title} onChange={(title) => updateTaskTitleHandler(task.id, title)}/>
                    <IconButton aria-label="delete" size="small" color="primary" onClick={deleteTaskHandler}>
                        <DeleteForever fontSize="inherit"/>
                    </IconButton>
                    <Divider/>
                </li>
            )
        }
    )

    return (
        <>
            <EditableSpan title={title} onChange={todolistTitleHandler}>
                <IconButton aria-label="delete" size="small" color="primary" onClick={deleteTodolistHandler}>
                    <DeleteForever fontSize="inherit"/>
                </IconButton>
            </EditableSpan>
            <AddItemForm onCreate={createTaskHandler}/>
            <ul>{tasksItems}</ul>
            <div>
                <ToggleButtonGroup
                    color="primary"
                    size="small"
                    value={filterValue}
                    exclusive
                    aria-label="Platform"
                >
                    <ToggleButton onClick={filterAllHandler} value={FilterType.All}>All</ToggleButton>
                    <ToggleButton onClick={filterActiveHandler} value={FilterType.Active}>Active</ToggleButton>
                    <ToggleButton onClick={filterCompletedHandler} value={FilterType.Completed}>Completed</ToggleButton>
                </ToggleButtonGroup>
            </div>
        </>
    );
};


