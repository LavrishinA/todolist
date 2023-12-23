import {Action, applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {tasksReducer} from "./task-reducer";
import {todolistsReducer} from "./todolist-reducer";
import {ThunkDispatch, thunk} from "redux-thunk"
import {useDispatch, useSelector, TypedUseSelectorHook} from "react-redux";
import {composeWithDevTools} from "@redux-devtools/extension";

export type Store = ReturnType<typeof rootReducer>
export type ThunkDispatchType = ThunkDispatch<Store, unknown, Action>
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

export const store = legacy_createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

// type  AppDispatch = typeof store.dispatch
export const useAppDispatch =  useDispatch<ThunkDispatchType>
export const useAppSelector: TypedUseSelectorHook<Store> = useSelector

// @ts-ignore
window.store = store
