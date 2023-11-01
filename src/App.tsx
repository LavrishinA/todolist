import React, {useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";
import {FilterType} from "./CommonTypes/FilterType";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import Paper from "@mui/material/Paper";

export type TodoListType = {
    id: string
    listTitle: string
    filter: FilterType
}

export type TasksObjType = {
    [key: string]: Array<TaskType>
}
const todolist1 = v1();
const todolist2 = v1();

function App() {

    const [todolists, setTodolists] = useState<Array<TodoListType>>([
        {id: todolist1, listTitle: "What to learn", filter: FilterType.All},
        {id: todolist2, listTitle: "What to buy", filter: FilterType.All}
    ])

    const [tasksObj, setTasksObj] = useState<TasksObjType>({
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
        setTasksObj({...tasksObj, [todoListId]: tasksObj[todoListId].filter(task => task.id !== id)})
        // const tasks = tasksObj[todoListId];
        // const filteredTasks = tasks.filter(task => task.id !== id);
        // tasksObj[todoListId] = filteredTasks;
        // setTasksObj({...tasksObj})

    }


    function onAddTaskItem(taskItem: string, todoListId: string) {
        const newTaskItem = {id: v1(), title: taskItem, isDone: false};
        setTasksObj({...tasksObj, [todoListId]: [newTaskItem, ...tasksObj[todoListId]]})
        // const tasks = tasksObj[todoListId]
        // const newTasks = [newTaskItem, ...tasks]
        // tasksObj[todoListId] = newTasks
        // setTasksObj({...tasksObj})
    }

    function onCheckTaskItem(id: string, isDone: boolean, todoListId: string) {
        setTasksObj({
            ...tasksObj,
            [todoListId]: tasksObj[todoListId].map(task => task.id === id ? {...task, isDone} : task)
        })
        // const tasks = tasksObj[todoListId];
        // const checkedTask = tasks.find(t => t.id === id)
        // if (!checkedTask) return
        // checkedTask.isDone = isDone
        // setTasksObj({...tasksObj})
    }


    function onChangeTaskTitle(id: string, title: string, todoListId: string) {
        setTasksObj({...tasksObj, [todoListId]: tasksObj[todoListId].map(t => t.id === id ? {...t, title} : t)})
        // const tasks = tasksObj[todoListId];
        // const task = tasks.find(t => t.id === id)
        // if (!task) return
        // task.title = title
        // setTasksObj({...tasksObj})
    }

    function onFilterTasks(filterValue: FilterType, id: string) {
        const filteredTl = todolists.find(tl => tl.id === id)
        if (!filteredTl) return
        filteredTl.filter = filterValue
        setTodolists([...todolists])
    }

    function onDeleteTodolist(todolistId: string) {
        setTodolists(todolists.filter(tl => tl.id !== todolistId))
        // const filtredTodolists = todolists.filter(tl => tl.id !== todolistId)
        // setTodolists([...filtredTodolists])
        // delete tasksObj[todolistId]
        // setTasksObj({...tasksObj})
    }

    function onAddTodoList(title: string) {
        const newTodoList: TodoListType = {
            id: v1(), listTitle: title, filter: FilterType.All
        }
        setTodolists([newTodoList, ...todolists])
        setTasksObj({...tasksObj, [newTodoList.id]: []})
    }


    return (
        <main className="App">

            <AddItemForm onAddItem={onAddTodoList}/>

            <div>
                {
                    todolists.map(tl => {
                        let tasksForTodoList = tasksObj[tl.id]
                        if (tl.filter === "active") {
                            tasksForTodoList = tasksForTodoList.filter(task => !task.isDone)
                        }
                        if (tl.filter === "completed") {
                            tasksForTodoList = tasksForTodoList.filter(task => task.isDone)
                        }
                        return (

                            <Paper elevation={3} className="todolist" key={tl.id}>
                                <TodoList id={tl.id}
                                          title={tl.listTitle}
                                          filterValue={tl.filter}
                                          tasks={tasksForTodoList}
                                          onDeleteTaskItem={onDeleteTaskItem}
                                          onFilterTasks={onFilterTasks}
                                          onChangeTaskTitle={onChangeTaskTitle}
                                          onAddTaskItem={onAddTaskItem}
                                          onCheckTaskItem={onCheckTaskItem}
                                          onDeleteTodolist={onDeleteTodolist}/>
                            </Paper>
                        )
                    })
                }
            </div>
        </main>
    )
}

export default App;
