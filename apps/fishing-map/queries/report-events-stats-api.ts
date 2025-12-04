import { createApi } from '@reduxjs/toolkit/query/react'
import { DateTime } from 'luxon'
import { getQueryParamsResolved, gfwBaseQuery } from 'queries/base'
import type { RootState } from 'reducers'

import {
  DatasetTypes,
  EndpointId,
  EXCLUDE_FILTER_ID,
  type FilterOperator,
  type FilterOperators,
  type StatsByVessel,
  type StatsGroupBy,
  type StatsIncludes,
} from '@globalfishingwatch/api-types'
import { getEndpointByType } from '@globalfishingwatch/datasets-client'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import type { BufferOperation, BufferUnit } from 'types'

export type BaseReportEventsVesselsParamsFilters = {
  portId?: string
  /**
   * Used in dataviews filter instead of stats, needs to maintain both
   */
  port_id?: string
  vesselGroupId?: string
  encounter_type?: string
  confidence?: number
  flag?: string[]
  type?: string[]
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
  filtersOperators?: FilterOperators
}

export type ReportEventsStatsParams = ReportEventsVesselsParams & {
  dataset: string
  filters: BaseReportEventsVesselsParamsFilters
  filtersOperators?: FilterOperator
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
  filtersOperators?: FilterOperators[]
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

function getFilterWithOperator(
  key: string,
  value?: number | string | string[],
  filtersOperator?: FilterOperator
) {
  if (!key || !value) {
    return {}
  }
  if (filtersOperator === EXCLUDE_FILTER_ID) {
    return { [key]: value, [`${key}-operator`]: EXCLUDE_FILTER_ID.toUpperCase() }
  }
  return { [key]: value }
}

export function parseEventsFilters(
  filters: BaseReportEventsVesselsParamsFilters,
  filtersOperators?: FilterOperators
) {
  if (!filters) {
    return {}
  }
  const vesselGroupId = filters.vesselGroupId || (filters as any)['vessel-groups']?.[0]

  return {
    ...getFilterWithOperator(
      'encounter-types',
      filters.encounter_type,
      filtersOperators?.encounter_type
    ),
    ...getFilterWithOperator('flags', filters.flag, filtersOperators?.flag),
    ...getFilterWithOperator('vessel-types', filters.type, filtersOperators?.type),
    ...getFilterWithOperator('confidences', filters.confidence, filtersOperators?.confidence),
    ...getFilterWithOperator('next-port-ids', filters.next_port_id, filtersOperators?.next_port_id),
    ...(filters.maxDuration && { 'max-duration': filters.maxDuration }),
    ...(filters.minDuration && { 'min-duration': filters.minDuration }),
    ...((filters.portId || filters.port_id) && { 'port-ids': [filters.portId || filters.port_id] }),
    ...(vesselGroupId && { 'vessel-groups': [vesselGroupId] }),
  }
}

function getBaseStatsQuery({
  filters,
  filtersOperators,
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
    ...parseEventsFilters(filters, filtersOperators),
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

// TODO:DR (dataset-refactor) use the new typing for the params
const endpoint = getEndpointByType({
  type: DatasetTypes.Events,
  endpoint: EndpointId.EventsStats,
})

export const reportEventsStatsApi = createApi({
  reducerPath: 'reportEventsStatsApi',
  baseQuery: gfwBaseQuery({ baseUrl: endpoint.pathTemplate }),
  endpoints: (builder) => ({
    getReportEventsStats: builder.query<ReportEventsStatsResponse[], GetReportEventParams>({
      queryFn: async (params, { signal }, extraOptions, baseQuery) => {
        const promises = params.datasets.map((dataset, index) => {
          const startMillis = DateTime.fromISO(params.start).toMillis()
          const endMillis = DateTime.fromISO(params.end).toMillis()
          const interval = getFourwingsInterval(startMillis, endMillis)
          const query = {
            ...getEventsStatsQuery({
              ...params,
              dataset,
              filters: params.filters?.[index] || {},
              filtersOperators: params.filtersOperators?.[index],
            }),
            ...(params.includes && { includes: params.includes }),
            ...(params.groupBy && { 'group-by': params.groupBy }),
            'timeseries-interval': interval,
          }
          const url = getQueryParamsResolved(query)
          return baseQuery({ url, signal }) as Promise<{ data: ReportEventsStatsResponse }>
        })
        const settledPromises = await Promise.allSettled(promises)

        const errorPromise = settledPromises.find(
          (p) => p.status === 'rejected' || (p.status === 'fulfilled' && (p.value as any)?.error)
        )

        if (errorPromise) {
          const error =
            errorPromise?.status === 'rejected'
              ? errorPromise.reason
              : (errorPromise?.value as any)?.error
          return {
            error,
          }
        }

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
            filtersOperators: params.filtersOperators?.[index],
          })
          const url = `-by-vessel${getQueryParamsResolved(query)}`
          return baseQuery({ url, signal }) as Promise<{ data: ReportEventsVesselsResponse }>
        })
        const settledPromises = await Promise.allSettled(promises)

        const errorPromise = settledPromises.find(
          (p) => p.status === 'rejected' || (p.status === 'fulfilled' && (p.value as any)?.error)
        )

        if (errorPromise) {
          const error =
            errorPromise?.status === 'rejected'
              ? errorPromise.reason
              : (errorPromise?.value as any)?.error
          return {
            error,
          }
        }

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
