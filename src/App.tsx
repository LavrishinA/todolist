import React, {useState} from 'react';
import './App.css';
import TodoList from "./TodoList";
import {FilterType} from "./CommonTypes/FilterType";
import {v1} from "uuid";

type TodoListType = {
    id: string
    listTitle: string
    filter: FilterType
}

function App() {
    const todolist1 = v1();
    const todolist2 = v1();

    const [todolists, setTodolists] = useState<Array<TodoListType>>([
        {id: todolist1, listTitle: "What to learn", filter: FilterType.Completed},
        {id: todolist2, listTitle: "What to buy", filter: FilterType.Active}
    ])

    const [tasksObj, setTasksObj] = useState({
        [todolist1]: [
            {id: v1(), title: "SocialNetwork", isDone: false},
            {id: v1(), title: "TodoList", isDone: false},
            {id: v1(), title: "MicroTask", isDone: true},
        ],
        [todolist2]: [
            {id: v1(), title: "Bread", isDone: true},
            {id: v1(), title: "Milk", isDone: false},
            {id: v1(), title: "Book", isDone: true},
        ]
    })


    function onDeleteTaskItem(id: string, todoListId: string) {
        const tasks = tasksObj[todoListId];
        const filteredTasks = tasks.filter(task => task.id !== id);
        tasksObj[todoListId] = filteredTasks;
        setTasksObj({...tasksObj})
    }

    function onAddTaskItem(taskItem: string, todoListId: string) {
        const newTaskItem = {id: v1(), title: taskItem, isDone: false};
        const tasks = tasksObj[todoListId]
        const newTasks = [newTaskItem, ...tasks]
        tasksObj[todoListId] = newTasks
        setTasksObj({...tasksObj})
    }

    function onCheckTaskItem(id: string, isDone: boolean, todoListId: string) {
        const tasks = tasksObj[todoListId];
        const checkedTask = tasks.find(t => t.id === id)
        if (!checkedTask) return
        checkedTask.isDone = isDone
        setTasksObj({...tasksObj})
    }

    function onFilterTasks(filterValue: FilterType, id: string) {
        const filteredTl = todolists.find(tl => tl.id === id)
        if (!filteredTl) return
        filteredTl.filter = filterValue
        setTodolists([...todolists])
    }

    function onDeleteTodolist(todolistId: string) {
        const filtredTodolists = todolists.filter(tl => tl.id !== todolistId)
        setTodolists([...filtredTodolists])
        delete tasksObj[todolistId]
        setTasksObj({...tasksObj})
    }


    return (
        <div className="App">

            {
                todolists.map(tl => {

                    let tasksForTodoList = tasksObj[tl.id]
                    if (tl.filter === "active") {
                        tasksForTodoList = tasksForTodoList.filter(task => !task.isDone)
                    }
                    if (tl.filter === "completed") {
                        tasksForTodoList = tasksForTodoList.filter(task => task.isDone)
                    }

                    return <TodoList key={tl.id}
                                     id={tl.id}
                                     title={tl.listTitle}
                                     filterValue={tl.filter}
                                     tasks={tasksForTodoList}
                                     onDeleteTaskItem={onDeleteTaskItem}
                                     onFilterTasks={onFilterTasks}
                                     onAddTaskItem={onAddTaskItem}
                                     onCheckTaskItem={onCheckTaskItem}
                                     onDeleteTodolist={onDeleteTodolist}
                    />
                })
            }
        </div>
    )
}

export default App;
