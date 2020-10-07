import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
  getDefaultMiddleware,
} from '@reduxjs/toolkit'
import connectedRoutes, { routerQueryMiddleware } from './routes/routes'
import userReducer from './features/user/user.slice'
import workspaceReducer from './features/workspace/workspace.slice'
import resourcesReducer from './features/resources/resources.slice'
import searchReducer from './features/search/search.slice'
import timebarReducer from './features/timebar/timebar.slice'
import mapFeaturesReducer from './features/map-features/map-features.slice'

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
  resources: resourcesReducer,
  timebar: timebarReducer,
  mapFeatures: mapFeaturesReducer,
  location: location,
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
      if (!state.resources?.resources) return state
      const serializedResources = Object.entries(
        state.resources.resources
      ).map(([key, value]: any) => [key, { ...value, data: 'NOT_SERIALIZED' }])

      return {
        ...state,
        resources: {
          ...state.resources,
          resources: Object.fromEntries(serializedResources),
        },
      }
    },
  },
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware(defaultMiddlewareOptions),
    routerQueryMiddleware,
    routerMiddleware,
  ],
  enhancers: (defaultEnhancers) => [routerEnhancer, ...defaultEnhancers],
})

export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export default store
