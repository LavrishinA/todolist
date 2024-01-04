const initialState = {
    isInitialized: false,
    status: 'idle' as RequestStatusType,
    error: null as string | null
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'app/set-status':
            return {...state, status: action.status}
        case "app/set-error":
            return {...state, error: action.error}
        case "app/set-isInitialized":
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}


type ActionsType = SetStatus | SetError | SetIsInitialized

export const setStatus = (status: RequestStatusType) => ({type: 'app/set-status', status} as const)
export const setError = (error: string | null) => ({type: 'app/set-error', error} as const)
export const setIsInitialized = (isInitialized: boolean) => ({type: 'app/set-isInitialized', isInitialized} as const)

export type SetStatus = ReturnType<typeof setStatus>
export type SetError = ReturnType<typeof setError>
export type SetIsInitialized = ReturnType<typeof setIsInitialized>
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'