import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit'
import connectedRoutes, { routerQueryMiddleware } from 'routes/routes'
import offlineVesselsReducer from 'features/vessels/offline-vessels.slice'
import vesselsReducer from 'features/vessels/vessels.slice'
import searchReducer from 'features/search/search.slice'
import settingsReducer from 'features/settings/settings.slice'
import filtersReducer from 'features/profile/filters/filters.slice'
import { initializeDataviews } from 'features/dataviews/dataviews.utils'
import mapReducer from './features/map/map.slice'
import dataviewsReducer from './features/dataviews/dataviews.slice'
import datasetsReducer from './features/datasets/datasets.slice'
import psmaReducer from './features/psma/psma.slice'
import regionsReducer from './features/regions/regions.slice'
import resourcesReducer from './features/resources/resources.slice'
import workspaceReducer from './features/workspace/workspace.slice'

const {
  reducer: location,
  middleware: routerMiddleware,
  enhancer: routerEnhancer,
} = connectedRoutes

const rootReducer = combineReducers({
  offlineVessels: offlineVesselsReducer,
  vessels: vesselsReducer,
  search: searchReducer,
  settings: settingsReducer,
  filters: filtersReducer,
  location: location,
  map: mapReducer,
  dataviews: dataviewsReducer,
  datasets: datasetsReducer,
  psma: psmaReducer,
  regions: regionsReducer,
  resources: resourcesReducer,
  workspace: workspaceReducer,
})

// Can't type because GetDefaultMiddlewareOptions type is not exposed by RTK
const defaultMiddlewareOptions: any = {
  // Fix issue with Redux-first-router and RTK (https://stackoverflow.com/questions/59773345/react-toolkit-and-redux-first-router)
  serializableCheck: false,
  immutableCheck: {
    ignoredPaths: [
      // Too big to check for immutability:
      'resources',
    ],
  },
}

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(defaultMiddlewareOptions)
      .concat(routerQueryMiddleware)
      .concat(routerMiddleware),
  enhancers: (defaultEnhancers) => [routerEnhancer, ...defaultEnhancers],
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

// Only once when the app starts
initializeDataviews(store.dispatch)

export default store
