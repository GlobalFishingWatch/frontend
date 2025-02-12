import { createApi } from '@reduxjs/toolkit/query/react'
import { DateTime } from 'luxon'
import { getQueryParamsResolved, gfwBaseQuery } from 'queries/base'
import type { RootState } from 'reducers'

import type { StatsByVessel, StatsIncludes } from '@globalfishingwatch/api-types'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

export type BaseReportEventsVesselsParamsFilters = {
  portId?: string
  vesselGroupId?: string
  encounter_type?: string
  confidence?: number
}
export type BaseReportEventsVesselsParams = {
  start: string
  end: string
  filters?: BaseReportEventsVesselsParamsFilters
}

export type ReportEventsVesselsParams = BaseReportEventsVesselsParams & {
  dataset: string
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

export type ReportEventsVesselsResponse = StatsByVessel[]

export const EVENTS_TIME_FILTER_MODE = 'START-DATE'

function getBaseStatsQuery({ filters, start, end }: BaseReportEventsVesselsParams) {
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

export function getEventsStatsQuery(params: ReportEventsVesselsParams) {
  return {
    ...getBaseStatsQuery(params),
    datasets: [params.dataset],
  }
}

export const reportEventsStatsApi = createApi({
  reducerPath: 'reportEventsStatsApi',
  baseQuery: gfwBaseQuery({
    baseUrl: `/events/stats`,
  }),
  endpoints: (builder) => ({
    getReportEventsStats: builder.query<ReportEventsStatsResponse, ReportEventsStatsParams>({
      queryFn: async (params, { signal }, extraOptions, baseQuery) => {
        const startMillis = DateTime.fromISO(params.start).toMillis()
        const endMillis = DateTime.fromISO(params.end).toMillis()
        const interval = getFourwingsInterval(startMillis, endMillis)
        const query = {
          ...getEventsStatsQuery(params),
          includes: params.includes,
          'timeseries-interval': interval,
        }
        const url = getQueryParamsResolved(query)
        return baseQuery({ url, signal }) as Promise<{ data: ReportEventsStatsResponse }>
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
