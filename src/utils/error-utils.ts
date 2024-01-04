import {Dispatch} from "redux";
import {setError, SetError, setStatus, SetStatus} from "../app/app-reducer";
import {TodolistResponse} from "../api/todolistApi";

export const handleServerAppError = (data: TodolistResponse, dispatch: ErrorUtilsDispatchType) => {

    if (data.messages.length) {
        dispatch(setError(data.messages[0]))
    } else {
        dispatch(setError('Some error occurred'))
    }
    dispatch(setStatus('failed'))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setError(error.message))
    dispatch(setStatus('failed'))
}

type ErrorUtilsDispatchType = Dispatch<SetError | SetStatus>