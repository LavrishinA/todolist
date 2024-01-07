import { Store } from "app/store"

export const selectIsLoggedIn = (state: Store) => state.auth.isLoggedIn
