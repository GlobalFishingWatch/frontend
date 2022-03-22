import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import userApplicationsReducer from 'features/user-applications/user-applications.slice'
import userReducer from '../features/user/user.slice'

export function makeStore() {
  return configureStore({
    reducer: { user: userReducer, userApplications: userApplicationsReducer },
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>

export default store
