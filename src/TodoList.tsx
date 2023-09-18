import React, {FC} from "react";
import {FilterType} from "./CommonTypes/FilterType";

export type TaskType = {
    id: number
    title: string
    isDone: boolean
}
type TodoListPropsType = {
    title: string
    tasks: Array<TaskType>
    onDeleteTask: (id: number) => void
    onFilterTasks:(value: FilterType) => void
}

const TodoList: FC<TodoListPropsType> = (props) => {

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
            <ul>
                {props.tasks.map(task => (
                    <li key={task.id}>
                        <input type="checkbox" checked={task.isDone}/>
                        <span>{task.title}</span>
                        <button onClick={() => props.onDeleteTask(task.id)}>&otimes;</button>
                    </li>
                ))}
            </ul>
            <div>
                <button onClick={() => props.onFilterTasks(FilterType.All)}>All</button>
                <button onClick={() => props.onFilterTasks(FilterType.Active)}>Active</button>
                <button onClick={() => props.onFilterTasks(FilterType.Completed)}>Completed</button>
            </div>
        </div>
    );
};

export default TodoList;