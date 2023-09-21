import React, {ChangeEvent, KeyboardEvent, FC, useState} from "react";
import {FilterType} from "./CommonTypes/FilterType";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodoListPropsType = {
    title: string
    tasks: Array<TaskType>
    onDeleteTaskItem: (id: string) => void
    onFilterTasks: (value: FilterType) => void
    onAddTaskItem: (taskItem: string) => void
}

const TodoList: FC<TodoListPropsType> = (props) => {
    const [taskItem, setTaskItem] = useState("");

    function handleTaskListInput(e: ChangeEvent<HTMLInputElement>) {
        setTaskItem(e.currentTarget.value)
    }

    function handleAddTaskItem() {
        props.onAddTaskItem(taskItem);
        setTaskItem("")
    }

    function handleAddTaskItemOnPressEnter(e: KeyboardEvent<HTMLInputElement>) {
        e.key === "Enter" && handleAddTaskItem();
    }

    function handleTaskFilterAll() {
        props.onFilterTasks(FilterType.All)
    }

    function handleTaskFilterActive() {
        props.onFilterTasks(FilterType.Active)
    }

    function handleTaskFilterCompleted() {
        props.onFilterTasks(FilterType.Completed)
    }

    const tasksItems = props.tasks.map(task => {
            const onDeleteTask = () => props.onDeleteTaskItem(task.id)
            return (
                <li key={task.id}>
                    <input type="checkbox" checked={task.isDone}/>
                    <span>{task.title}</span>
                    <button onClick={onDeleteTask}>&otimes;</button>
                </li>
            )
        }
    )


    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input value={taskItem}
                       onChange={handleTaskListInput}
                       onKeyDown={handleAddTaskItemOnPressEnter}/>
                <button onClick={handleAddTaskItem}>+</button>
            </div>
            <ul>{tasksItems}</ul>
            <div>
                <button onClick={handleTaskFilterAll}>All</button>
                <button onClick={handleTaskFilterActive}>Active</button>
                <button onClick={handleTaskFilterCompleted}>Completed</button>
            </div>
        </div>
    );
};

export default TodoList;