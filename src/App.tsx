import React, {useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";
import {FilterType} from "./CommonTypes/FilterType";
import {v1} from "uuid";


function App() {

    const initialState = [
        {id: v1(), title: "SocialNetwork", isDone: false},
        {id: v1(), title: "TodoList", isDone: false},
        {id: v1(), title: "MicroTask", isDone: true},
    ]
    const [tasks, setTasks] = useState<Array<TaskType>>(initialState);
    const [filterValue, setFilter] = useState<FilterType>(FilterType.All)

    function onDeleteTaskItem(id: string) {
        setTasks(tasks.filter(task => task.id !== id))
    }

    function onAddTaskItem(taskItem: string) {
        const newTaskItem = {id: v1(), title: taskItem, isDone: false}
        setTasks([newTaskItem, ...tasks])
    }

    function onCheckTaskItem(id: string, isDone: boolean) {
        const checkedTask = tasks.find(t => t.id === id)
        if (!checkedTask) return
        checkedTask.isDone = isDone
        setTasks([...tasks])
    }

    function onFilterTasks(filterValue: FilterType) {
        setFilter(filterValue)
    }


    let tasksForTodoList = tasks
    if (filterValue === "active") {
        tasksForTodoList = tasks.filter(task => !task.isDone)
    }
    if (filterValue === "completed") {
        tasksForTodoList = tasks.filter(task => task.isDone)
    }


    return (
        <div className="App">
            <TodoList title={"Monday"}
                      tasks={tasksForTodoList}
                      onDeleteTaskItem={onDeleteTaskItem}
                      onFilterTasks={onFilterTasks}
                      onAddTaskItem={onAddTaskItem}
                      onCheckTaskItem={onCheckTaskItem}
                      filterValue = {filterValue}
            />

        </div>
    );
}

export default App;
