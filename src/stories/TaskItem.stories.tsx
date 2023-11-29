import {Meta, StoryObj} from "@storybook/react";
import {TaskItem} from "../TodoList";

const meta: Meta<typeof TaskItem> = {
    title: 'Todolist/TaskItem',
    component: TaskItem,
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
        task: {id: '12wsdewfijdei', title: 'JS', isDone: false},
        id: 'fgdosrg8rgjuh'
    },
};

export default meta;
type Story = StoryObj<typeof TaskItem>;

export const TaskItemDefault: Story = {};

export const TaskItemIsDone: Story = {
    args: {
        task: {id: '1', title: 'CSS', isDone: true},
        id: "2"
    },
};