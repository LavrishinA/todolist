import React, {ChangeEvent, FC} from "react";
import {FilterType} from "./CommonTypes/FilterType";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import Checkbox from "@mui/material/Checkbox";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DeleteForever from '@mui/icons-material/DeleteForever';
import {pink} from "@mui/material/colors";
import ToggleButton from "@mui/material/ToggleButton/ToggleButton";
import {useDispatch, useSelector} from "react-redux";
import {Task, createTask, deleteTask, updateTaskStatus, updateTaskTitle} from "./state/task-reducer";
import {Store} from "./state/store";
import {Todolist, deleteTodolist, updateTodolistFilter, updateTodolistTitle} from "./state/todolist-reducer";

const filterTasks = (tasks: Array<Task>, filter: FilterType): Array<Task> => {
    if (filter === FilterType.Active) return tasks.filter(t => !t.isDone)
    if (filter === FilterType.Completed) return tasks.filter(t => t.isDone)
    return tasks
}


export const TodoList: FC<Todolist> = ({
                                           id,
                                           listTitle,
                                           filter,
                                       }) => {
    const tasks = useSelector<Store, Array<Task>>(state => state.tasks[id])
    const dispatch = useDispatch()

    const filterAllHandler = () => dispatch(updateTodolistFilter(id, FilterType.All))
    const filterActiveHandler = () => dispatch(updateTodolistFilter(id, FilterType.Active))
    const filterCompletedHandler = () => dispatch(updateTodolistFilter(id, FilterType.Completed))

    const createTaskHandler = (title: string) => dispatch(createTask(id, title))
    const updateTaskTitleHandler = (taskId: string, title: string) => dispatch(updateTaskTitle(id, taskId, title))

    const deleteTodolistHandler = () => dispatch(deleteTodolist(id))
    const updateTodolistTitleHandler = (title: string) => dispatch(updateTodolistTitle(id, title))

    const taskForRender = filterTasks(tasks, filter)

    const tasksItems = taskForRender.map(task => {
            const deleteTaskHandler = () => dispatch(deleteTask(id, task.id))
            const updateTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => dispatch(updateTaskStatus(id, task.id, e.currentTarget.checked))
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
            <EditableSpan title={listTitle} onChange={updateTodolistTitleHandler}>
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
                    value={filter}
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


