import { Meta, StoryObj } from "@storybook/react"
import { AddItemForm } from "../components/AddItemForm/AddItemForm"

const meta: Meta<typeof AddItemForm> = {
    title: "TodolistsList/AddItemForm",
    component: AddItemForm,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        onCreate: {
            description: "Click button inside form",
            action: "Clicked",
        },
    },
}

export default meta
type Story = StoryObj<typeof AddItemForm>

export const AddItemFormStory: Story = {}
