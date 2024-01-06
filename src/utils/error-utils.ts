import { Dispatch } from "redux"
import { TodolistResponse } from "api/todolistApi"
import { appActions } from "app/app-slice"
import { AppDispatch } from "app/store"

export const handleServerAppError = (data: TodolistResponse, dispatch: AppDispatch) => {
    if (data.messages.length) {
        dispatch(appActions.setError({ error: data.messages[0] }))
    } else {
        dispatch(appActions.setError({ error: "Some error occurred" }))
    }
    dispatch(appActions.setStatus({ status: "failed" }))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: AppDispatch) => {
    dispatch(appActions.setError({ error: error.message }))
    dispatch(appActions.setStatus({ status: "failed" }))
}
