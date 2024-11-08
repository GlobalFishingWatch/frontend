import { portInfoApi } from './port-info-api'
import { reportEventsStatsApi } from './report-events-stats-api'
import { vesselSearchApi } from './search-api'
import { dataviewStatsApi } from './stats-api'
import { vesselEventsApi } from './vessel-events-api'
import { vesselInsightApi } from './vessel-insight-api'

export const queriesApiReducers = {
  [dataviewStatsApi.reducerPath]: dataviewStatsApi.reducer,
  [portInfoApi.reducerPath]: portInfoApi.reducer,
  [reportEventsStatsApi.reducerPath]: reportEventsStatsApi.reducer,
  [vesselEventsApi.reducerPath]: vesselEventsApi.reducer,
  [vesselInsightApi.reducerPath]: vesselInsightApi.reducer,
  [vesselSearchApi.reducerPath]: vesselSearchApi.reducer,
}

export const queriesApiMiddlewares = [
  dataviewStatsApi.middleware,
  vesselSearchApi.middleware,
  vesselEventsApi.middleware,
  vesselInsightApi.middleware,
  reportEventsStatsApi.middleware,
  portInfoApi.middleware,
]
