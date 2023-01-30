import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { dataviewStatsApi } from 'queries/stats-api'
import { routerQueryMiddleware, routerWorkspaceMiddleware } from 'routes/routes.middlewares'
import connectedRoutes from './routes/routes'

const {
  middleware: routerMiddleware,
  enhancer: routerEnhancer,
  // initialDispatch,
} = connectedRoutes

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

export const createStore = (rootReducer) =>
  configureStore({
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

// export type RootState = ReturnType<typeof rootReducer>
export type RootState = ReturnType<any>
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

export let store

export function getStore(rootReducer) {
  if (!store) {
    store = createStore(rootReducer)
  }
  return store
}
