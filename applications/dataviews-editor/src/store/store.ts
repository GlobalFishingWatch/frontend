import { combineReducers } from 'redux'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import workspace from 'features/workspace/workspace.slice'
import dataviews from 'features/dataviews/dataviews.slice'
import resources from 'features/dataviews/resources.slice'
import timebar from 'features/timebar/timebar.slice'

const rootReducer = combineReducers({
  workspace,
  dataviews,
  resources,
  timebar,
})

export type RootState = ReturnType<typeof rootReducer>

const defaultMiddlewareOptions: any = {
  immutableCheck: {
    ignoredPaths: [
      // Too big to check for immutability:
      'resources',
    ],
  },
}

const store = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware(defaultMiddlewareOptions)],
  })
  return store
}

export default store
