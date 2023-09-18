import React, {useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";
import {FilterType} from "./CommonTypes/FilterType";
import {AdditionalTaskTodoListApp1} from "./AdditionalTasksTodoList/AdditionalTaskTodoListApp1";



function App() {
    // const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const initialState = [
        {id: 1, title: "SocialNetwork", isDone: false},
        {id: 2, title: "TodoList", isDone: false},
        {id: 3, title: "MicroTask", isDone: true},
    ]
    const [tasks, setTasks] = useState<Array<TaskType>>(initialState);
    const [filterValue, setFilter] = useState<FilterType>(FilterType.All)

    function handleDeleteTask(id: number) {
        setTasks(tasks.filter(task => task.id !== id))
    }

    function handleFilterTasks(filterValue: FilterType) {
        setFilter(filterValue)
    }
    let tasksForTodoList = tasks;
    if (filterValue === "active") {
        tasksForTodoList = tasks.filter(task => task.isDone === false)
    }
    if (filterValue === "completed") {
        tasksForTodoList = tasks.filter(task => task.isDone === true)
    }


    return (
        <div className="App">
            <TodoList title={"Monday"}
                      tasks={tasksForTodoList}
                      onDeleteTask={handleDeleteTask}
                      onFilterTasks={handleFilterTasks}/>

            {/*<AdditionalTaskTodoListApp1/>*/}
        </div>
    );
}

export default App;
// +WTB DRAGONSKULL куски и рецепт(key, recipe)