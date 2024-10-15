import { createApi } from '@reduxjs/toolkit/query/react'
import { getQueryParamsResolved, gfwBaseQuery } from 'queries/base'
import { RootState } from 'reducers'
import { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { getDataviewFilters, UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { DatasetTypes } from '@globalfishingwatch/api-types'

export type VesselGroupEventsVesselsParams = {
  vesselGroupId: string
  start: string
  end: string
  dataview: UrlDataviewInstance
}

export type VesselGroupEventsStatsParams = VesselGroupEventsVesselsParams & {
  includes: string[]
  interval: FourwingsInterval
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

function getBaseStatsQuery({
  vesselGroupId,
  dataview,
  start,
  end,
}: VesselGroupEventsVesselsParams | VesselGroupEventsStatsParams) {
  const filters = getDataviewFilters(dataview)
  const query = {
    'vessel-groups': [vesselGroupId],
    'start-date': start,
    'end-date': end,
    ...(filters.encounter_type && { 'encounter-types': filters.encounter_type }),
    ...(filters.confidence && { confidences: [filters.confidence] }),
  }
  return query
}

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
      query: (params) => {
        const dataset = params.dataview.datasets?.find((d) => d.type === DatasetTypes.Events)
        const query = {
          ...getBaseStatsQuery(params),
          includes: params.includes,
          datasets: [dataset?.id],
          'timeseries-interval': params.interval,
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
      query: (params) => {
        const dataset = params.dataview.datasets?.find((d) => d.type === DatasetTypes.Events)?.id
        const query = { ...getBaseStatsQuery(params), dataset }
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
