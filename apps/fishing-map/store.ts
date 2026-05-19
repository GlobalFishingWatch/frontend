import type { Action, AnyAction, Middleware, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { logoutUserMiddleware } from 'middlewares'
import { queriesApiMiddlewares, queriesApiReducers } from 'queries'

import { rootReducer } from './reducers'

// Can't type because GetDefaultMiddlewareOptions type is not exposed by RTK
const defaultMiddlewareOptions: any = {
  // serializableCheck: false,
  immutableCheck: {
    ignoredPaths: [
      // Too big to check for immutability:
      'resources',
      'datasets',
      'dataviews',
    ],
  },
}

export const makeStore = (preloadedState?: RootState, middlewares?: Middleware[]) => {
  return configureStore({
    devTools: {
      stateSanitizer: (state: any) => {
        if (!state.resources) return state
        const serializedResources = Object.entries(state.resources).map(([key, value]: any) => [
          key,
          { ...value, data: 'NOT_SERIALIZED' },
        ])

        return {
          ...state,
          ...Object.keys(queriesApiReducers).reduce(
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
        ...queriesApiMiddlewares,
        logoutUserMiddleware,
        ...(middlewares || [])
      ),
    preloadedState: { ...preloadedState },
  })
}

export type AppStore = ReturnType<typeof makeStore>
type TypedDispatch<T> = ThunkDispatch<T, any, AnyAction>

export type AppDispatch = TypedDispatch<RootState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export type RootState = ReturnType<typeof rootReducer>
