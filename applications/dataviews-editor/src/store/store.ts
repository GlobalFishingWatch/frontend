import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import workspace from 'features/workspace/workspace.slice'
import dataviews from 'features/dataviews/dataviews.slice'
import timebar from 'features/timebar/timebar.slice'

const rootReducer = combineReducers({
  workspace,
  dataviews,
  timebar,
})

export type RootState = ReturnType<typeof rootReducer>

export default () => {
  const store = configureStore({
    reducer: rootReducer,
  })
  // initialDispatch()
  return store
}
