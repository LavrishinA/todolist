import React, { ChangeEvent, useState } from "react"
import TextField from "@mui/material/TextField"

type Props = {
    title: string
    onChange: (title: string) => void
    children?: React.ReactElement
    disabled?: boolean
}

export const EditableSpan = React.memo(({ title, onChange, disabled }: Props) => {
    const [isEditMode, setIsEditMode] = useState(false)
    const [inputValue, setInputValue] = useState("")

    const activeChangeModeHandler = () => {
        setIsEditMode(true)
        setInputValue(title)
    }

    const deactivateChangeModeHandler = () => {
        setIsEditMode(false)
        onChange(inputValue)
    }

    const inputValueHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value)
    }

    return (
        <>
            {isEditMode ? (
                <TextField
                    variant="standard"
                    size="small"
                    helperText="Change title"
                    value={inputValue}
                    onChange={inputValueHandler}
                    onBlur={deactivateChangeModeHandler}
                    autoFocus
                    disabled={disabled}
                />
            ) : (
                <span onDoubleClick={activeChangeModeHandler}> {title} </span>
            )}
        </>
    )
})
