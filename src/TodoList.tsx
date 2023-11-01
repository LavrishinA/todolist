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

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodoListPropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    filterValue: FilterType
    onDeleteTaskItem: (id: string, todoListId: string) => void
    onFilterTasks: (value: FilterType, id: string) => void
    onAddTaskItem: (taskItem: string, todoListId: string) => void
    onCheckTaskItem: (id: string, isDone: boolean, todoListId: string) => void
    onChangeTaskTitle: (id: string, title: string, todoListId: string) => void
    onDeleteTodolist: (id: string) => void
}

const TodoList: FC<TodoListPropsType> = (props) => {

    function handleTaskFilterAll() {
        props.onFilterTasks(FilterType.All, props.id)
    }

    function handleTaskFilterActive() {
        props.onFilterTasks(FilterType.Active, props.id)
    }

    function handleTaskFilterCompleted() {
        props.onFilterTasks(FilterType.Completed, props.id)
    }

    function handlerDeleteTodolist() {
        props.onDeleteTodolist(props.id)
    }

    function handleAddTask(title: string) {
        props.onAddTaskItem(title, props.id)
    }

    const onChangeTitleTaskItem = (taskID: string, title: string) => props.onChangeTaskTitle(taskID, title, props.id)
    const tasksItems = props.tasks.map(task => {
            const onDeleteTaskItem = () => props.onDeleteTaskItem(task.id, props.id)
            const onCheckTaskItem = (e: ChangeEvent<HTMLInputElement>) => props.onCheckTaskItem(task.id, e.currentTarget.checked, props.id)

            return (

                <li key={task.id}>
                    <Checkbox onChange={onCheckTaskItem} size="small" checked={task.isDone} sx={{
                        color: pink[800],
                        '&.Mui-checked': {
                            color: pink[600],
                        },
                    }}/>
                    <EditableSpan title={task.title} onChangeTitleTaskItem={(title) => onChangeTitleTaskItem(task.id, title)}/>
                    <IconButton aria-label="delete" size="small" color="primary" onClick={onDeleteTaskItem}>
                        <DeleteForever fontSize="inherit"/>
                    </IconButton>
                    <Divider/>
                </li>
            )
        }
    )

    return (
        <>
            <h3>{props.title}
                <IconButton aria-label="delete" size="small" color="primary" onClick={handlerDeleteTodolist}>
                    <DeleteForever fontSize="inherit"/>
                </IconButton>
            </h3>
            <AddItemForm onAddItem={handleAddTask}/>
            <ul>{tasksItems}</ul>
            <div>
                <ToggleButtonGroup
                    color="primary"
                    size="small"
                    value={props.filterValue}
                    exclusive
                    aria-label="Platform"
                >
                    <ToggleButton onClick={handleTaskFilterAll} value={FilterType.All}>All</ToggleButton>
                    <ToggleButton onClick={handleTaskFilterActive} value={FilterType.Active}>Active</ToggleButton>
                    <ToggleButton onClick={handleTaskFilterCompleted}
                                  value={FilterType.Completed}>Completed</ToggleButton>
                </ToggleButtonGroup>
            </div>
        </>
    );
};

export default TodoList;
