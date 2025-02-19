import { createApi } from '@reduxjs/toolkit/query/react'
import { DateTime } from 'luxon'
import { getQueryParamsResolved, gfwBaseQuery } from 'queries/base'
import type { RootState } from 'reducers'

import type { StatsByVessel, StatsIncludes } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

export type BaseReportEventsVesselsParamsFilters = {
  portId?: string
  vesselGroupId?: string
  encounter_type?: string
  confidence?: number
  sql?: string
}
export type BaseReportEventsVesselsParams = {
  start: string
  end: string
  regionId?: string
  regionDataset?: string
}

export type ReportEventsVesselsParams = BaseReportEventsVesselsParams & {
  dataset: string
  filters: BaseReportEventsVesselsParamsFilters
}

export type ReportEventsStatsParams = ReportEventsVesselsParams & {
  dataset: string
  filters: BaseReportEventsVesselsParamsFilters
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

export type GetReportEventParams = BaseReportEventsVesselsParams & {
  datasets: string[]
  filters?: BaseReportEventsVesselsParamsFilters[]
  includes?: StatsIncludes[]
}

export type ReportEventsVesselsResponse = StatsByVessel[]

export const EVENTS_TIME_FILTER_MODE = 'START-DATE'

function getBaseStatsQuery({
  filters,
  start,
  end,
  regionId,
  regionDataset,
}: ReportEventsVesselsParams | ReportEventsStatsParams) {
  const query = {
    'start-date': start,
    'end-date': end,
    'time-filter-mode': EVENTS_TIME_FILTER_MODE,
    ...(regionId && { 'region-id': regionId }),
    ...(regionDataset && { 'region-dataset': regionDataset }),
    ...(filters?.portId && { 'port-ids': [filters.portId] }),
    ...(filters?.vesselGroupId && { 'vessel-groups': [filters.vesselGroupId] }),
    ...(filters?.encounter_type && { 'encounter-types': filters.encounter_type }),
    ...(filters?.confidence && { confidences: [filters.confidence] }),
    ...(filters?.sql && { filters: filters.sql }),
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
    getReportEventsStats: builder.query<ReportEventsStatsResponse[], GetReportEventParams>({
      queryFn: async (params, { signal }, extraOptions, baseQuery) => {
        const promises = params.datasets.map((dataset, index) => {
          const startMillis = DateTime.fromISO(params.start).toMillis()
          const endMillis = DateTime.fromISO(params.end).toMillis()
          const interval = getFourwingsInterval(startMillis, endMillis)
          const query = {
            ...getEventsStatsQuery({ ...params, dataset, filters: params.filters?.[index] || {} }),
            includes: params.includes,
            'timeseries-interval': interval,
          }
          const url = getQueryParamsResolved(query)
          return baseQuery({ url, signal }) as Promise<{ data: ReportEventsStatsResponse }>
        })
        const settledPromises = await Promise.allSettled(promises)
        const data = settledPromises.flatMap((d) => {
          return d.status === 'fulfilled' && !(d.value as any).error
            ? (d.value as { data: ReportEventsStatsResponse }).data
            : []
        })
        // const data = stats.reduce(
        //   (acc, curr) => ({
        //     ...acc,
        //     timeseries: [...(acc.timeseries || []), ...curr.data.timeseries],
        //   }),
        //   {} as ReportEventsStatsResponse
        // )
        return { data }
      },
    }),
    getReportEventsVessels: builder.query<ReportEventsVesselsResponse, GetReportEventParams>({
      query: (params) => {
        const query = { ...getBaseStatsQuery(params), dataset: params.datasets[0] }
        return {
          url: `-by-vessel${getQueryParamsResolved(query)}`,
        }
      },
    }),
  }),
})

export const { useGetReportEventsStatsQuery, useGetReportEventsVesselsQuery } = reportEventsStatsApi

export const selectReportEventsStatsApiSlice = (state: RootState) => state.reportEventsStatsApi

export const selectReportEventsStats = (params: GetReportEventParams) =>
  reportEventsStatsApi.endpoints.getReportEventsStats.select(params)

export const selectReportEventsVessels = (params: GetReportEventParams) =>
  reportEventsStatsApi.endpoints.getReportEventsVessels.select(params)
