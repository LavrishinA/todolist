import React, {ChangeEvent, KeyboardEvent, useState} from "react";

type AddItemFormPropsType =  {
    onAddItem: (title: string) => void
}

export const AddItemForm: React.FC< AddItemFormPropsType> = ({onAddItem}) => {

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
            <input value={itemTitle}
                   onChange={handleTaskListInput}
                   onKeyDown={handleAddTaskItemOnPressEnter}
                   className={error ? "error" : ""}/>

            <button onClick={handleAddTaskItem}>+</button>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

