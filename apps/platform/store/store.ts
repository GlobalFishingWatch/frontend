import type {
  Action,
  Middleware,
  ThunkAction,
  ThunkDispatch,
  UnknownAction,
} from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { logoutUserMiddleware } from 'middlewares'
import { queriesDynamicMiddleware, QUERY_REDUCER_PATHS } from 'queries/inject-api'

import { rootReducer } from './reducers'

// Too big to deep-check in dev, these slices hold hundreds of API entities
const BIG_STATE_PATHS = ['resources', 'datasets', 'dataviews']

// Can't type because GetDefaultMiddlewareOptions type is not exposed by RTK
const defaultMiddlewareOptions: any = {
  serializableCheck: {
    ignoredPaths: BIG_STATE_PATHS,
    // Their payloads are the same entities the paths above hold
    ignoredActions: [
      'datasets/upsertDatasets',
      'datasets/fetch/fulfilled',
      'datasets/all/fulfilled',
      'dataviews/fetch/fulfilled',
      'dataviews/fetchById/fulfilled',
      'resources/fetch/pending',
      'resources/fetch/fulfilled',
      'resources/setResource',
    ],
  },
  immutableCheck: {
    ignoredPaths: BIG_STATE_PATHS,
  },
}

export const makeStore = (
  preloadedState?: Partial<Record<keyof RootState, unknown>>,
  middlewares?: Middleware[]
) => {
  return configureStore({
    devTools: import.meta.env.DEV && {
      stateSanitizer: (state: any) => {
        if (!state.resources) return state
        const serializedResources = Object.entries(state.resources).map(([key, value]: any) => [
          key,
          { ...value, data: 'NOT_SERIALIZED' },
        ])

        return {
          ...state,
          ...QUERY_REDUCER_PATHS.reduce(
            (acc, key) => {
              acc[key] = 'NOT_SERIALIZED'
              return acc
            },
            {} as Record<string, any>
          ),
          resources: Object.fromEntries(serializedResources),
        }
      },
    },
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware(defaultMiddlewareOptions).concat(
        queriesDynamicMiddleware.middleware,
        logoutUserMiddleware,
        ...(middlewares || [])
      ),
    preloadedState: preloadedState as RootState | undefined,
  })
}

export type AppStore = ReturnType<typeof makeStore>
type TypedDispatch<T> = ThunkDispatch<T, any, UnknownAction>

export type AppDispatch = TypedDispatch<RootState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export type RootState = ReturnType<typeof rootReducer>
