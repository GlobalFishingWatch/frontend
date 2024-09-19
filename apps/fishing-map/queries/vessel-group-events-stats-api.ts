import { createApi } from '@reduxjs/toolkit/query/react'
import { getQueryParamsResolved, gfwBaseQuery } from 'queries/base'
import { RootState } from 'reducers'
import { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

export type VesselGroupEventsStatsParams = {
  vesselGroupId: string
  includes: string[]
  start: string
  end: string
  interval: FourwingsInterval
  groupBy: string // 'FLAG' | 'GEARTYPE'
  dataview: UrlDataviewInstance
}

export type VesselGroupEventsVesselsParams = {
  vesselGroupId: string
  start: string
  end: string
  dataview: UrlDataviewInstance
}

export type VesselGroupEventsStatsResponseGroups = { name: string; value: number }[]

export type VesselGroupEventsStatsResponse = {
  timeseries: { date: string; value: number }[]
  groups: VesselGroupEventsStatsResponseGroups
}
export type VesselGroupEventsVesselsResponse = {
  numEvents: number
  portCountry: string
  portName: string
  totalDuration: number
  vesselId: string
}[]

// Define a service using a base URL and expected endpoints
export const vesselGroupEventsStatsApi = createApi({
  reducerPath: 'vesselGroupEventsStatsApi',
  baseQuery: gfwBaseQuery({
    baseUrl: `/events/stats`,
  }),
  endpoints: (builder) => ({
    getVesselGroupEventsStats: builder.query<
      VesselGroupEventsStatsResponse,
      VesselGroupEventsStatsParams
    >({
      query: ({ vesselGroupId, dataview, includes, start, end, interval, groupBy }) => {
        const encounterTypes =
          dataview?.datasets?.[0]?.subcategory === 'encounter'
            ? dataview?.datasetsConfig?.[0]?.filters?.encounter_type
            : undefined
        const query = {
          includes,
          'vessel-groups': [vesselGroupId],
          'start-date': start,
          'end-date': end,
          datasets: [dataview.datasets?.[0]?.id],
          'timeseries-interval': interval,
          'group-by': groupBy,
          ...(encounterTypes && { 'encounter-types': encounterTypes }),
        }
        return {
          url: `${getQueryParamsResolved(query)}`,
        }
      },
    }),
    getVesselGroupEventsVessels: builder.query<
      VesselGroupEventsVesselsResponse,
      VesselGroupEventsVesselsParams
    >({
      query: ({ vesselGroupId, dataview, start, end }) => {
        const encounterTypes =
          dataview?.datasets?.[0]?.subcategory === 'encounter'
            ? dataview?.datasetsConfig?.[0]?.filters?.encounter_type
            : undefined
        const query = {
          'vessel-groups': [vesselGroupId],
          'start-date': start,
          'end-date': end,
          dataset: dataview.datasets?.[0]?.id as string,
          ...(encounterTypes && { 'encounter-types': encounterTypes }),
        }
        return {
          url: `-by-vessel${getQueryParamsResolved(query)}`,
        }
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetVesselGroupEventsStatsQuery, useGetVesselGroupEventsVesselsQuery } =
  vesselGroupEventsStatsApi

export const selectVesselGroupEventsStatsApiSlice = (state: RootState) =>
  state.vesselGroupEventsStatsApi

export const selectVesselGroupEventsStats = (params: VesselGroupEventsStatsParams) =>
  vesselGroupEventsStatsApi.endpoints.getVesselGroupEventsStats.select(params)

export const selectVesselGroupEventsVessels = (params: VesselGroupEventsVesselsParams) =>
  vesselGroupEventsStatsApi.endpoints.getVesselGroupEventsVessels.select(params)
