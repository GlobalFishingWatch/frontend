import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit'
import connectedRoutes from './routes/routes'
import { routerQueryMiddleware, routerWorkspaceMiddleware } from './routes/routes.middlewares'
import titleReducer from './routes/title.reducer'
import userReducer from './features/user/user.slice'
import workspaceReducer from './features/workspace/workspace.slice'
import workspacesReducer from './features/workspaces-list/workspaces-list.slice'
import datasetsReducer from './features/datasets/datasets.slice'
import dataviewsReducer from './features/dataviews/dataviews.slice'
import resourcesReducer from './features/resources/resources.slice'
import searchReducer from './features/search/search.slice'
import timebarReducer from './features/timebar/timebar.slice'
import mapReducer from './features/map/map.slice'
import rulersReducer from './features/map/rulers/rulers.slice'
import debugReducer from './features/debug/debug.slice'
import analysisReducer from './features/analysis/analysis.slice'

const {
  reducer: location,
  middleware: routerMiddleware,
  enhancer: routerEnhancer,
  // initialDispatch,
} = connectedRoutes

const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer,
  workspace: workspaceReducer,
  workspaces: workspacesReducer,
  datasets: datasetsReducer,
  dataviews: dataviewsReducer,
  resources: resourcesReducer,
  timebar: timebarReducer,
  map: mapReducer,
  rulers: rulersReducer,
  debug: debugReducer,
  location: location,
  title: titleReducer,
  analysis: analysisReducer,
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
      .concat(routerWorkspaceMiddleware)
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

export default store
