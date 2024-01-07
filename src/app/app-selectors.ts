import { Store } from "app/store"

export const selectIsInitialized = (state: Store) => state.app.isInitialized
export const selectStatus = (state: Store) => state.app.status
export const selectError = (state: Store) => state.app.error
