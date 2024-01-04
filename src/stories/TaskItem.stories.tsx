import {Meta, StoryObj} from "@storybook/react";
import {Task} from "../features/TodolistsList/Todolist/Task/Task";
import {TaskPriorities, TaskStatuses} from "../api/todolistApi";

const meta: Meta<typeof Task> = {
    title: 'TodolistsList/Task',
    component: Task,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        onUpdateTaskStatus: {
            action: "Update Task Status"
        },
        onUpdateTaskTitle: {
            action: "Update Task Title"
        },
        onDeleteTask: {
            action: "Delete Task"
        }
    },
    args: {
        task: { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: null, deadline: null, addedDate: null, order: 0, priority: TaskPriorities.Low },
        id: 'fgdosrg8rgjuh'
    },
};

export default meta;
type Story = StoryObj<typeof Task>;

export const TaskItemDefault: Story = {};

export const TaskItemIsDone: Story = {
    args: {
        task: { id: "1", title: "CSS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: null, deadline: null, addedDate:  null, order: 0, priority: TaskPriorities.Low },
        id: "2"
    },
};