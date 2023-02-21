import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit'
import { dataviewStatsApi } from 'queries/stats-api'
import descriptionReducer from 'routes/description.reducer'
import { routerQueryMiddleware, routerWorkspaceMiddleware } from './routes/routes.middlewares'
import areasReducer from './features/areas/areas.slice'
import bigQueryReducer from './features/bigquery/bigquery.slice'
import connectedRoutes from './routes/routes'
import datasetsReducer from './features/datasets/datasets.slice'
import dataviewsReducer from './features/dataviews/dataviews.slice'
import debugReducer from './features/debug/debug.slice'
import downloadActivityReducer from './features/download/downloadActivity.slice'
import downloadTrackReducer from './features/download/downloadTrack.slice'
import editorReducer from './features/editor/editor.slice'
import hintsReducer from './features/hints/hints.slice'
import mapReducer from './features/map/map.slice'
import modalsReducer from './features/modals/modals.slice'
import resourcesReducer from './features/resources/resources.slice'
import rulersReducer from './features/map/rulers/rulers.slice'
import searchReducer from './features/search/search.slice'
import timebarReducer from './features/timebar/timebar.slice'
import titleReducer from './routes/title.reducer'
import userReducer from './features/user/user.slice'
import workspaceReducer from './features/workspace/workspace.slice'
import workspacesReducer from './features/workspaces-list/workspaces-list.slice'
import vesselGroupsReducer from './features/vessel-groups/vessel-groups.slice'

const {
  reducer: location,
  middleware: routerMiddleware,
  enhancer: routerEnhancer,
  // initialDispatch,
} = connectedRoutes

const rootReducer = combineReducers({
  areas: areasReducer,
  bigQuery: bigQueryReducer,
  datasets: datasetsReducer,
  dataviews: dataviewsReducer,
  debug: debugReducer,
  downloadActivity: downloadActivityReducer,
  downloadTrack: downloadTrackReducer,
  editor: editorReducer,
  hints: hintsReducer,
  location,
  map: mapReducer,
  modals: modalsReducer,
  resources: resourcesReducer,
  rulers: rulersReducer,
  search: searchReducer,
  timebar: timebarReducer,
  title: titleReducer,
  description: descriptionReducer,
  user: userReducer,
  workspace: workspaceReducer,
  workspaces: workspacesReducer,
  vesselGroups: vesselGroupsReducer,
  [dataviewStatsApi.reducerPath]: dataviewStatsApi.reducer,
})

// Can't type because GetDefaultMiddlewareOptions type is not exposed by RTK
const defaultMiddlewareOptions: any = {
  // Fix issue with Redux-first-router and RTK (https://stackoverflow.com/questions/59773345/react-toolkit-and-redux-first-router)
  serializableCheck: false,
  immutableCheck: {
    ignoredPaths: [
      // Too big to check for immutability:
      'resources',
      'datasets',
      'dataviews',
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
      .concat(dataviewStatsApi.middleware)
      .concat(routerQueryMiddleware)
      .concat(routerWorkspaceMiddleware)
      .concat(routerMiddleware),
  enhancers: (defaultEnhancers) => [routerEnhancer, ...defaultEnhancers],
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
