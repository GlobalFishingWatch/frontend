import type { Reducer } from '@reduxjs/toolkit'

import { chatApi } from './map/chat-api'
import { dataTerminologyApi } from './map/data-terminology-api'
import { reportEventsStatsApi } from './map/report-events-stats-api'
import { vesselSearchApi } from './map/search-api'
import { dataviewStatsApi } from './map/stats-api'
import { userGuideApi } from './map/user-guide-api'
import { vesselEventsApi } from './map/vessel-events-api'
import { vesselInsightApi } from './map/vessel-insight-api'
import type { QUERY_REDUCER_PATHS } from './reducer-paths'

/**
 * Typed against QUERY_REDUCER_PATHS so the two cannot drift: `Record` requires every listed path to be
 * present, and the object literal's excess-property check rejects any key that isn't listed.
 *
 * QUERY_REDUCER_PATHS exists separately because store.ts's devtools sanitizer needs the slice names
 * without importing this barrel — which would pull @strapi/client into the entry graph.
 */
export const queriesApiReducers: Record<(typeof QUERY_REDUCER_PATHS)[number], Reducer> = {
  [chatApi.reducerPath]: chatApi.reducer,
  [dataviewStatsApi.reducerPath]: dataviewStatsApi.reducer,
  [reportEventsStatsApi.reducerPath]: reportEventsStatsApi.reducer,
  [userGuideApi.reducerPath]: userGuideApi.reducer,
  [dataTerminologyApi.reducerPath]: dataTerminologyApi.reducer,
  [vesselEventsApi.reducerPath]: vesselEventsApi.reducer,
  [vesselInsightApi.reducerPath]: vesselInsightApi.reducer,
  [vesselSearchApi.reducerPath]: vesselSearchApi.reducer,
}

export const queriesApiMiddlewares = [
  chatApi.middleware,
  dataviewStatsApi.middleware,
  reportEventsStatsApi.middleware,
  userGuideApi.middleware,
  dataTerminologyApi.middleware,
  vesselEventsApi.middleware,
  vesselInsightApi.middleware,
  vesselSearchApi.middleware,
]
