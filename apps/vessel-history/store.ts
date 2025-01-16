import type { Action,ThunkAction} from '@reduxjs/toolkit';
import { combineReducers,configureStore } from '@reduxjs/toolkit'

import filtersReducer from 'features/event-filters/filters.slice'
import searchReducer from 'features/search/search.slice'
import settingsReducer from 'features/settings/settings.slice'
import offlineVesselsReducer from 'features/vessels/offline-vessels.slice'
import vesselsReducer from 'features/vessels/vessels.slice'
import connectedRoutes from 'routes/routes'
import { routerQueryMiddleware } from 'routes/routes.middlewares'

import datasetsReducer from './features/datasets/datasets.slice'
import dataviewsReducer from './features/dataviews/dataviews.slice'
import mapReducer from './features/map/map.slice'
import psmaReducer from './features/psma/psma.slice'
import regionsReducer from './features/regions/regions.slice'
import resourcesReducer from './features/resources/resources.slice'
import indicatorsReducer from './features/risk-indicator/risk-indicator.slice'
import userReducer from './features/user/user.slice'
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
  indicators: indicatorsReducer,
  location: location,
  map: mapReducer,
  dataviews: dataviewsReducer,
  datasets: datasetsReducer,
  psma: psmaReducer,
  regions: regionsReducer,
  resources: resourcesReducer,
  user: userReducer,
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
  devTools: {
    stateSanitizer: (state: any) => {
      if (!state.resources) return state
      const serializedResources = Object.entries(state.resources).map(([key, value]: any) => [
        key,
        { ...value, data: 'NOT_SERIALIZED' },
      ])

      return {
        ...state,
        resources: Object.fromEntries(serializedResources),
      }
    },
  },
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(defaultMiddlewareOptions)
      .concat(routerQueryMiddleware)
      .concat(routerMiddleware),
  enhancers: (getDefaultEnhancers) => [routerEnhancer, ...getDefaultEnhancers()] as any,
})

export type RootState = ReturnType<typeof rootReducer>
// TODO: fix this once issue solved
// https://github.com/reduxjs/redux-toolkit/issues/1854
// export type AppDispatch = typeof store.dispatch
export type AppDispatch = any
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export default store
