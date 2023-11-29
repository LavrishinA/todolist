import {EditableSpan} from "../EditableSpan";
import {Meta, StoryObj} from "@storybook/react";

const meta: Meta<typeof EditableSpan> = {
    title: 'Todolist/EditableSpan',
    component: EditableSpan,
    tags: ['autodocs'],
    argTypes: {
        title: {
            description: 'Start value empty. Add value push button set string.',
        },
        onChange: {
            description: 'Value EditableSpan changed',
            action: "Title changed"
        }
    },
    args: {
        title: "Task title"
    }
};

export default meta;
type Story = StoryObj<typeof EditableSpan>;

export const EditableSpanStory: Story = {

};