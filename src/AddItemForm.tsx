import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import IconButton from "@mui/material/IconButton";
import  TextField from "@mui/material/TextField";
import PlaylistAddSharp from '@mui/icons-material/PlaylistAddSharp';

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

