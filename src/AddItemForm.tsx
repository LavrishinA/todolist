import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import {PlaylistAddSharp} from '@mui/icons-material/';

type AddItemFormPropsType = {
    onAddItem: (title: string) => void
}

export const AddItemForm: React.FC<AddItemFormPropsType> = ({onAddItem}) => {

    const [itemTitle, setItemTitle] = useState("")
    const [error, setError] = useState<null | string>(null)

    function handleTaskListInput(e: ChangeEvent<HTMLInputElement>) {
        setItemTitle(e.currentTarget.value)
    }

    function handleAddTaskItemOnPressEnter(e: KeyboardEvent<HTMLInputElement>) {
        setError(null)
        e.key === "Enter" && handleAddTaskItem()
    }


    function handleAddTaskItem() {
        if (!itemTitle.trim()) {
            setError("Title is required")
            return
        }

        onAddItem(itemTitle.trim())
        setItemTitle("")
        setError(null)
    }


    return (
        <div>
            <TextField
                id="outlined-error-helper-text"
                value={itemTitle}
                label="Enter title"
                size="small"
                helperText={error}
                error={!!error}
                onChange={handleTaskListInput}
                onKeyDown={handleAddTaskItemOnPressEnter}
                autoComplete="off"
            />

            <IconButton aria-label="add" size="small" color="primary" onClick={handleAddTaskItem}>
                <PlaylistAddSharp fontSize="medium"/>
            </IconButton>

        </div>
    );
};

