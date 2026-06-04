import { dataTerminologyApi } from './data-terminology-api'
import { reportEventsStatsApi } from './report-events-stats-api'
import { vesselSearchApi } from './search-api'
import { dataviewStatsApi } from './stats-api'
import { userGuideApi } from './user-guide-api'
import { vesselEventsApi } from './vessel-events-api'
import { vesselInsightApi } from './vessel-insight-api'

export const queriesApiReducers = {
  [dataviewStatsApi.reducerPath]: dataviewStatsApi.reducer,
  [reportEventsStatsApi.reducerPath]: reportEventsStatsApi.reducer,
  [userGuideApi.reducerPath]: userGuideApi.reducer,
  [dataTerminologyApi.reducerPath]: dataTerminologyApi.reducer,
  [vesselEventsApi.reducerPath]: vesselEventsApi.reducer,
  [vesselInsightApi.reducerPath]: vesselInsightApi.reducer,
  [vesselSearchApi.reducerPath]: vesselSearchApi.reducer,
}

export const queriesApiMiddlewares = [
  dataviewStatsApi.middleware,
  reportEventsStatsApi.middleware,
  userGuideApi.middleware,
  dataTerminologyApi.middleware,
  vesselEventsApi.middleware,
  vesselInsightApi.middleware,
  vesselSearchApi.middleware,
]
