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
    filterValue: string
    onDeleteTaskItem: (id: string) => void
    onFilterTasks: (value: FilterType) => void
    onAddTaskItem: (taskItem: string) => void
    onCheckTaskItem: (id: string, isDone: boolean) => void
}

const TodoList: FC<TodoListPropsType> = (props) => {
    const [taskItem, setTaskItem] = useState("")
    const [error, setError] = useState<null | string>(null)

    function handleTaskListInput(e: ChangeEvent<HTMLInputElement>) {
        setTaskItem(e.currentTarget.value)
    }

    function handleAddTaskItem() {
        if (!taskItem.trim()) {
            setError("Title is required")
            return
        }

        props.onAddTaskItem(taskItem.trim())
        setTaskItem("")
        setError(null)
    }

    function handleAddTaskItemOnPressEnter(e: KeyboardEvent<HTMLInputElement>) {
        setError(null)
        e.key === "Enter" && handleAddTaskItem()
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
            const onDeleteTaskItem = () => props.onDeleteTaskItem(task.id)
            const onCheckTaskItem = (e: ChangeEvent<HTMLInputElement>) => props.onCheckTaskItem(task.id, e.currentTarget.checked)
            return (
                <li key={task.id}>
                    <input onChange={onCheckTaskItem} type="checkbox" checked={task.isDone}/>
                    <span>{task.title}</span>
                    <button onClick={onDeleteTaskItem}>&otimes;</button>
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
                       onKeyDown={handleAddTaskItemOnPressEnter}
                       className={error ? "error" : ""}/>

                <button onClick={handleAddTaskItem}>+</button>
                {error && <div className="error-message">{error}</div>}
            </div>
            <ul>{tasksItems}</ul>
            <div>
                <button className={props.filterValue === FilterType.All ? "active-filter" : ""}
                        onClick={handleTaskFilterAll}>All
                </button>
                <button className={props.filterValue === FilterType.Active ? "active-filter" : ""}
                        onClick={handleTaskFilterActive}>Active
                </button>
                <button className={props.filterValue === FilterType.Completed ? "active-filter" : ""}
                        onClick={handleTaskFilterCompleted}>Completed
                </button>
            </div>
        </div>
    );
};

export default TodoList;