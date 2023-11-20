import React, {ChangeEvent, FC, useCallback} from "react";
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
import {Task} from "./state/task-reducer";

const filterTasks = (tasks: Array<Task>, filter: FilterType): Array<Task> => {
    if (filter === FilterType.All) return tasks
    if (filter === FilterType.Active) return tasks.filter(t => !t.isDone)
    if (filter === FilterType.Completed) return tasks.filter(t => t.isDone)
    return tasks
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

export const TodoList: FC<Todolist> = React.memo(({
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

    const filterAllHandler = useCallback(() => onUpdateFilter(id, FilterType.All), [id, onUpdateFilter])
    const filterActiveHandler = useCallback(() => onUpdateFilter(id, FilterType.Active), [id, onUpdateFilter])
    const filterCompletedHandler = useCallback(() => onUpdateFilter(id, FilterType.Completed), [id, onUpdateFilter])


    const deleteTodolistHandler = useCallback(() => onDeleteTodolist(id), [id, onDeleteTodolist])
    const todolistTitleHandler = useCallback((title: string) => onUpdateTodolistTitle(id, title), [id, onUpdateTodolistTitle])

    const createTaskHandler = useCallback((title: string) => onCreateTask(id, title), [id, onCreateTask])


    const taskItems = filterTasks(tasks, filterValue)
    const tasksForRender = taskItems.map(task => <TaskItem key={task.id}
                                                           task={task}
                                                           id={id}
                                                           onUpdateTaskStatus={onUpdateTaskStatus}
                                                           onUpdateTaskTitle={onUpdateTaskTitle}
                                                           onDeleteTask={onDeleteTask}/>)

    return (
        <>
            <h4>
            <EditableSpan title={title} onChange={todolistTitleHandler}/>
                <IconButton aria-label="delete" size="small" color="primary" onClick={deleteTodolistHandler}>
                    <DeleteForever fontSize="inherit"/>
                </IconButton>
            </h4>

            <AddItemForm onCreate={createTaskHandler}/>
            <ul>{tasksForRender}</ul>
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
});


type TaskItemType = {
    task: Task
    id: string
    onUpdateTaskStatus: (todoListId: string, taskId: string, isDone: boolean) => void
    onUpdateTaskTitle: (todoListId: string, taskId: string, title: string) => void
    onDeleteTask: (todoListId: string, taskId: string) => void
}


const TaskItem: FC<TaskItemType> = React.memo(({task, id, onUpdateTaskStatus, onUpdateTaskTitle, onDeleteTask}) => {

    const updateTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => onUpdateTaskStatus(id, task.id, e.currentTarget.checked)
    const updateTaskTitleHandler = useCallback((title: string) => onUpdateTaskTitle(id, task.id, title), [id, onUpdateTaskTitle, task.id])
    const deleteTaskHandler = () => onDeleteTask(id, task.id)

    return (
        <li key={id}>
            <Checkbox onChange={updateTaskStatusHandler} size="small" checked={task.isDone} sx={{
                color: pink[800],
                '&.Mui-checked': {
                    color: pink[600],
                },
            }}/>
            <EditableSpan title={task.title} onChange={updateTaskTitleHandler}/>
            <IconButton aria-label="delete" size="small" color="primary" onClick={deleteTaskHandler}>
                <DeleteForever fontSize="inherit"/>
            </IconButton>
            <Divider/>
        </li>
    );
});

