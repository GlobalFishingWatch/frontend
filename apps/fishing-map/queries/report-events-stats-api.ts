import { createApi } from '@reduxjs/toolkit/query/react'
import { DateTime } from 'luxon'
import { getQueryParamsResolved, gfwBaseQuery } from 'queries/base'
import type { RootState } from 'reducers'

import type { StatsByVessel, StatsGroupBy, StatsIncludes } from '@globalfishingwatch/api-types'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import type { BufferOperation, BufferUnit } from 'types'

export type BaseReportEventsVesselsParamsFilters = {
  portId?: string
  vesselGroupId?: string
  encounter_type?: string
  confidence?: number
  flag?: string[]
  minDuration?: number
  maxDuration?: number
  next_port_id?: string
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
  groupBy?: StatsGroupBy
}

export type ReportEventsStatsResponseGroups = {
  name: string
  value: number
  label?: string
  flag?: string
}[]

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
  groupBy?:
    | 'FLAG'
    | 'GEARTYPE'
    | 'REGION_EEZ'
    | 'REGION_EEZ12NM'
    | 'REGION_FAO'
    | 'REGION_HIGH_SEAS'
    | 'REGION_MAJOR_FAO'
    | 'REGION_MPA'
    | 'REGION_MPA_NO_TAKE'
    | 'REGION_MPA_NO_TAKE_PARTIAL'
    | 'REGION_RFMO'
    | 'NEXT_PORT_ID'
}

export type ReportEventsVesselsResponse = StatsByVessel[]

export const EVENTS_TIME_FILTER_MODE = 'START-DATE'

export function parseEventsFilters(filters: BaseReportEventsVesselsParamsFilters) {
  if (!filters) {
    return {}
  }
  return {
    ...(filters.confidence && { confidences: filters.confidence }),
    ...(filters.encounter_type && { 'encounter-types': filters.encounter_type }),
    ...(filters.flag && { flags: filters.flag }),
    ...(filters.maxDuration && { 'max-duration': filters.maxDuration }),
    ...(filters.minDuration && { 'min-duration': filters.minDuration }),
    ...(filters.next_port_id && { 'next-port-ids': filters.next_port_id }),
    ...(filters.portId && { 'port-ids': [filters.portId] }),
    ...(filters.vesselGroupId && { 'vessel-groups': [filters.vesselGroupId] }),
  }
}

function getBaseStatsQuery({
  filters,
  start,
  end,
  regionId,
  regionDataset,
  bufferValue,
  bufferUnit,
  bufferOperation,
}: ReportEventsVesselsParams | ReportEventsStatsParams) {
  const query = {
    'start-date': start,
    'end-date': end,
    'time-filter-mode': EVENTS_TIME_FILTER_MODE,
    ...(regionId && { 'region-ids': regionId.split(',') }),
    ...(regionDataset && { 'region-datasets': regionDataset.split(',') }),
    ...(bufferValue && { 'buffer-value': bufferValue }),
    ...(bufferUnit && { 'buffer-unit': bufferUnit.toUpperCase() }),
    ...(bufferOperation && { 'buffer-operation': bufferOperation.toUpperCase() }),
    ...parseEventsFilters(filters),
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
            ...(params.includes && { includes: params.includes }),
            ...(params.groupBy && { 'group-by': params.groupBy }),
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

export const selectReportEventsPorts = (params: GetReportEventParams) =>
  reportEventsStatsApi.endpoints.getReportEventsStats.select(params)
