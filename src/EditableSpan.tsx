import React, {ChangeEvent, useState} from "react";

type EditableSpanPropsType = {
    title: string
    onChange: (title: string) => void
    children?: React.ReactElement
}

export const EditableSpan: React.FC<EditableSpanPropsType> = React.memo(({title, onChange}) => {
    const [isEditMode, setIsEditMode] = useState(false)
    const [inputValue, setInputValue] = useState("")
    console.log(`${title}`)
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
            {isEditMode
                ? <input value={inputValue} onChange={inputValueHandler} onBlur={deactivateChangeModeHandler} autoFocus/>
                : <span onDoubleClick={activeChangeModeHandler}> {title} </span>}
        </>

    );
});

