import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import IconButton from "@mui/material/IconButton";
import  TextField from "@mui/material/TextField";
import PlaylistAddSharp from '@mui/icons-material/PlaylistAddSharp';

type AddItemFormPropsType = {
    onCreate: (title: string) => void
}

export const AddItemForm: React.FC<AddItemFormPropsType> = ({onCreate}) => {
    const [itemTitle, setItemTitle] = useState("")
    const [error, setError] = useState<null | string>(null)

    function inputValueHandler(e: ChangeEvent<HTMLInputElement>) {
        setItemTitle(e.currentTarget.value)
    }

    function createItemHandler() {
        if (!itemTitle.trim()) {
            setError("Title is required")
            return
        }

        onCreate(itemTitle.trim())
        setItemTitle("")
        setError(null)
    }

    function createItemOnPressKeyHandler(e: KeyboardEvent<HTMLInputElement>) {
        setError(null)
        e.key === "Enter" && createItemHandler()
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
                onChange={inputValueHandler}
                onKeyDown={createItemOnPressKeyHandler}
                autoComplete="off"
            />

            <IconButton aria-label="add" size="small" color="primary" onClick={createItemHandler}>
                <PlaylistAddSharp fontSize="medium"/>
            </IconButton>

        </div>
    );
};

