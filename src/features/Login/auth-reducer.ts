import {Dispatch} from 'redux'
import {setIsInitialized, SetIsInitialized, SetStatus, setStatus} from "../../app/app-reducer";
import {authApi, ResponseStatuses} from "../../api/todolistApi";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {LoginParams} from "./login";
import {clearData, ClearData} from "../TodolistsList/todolist-reducer";


const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/set-isLogged':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}


// actions
export const setIsLoggedIn = (value: boolean) =>
    ({type: 'login/set-isLogged', value} as const)

// thunks
export const login = (data: LoginParams) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatus('loading'))
    try {
        const res = await authApi.login(data)
        if (res.data.resultCode === ResponseStatuses.succeeded) {
            dispatch(setIsLoggedIn(true))
            dispatch(setStatus('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError((e as Error), dispatch)
    }
}

export const me = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatus('loading'))
    try {
        const res = await authApi.me()
        if (res.data.resultCode === ResponseStatuses.succeeded) {
            dispatch(setIsLoggedIn(true))
            dispatch(setStatus('succeeded'))
        } else {
            dispatch(setStatus('failed'))
        }
    } catch (e) {
        handleServerNetworkError((e as Error), dispatch)
    } finally {
        dispatch(setIsInitialized(true))

    }
}

export const logout = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatus('loading'))
    try {
        const res = await authApi.logout()
        if (res.data.resultCode === ResponseStatuses.succeeded) {
            dispatch(setIsLoggedIn(false))
            dispatch(setStatus('succeeded'))
            dispatch(clearData())
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError((e as Error), dispatch)
    }
}


// types
type ActionsType = ReturnType<typeof setIsLoggedIn> | SetStatus | SetIsInitialized | ClearData