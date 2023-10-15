import React, {ChangeEvent, FC} from "react";
import {FilterType} from "./CommonTypes/FilterType";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {log} from "util";


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


    const tasksItems = props.tasks.map(task => {
            const onDeleteTaskItem = () => props.onDeleteTaskItem(task.id, props.id)
            const onCheckTaskItem = (e: ChangeEvent<HTMLInputElement>) => props.onCheckTaskItem(task.id, e.currentTarget.checked, props.id)
            const onChangeTitleTaskItem = (title: string) => props.onChangeTaskTitle(task.id, title, props.id)

            return (
                <li key={task.id}>
                    <input onChange={onCheckTaskItem} type="checkbox" checked={task.isDone}/>
                    <EditableSpan title={task.title} onChangeTitleTaskItem={onChangeTitleTaskItem}/>
                    <button onClick={onDeleteTaskItem}>&otimes;</button>
                </li>
            )
        }
    )


    return (
        <div>
            <h3>{props.title}
                <button onClick={handlerDeleteTodolist}>&otimes;</button>
            </h3>
            <AddItemForm onAddItem={handleAddTask}/>
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