import { TodolistResponse } from "api/todolistApi"
import { appActions } from "app/app-slice"
import { AppDispatch } from "app/store"
import axios from "axios"

export const handleServerAppError = (data: TodolistResponse, dispatch: AppDispatch) => {
    if (data.messages.length) {
        dispatch(appActions.setError({ error: data.messages[0] }))
    } else {
        dispatch(appActions.setError({ error: "Some error occurred" }))
    }
    dispatch(appActions.setStatus({ status: "failed" }))
}

export const handleServerNetworkError = (err: unknown, dispatch: AppDispatch): void => {
    let errorMessage = "Some error occurred"

    // ❗Проверка на наличие axios ошибки
    if (axios.isAxiosError(err)) {
        // ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
        // ⏺️ err?.message - например при создании таски в offline режиме
        errorMessage = err.response?.data?.message || err?.message || errorMessage
        // ❗ Проверка на наличие нативной ошибки
    } else if (err instanceof Error) {
        errorMessage = `Native error: ${err.message}`
        // ❗Какой-то непонятный кейс
    } else {
        errorMessage = JSON.stringify(err)
    }

    dispatch(appActions.setError({ error: errorMessage }))
    dispatch(appActions.setStatus({ status: "failed" }))
}
