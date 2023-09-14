import React  from 'react';
import './App.css';
import TodoList from "./TodoList";
import {AdditionalTaskTodoListApp1} from "./AdditionalTasksTodoList/AdditionalTaskTodoListApp1";


function App() {
    // const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const tasks1 = [
        {id: 1, title: "SocialNetwork", isDone: false},
        {id: 2, title: "TodoList", isDone: false},
        {id: 2, title: "MicroTask", isDone: true},
    ]
    const tasks2 = [
        {id: 1, title: "CodeWards", isDone: false},
        {id: 2, title: "Video Content", isDone: false},
        {id: 2, title: "HomeWork", isDone: false},
    ]
    return (
        <div className="App">
            {/*{days.map(day => <TodoList title={day}/>)}*/}

            {/*<TodoList title={"Monday"} task={tasks1}/>*/}
            {/*<TodoList title={"Tuesday"} task={tasks2}/>*/}

            <AdditionalTaskTodoListApp1/>
        </div>
    );
}

export default App;
