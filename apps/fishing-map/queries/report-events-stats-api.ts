import { createApi } from '@reduxjs/toolkit/query/react'
import { DateTime } from 'luxon'
import { getQueryParamsResolved, gfwBaseQuery } from 'queries/base'
import type { RootState } from 'reducers'

import type { StatsByVessel, StatsIncludes } from '@globalfishingwatch/api-types'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import type { BufferOperation, BufferUnit } from 'types'

export type BaseReportEventsVesselsParamsFilters = {
  portId?: string
  vesselGroupId?: string
  encounter_type?: string
  confidence?: number
  flag?: string[]
}
export type BaseReportEventsVesselsParams = {
  start: string
  end: string
  regionId?: string
  regionDataset?: string
  bufferUnit?: BufferUnit
  bufferValue?: number
  bufferOperation?: BufferOperation
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
  // bufferValue,
  // bufferUnit,
  // bufferOperation,
}: ReportEventsVesselsParams | ReportEventsStatsParams) {
  const query = {
    'start-date': start,
    'end-date': end,
    'time-filter-mode': EVENTS_TIME_FILTER_MODE,
    ...(regionId && { 'region-id': regionId }),
    ...(regionDataset && { 'region-dataset': regionDataset }),
    // TODO:CVP uncomment once the API takes the parameters
    // ...(bufferValue && { 'buffer-value': bufferValue }),
    // ...(bufferUnit && { 'buffer-unit': bufferUnit }),
    // ...(bufferOperation && { 'buffer-operation': bufferOperation }),
    ...(filters?.portId && { 'port-ids': [filters.portId] }),
    ...(filters?.vesselGroupId && { 'vessel-groups': [filters.vesselGroupId] }),
    ...(filters?.encounter_type && { 'encounter-types': filters.encounter_type }),
    ...(filters?.confidence && { confidences: [filters.confidence] }),
    ...(filters?.flag && { flags: filters.flag }),
  }
  return query
}

export function getEventsStatsQuery(params: ReportEventsVesselsParams) {
  return {
    ...getBaseStatsQuery(params),
    datasets: [params.dataset],
  }
}

export function getEventsVesselQuery(params: ReportEventsVesselsParams) {
  return {
    ...getBaseStatsQuery(params),
    dataset: params.dataset,
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
        const data = settledPromises.map((d) => {
          return d.status === 'fulfilled' && !(d.value as any).error
            ? (d.value as { data: ReportEventsStatsResponse }).data
            : ({} as ReportEventsStatsResponse)
        })
        return { data }
      },
    }),
    getReportEventsVessels: builder.query<ReportEventsVesselsResponse[], GetReportEventParams>({
      queryFn: async (params, { signal }, extraOptions, baseQuery) => {
        const promises = params.datasets.map((dataset, index) => {
          const query = getEventsVesselQuery({
            ...params,
            dataset: dataset,
            filters: params.filters?.[index] || {},
          })
          const url = `-by-vessel${getQueryParamsResolved(query)}`
          return baseQuery({ url, signal }) as Promise<{ data: ReportEventsVesselsResponse }>
        })
        const settledPromises = await Promise.allSettled(promises)
        const data = settledPromises.map((d) => {
          return d.status === 'fulfilled' && !(d.value as any).error
            ? (d.value as { data: ReportEventsVesselsResponse }).data
            : []
        })

        return { data }
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
