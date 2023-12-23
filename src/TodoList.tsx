import React, {FC, useCallback, useEffect} from "react";
import {FilterType} from "./CommonTypes/FilterType";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import DeleteForever from '@mui/icons-material/DeleteForever';
import ToggleButton from "@mui/material/ToggleButton/ToggleButton";
import {TaskItem} from "./TaskItem";
import {TaskItemArgs, TaskStatuses} from "./api/todolistApi";
import {useAppDispatch} from "./state/store";
import {thunkSetTasks} from "./state/task-reducer";

const filterTasks = (tasks: Array<TaskItemArgs>, filter: FilterType): Array<TaskItemArgs> => {
    if (filter === FilterType.All) return tasks
    if (filter === FilterType.Active) return tasks.filter(t => t.status === TaskStatuses.New)
    if (filter === FilterType.Completed) return tasks.filter(t => t.status === TaskStatuses.Completed)
    return tasks
}


type Todolist = {
    id: string
    title: string
    tasks: Array<TaskItemArgs>
    filterValue: FilterType
    onCreateTask: (todoListId: string, taskTitle: string) => void
    onUpdateTaskStatus: (todoListId: string, taskId: string, status: TaskStatuses) => void
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
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(thunkSetTasks(id))
    }, [dispatch, id]);

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



