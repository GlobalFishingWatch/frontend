import { createApi } from '@reduxjs/toolkit/query/react'
import { DateTime } from 'luxon'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import type { StatsIncludes } from '@globalfishingwatch/api-types'
import type { RootState } from 'reducers'
import { getQueryParamsResolved, gfwBaseQuery } from 'queries/base'

export type ReportEventsVesselsParams = {
  start: string
  end: string
  dataset: string
  filters?: {
    portId?: string
    vesselGroupId?: string
    encounter_type?: string
    confidence?: number
  }
}

export type ReportEventsStatsParams = ReportEventsVesselsParams & {
  includes?: StatsIncludes[]
}

export type ReportEventsStatsResponseGroups = { name: string; value: number }[]

export type ReportEventsStatsResponse = {
  numEvents: number
  numFlags: number
  numVessels: number
  timeseries: { date: string; value: number }[]
  groups: ReportEventsStatsResponseGroups
}

export type ReportEventsVesselsResponseItem = {
  numEvents: number
  portCountry: string
  portName: string
  totalDuration: number
  vesselId: string
}

export type ReportEventsVesselsResponse = ReportEventsVesselsResponseItem[]

export const EVENTS_TIME_FILTER_MODE = 'START-DATE'

function getBaseStatsQuery({
  filters,
  start,
  end,
}: ReportEventsVesselsParams | ReportEventsStatsParams) {
  const query = {
    'start-date': start,
    'end-date': end,
    'time-filter-mode': EVENTS_TIME_FILTER_MODE,
    ...(filters?.portId && { 'port-ids': [filters.portId] }),
    ...(filters?.vesselGroupId && { 'vessel-groups': [filters.vesselGroupId] }),
    ...(filters?.encounter_type && { 'encounter-types': filters.encounter_type }),
    ...(filters?.confidence && { confidences: [filters.confidence] }),
  }
  return query
}

export const reportEventsStatsApi = createApi({
  reducerPath: 'reportEventsStatsApi',
  baseQuery: gfwBaseQuery({
    baseUrl: `/events/stats`,
  }),
  endpoints: (builder) => ({
    getReportEventsStats: builder.query<ReportEventsStatsResponse, ReportEventsStatsParams>({
      query: (params) => {
        const startMillis = DateTime.fromISO(params.start).toMillis()
        const endMillis = DateTime.fromISO(params.end).toMillis()
        const interval = getFourwingsInterval(startMillis, endMillis)
        const query = {
          ...getBaseStatsQuery(params),
          includes: params.includes,
          datasets: [params.dataset],
          'timeseries-interval': interval,
        }
        return {
          url: `${getQueryParamsResolved(query)}`,
        }
      },
    }),
    getReportEventsVessels: builder.query<ReportEventsVesselsResponse, ReportEventsVesselsParams>({
      query: (params) => {
        const query = { ...getBaseStatsQuery(params), dataset: params.dataset }
        return {
          url: `-by-vessel${getQueryParamsResolved(query)}`,
        }
      },
    }),
  }),
})

export const { useGetReportEventsStatsQuery, useGetReportEventsVesselsQuery } = reportEventsStatsApi

export const selectReportEventsStatsApiSlice = (state: RootState) => state.reportEventsStatsApi

export const selectReportEventsStats = (params: ReportEventsStatsParams) =>
  reportEventsStatsApi.endpoints.getReportEventsStats.select(params)

export const selectReportEventsVessels = (params: ReportEventsVesselsParams) =>
  reportEventsStatsApi.endpoints.getReportEventsVessels.select(params)
