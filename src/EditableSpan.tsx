import React, {ChangeEvent, useState} from "react";


type EditableSpanPropsType = {
    title: string
    onChangeTitleTaskItem: (title: string) => void
}

export const EditableSpan: React.FC<EditableSpanPropsType> = ({title, onChangeTitleTaskItem}) => {
    const [isEditMode, setIsEditMode] = useState(false)
    const [inputValue, setInputValue] = useState("")

    const activeChangeMode = () => {
        setIsEditMode(true)
        setInputValue(title)
    }
    const deactivateChangeMode = () => {
        setIsEditMode(false)
        onChangeTitleTaskItem(inputValue)
    }

    const inputValueHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value)
    }


    return (
        isEditMode
            ? <input value={inputValue} onChange={inputValueHandler} onBlur={deactivateChangeMode} autoFocus/>
            : <span onDoubleClick={activeChangeMode}> {title} </span>

    );
};

