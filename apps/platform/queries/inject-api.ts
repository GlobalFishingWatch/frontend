import type { Middleware, Reducer } from '@reduxjs/toolkit'
import { compose } from '@reduxjs/toolkit'

import { rootReducer } from 'reducers'

export const QUERY_REDUCER_PATHS = [
  'chatApi',
  'dataviewStatsApi',
  'reportEventsStatsApi',
  'userGuideApi',
  'dataTerminologyApi',
  'vesselEventsApi',
  'vesselInsightApi',
  'vesselSearchApi',
] as const

type QueryReducerPath = (typeof QUERY_REDUCER_PATHS)[number]

// Not RTK's createDynamicMiddleware: it keeps every store it has seen in a module-level Map, so on
// the server each SSR request's store (and its whole state) was retained forever and Cloud Run
// instances died of heap OOM after ~1h. Here the applied middlewares live in the store's closure.
const queryMiddlewares: Middleware[] = []

export const queriesMiddleware: Middleware = (storeApi) => (next) => {
  const applied = new Map<Middleware, ReturnType<Middleware>>()
  let appliedCount = -1
  let dispatch = next
  return (action) => {
    if (appliedCount !== queryMiddlewares.length) {
      const chain = queryMiddlewares.map((middleware) => {
        let withStore = applied.get(middleware)
        if (!withStore) {
          withStore = middleware(storeApi)
          applied.set(middleware, withStore)
        }
        return withStore
      })
      dispatch = compose<typeof next>(...chain)(next)
      appliedCount = queryMiddlewares.length
    }
    return dispatch(action)
  }
}

type InjectableApi = {
  reducerPath: QueryReducerPath
  reducer: Reducer
  middleware: Middleware
}

/**
 * Registers an RTK Query API's reducer and middleware at import time
 */
export function injectQueryApi<Api extends InjectableApi>(api: Api) {
  if (!queryMiddlewares.includes(api.middleware)) {
    queryMiddlewares.push(api.middleware)
  }
  return rootReducer.inject(
    { reducerPath: api.reducerPath, reducer: api.reducer },
    { overrideExisting: true }
  )
}
