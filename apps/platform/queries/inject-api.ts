import type { Middleware, Reducer } from '@reduxjs/toolkit'
import { createDynamicMiddleware } from '@reduxjs/toolkit'

import { rootReducer } from 'reducers'

export const QUERY_REDUCER_PATHS = [
  'chatApi',
  'dataviewStatsApi',
  'reportEventsStatsApi',
  'userGuideApi',
  'useCaseApi',
  'dataUpdateApi',
  'dataTerminologyApi',
  'vesselEventsApi',
  'vesselInsightApi',
  'vesselSearchApi',
] as const

type QueryReducerPath = (typeof QUERY_REDUCER_PATHS)[number]

export const queriesDynamicMiddleware = createDynamicMiddleware()

type InjectableApi = {
  reducerPath: QueryReducerPath
  reducer: Reducer
  middleware: Middleware
}

/**
 * Registers an RTK Query API's reducer and middleware at import time
 */
export function injectQueryApi<Api extends InjectableApi>(api: Api) {
  queriesDynamicMiddleware.addMiddleware(api.middleware)
  return rootReducer.inject(
    { reducerPath: api.reducerPath, reducer: api.reducer },
    { overrideExisting: true }
  )
}
