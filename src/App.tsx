import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./TodoList";
import {v1} from 'uuid';

export type FilterValuesType = "all" | "active" | "completed";
type todolistsType = {
    id: string
    title: string
    filter: FilterValuesType
}

function App() {
    let todolistID1 = v1();
    let todolistID2 = v1();

    let [todolists, setTodolists] = useState<Array<todolistsType>>([
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ])

    let [tasks, setTasks] = useState({
        [todolistID1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [todolistID2]: [
            {id: v1(), title: "HTML&CSS2", isDone: true},
            {id: v1(), title: "JS2", isDone: true},
            {id: v1(), title: "ReactJS2", isDone: false},
            {id: v1(), title: "Rest API2", isDone: false},
            {id: v1(), title: "GraphQL2", isDone: false},
        ]
    });


    function removeTask(id: string, tlID: string) {
        const tlForDeleteTask =tasks[tlID]
        let filteredTasks = tlForDeleteTask.filter(t => t.id != id);
        tasks[tlID] = filteredTasks;
        setTasks({...tasks})
    }

    function addTask(title: string, tlID: string) {
        let task = {id: v1(), title: title, isDone: false}
        tasks[tlID] = [task, ...tasks[tlID]]
        setTasks({...tasks})
    }

    function changeStatus(taskId: string, isDone: boolean, tlID: string) {
        let task = tasks[tlID].find(t => t.id === taskId);
        if (task) {
            task.isDone = isDone;
        }

        setTasks({...tasks});
    }

    function changeFilter (filterValue: FilterValuesType, id: string) {
        const filteredTodolist = todolists.find(tl => tl.id === id)
        if(!filteredTodolist) return
        filteredTodolist.filter = filterValue
        setTodolists([...todolists])
    }


    return (
        <div className="App">

            {todolists.map(tl => {

                let tasksForTodolist = tasks[tl.id];
                if (tl.filter === "active") {
                    tasksForTodolist = tasksForTodolist.filter(t => t.isDone === false);
                }
                if (tl.filter === "completed") {
                    tasksForTodolist = tasksForTodolist.filter(t => t.isDone === true);
                }

                return <Todolist key={tl.id}
                                 id={tl.id}
                                 title={tl.title}
                                 tasks={tasksForTodolist}
                                 removeTask={removeTask}
                                 changeFilter={changeFilter}
                                 addTask={addTask}
                                 changeTaskStatus={changeStatus}
                                 filter={tl.filter}
                />
            })}
        </div>
    );
}

export default App;
