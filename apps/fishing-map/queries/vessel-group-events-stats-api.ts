import { createApi } from '@reduxjs/toolkit/query/react'
import { getQueryParamsResolved, gfwBaseQuery } from 'queries/base'
import { RootState } from 'reducers'
import { FourwingsInterval } from '@globalfishingwatch/deck-loaders'

export type VesselGroupEventsStatsParams = {
  vesselGroupId: string
  datasetId: string
  includes: string[]
  start: string
  end: string
  interval: FourwingsInterval
  groupBy: string // 'FLAG' | 'GEARTYPE'
}

export type VesselGroupEventsStatsResponseGroups = { name: string; value: number }[]

export type VesselGroupEventsStatsResponse = {
  timeseries: { date: string; value: number }[]
  groups: VesselGroupEventsStatsResponseGroups
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
      query: ({ vesselGroupId, datasetId, includes, start, end, interval, groupBy }) => {
        const query = {
          includes,
          'vessel-groups': [vesselGroupId],
          'start-date': start,
          'end-date': end,
          datasets: [datasetId],
          'timeseries-interval': interval,
          'group-by': groupBy,
        }
        return {
          url: `${getQueryParamsResolved(query)}`,
        }
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetVesselGroupEventsStatsQuery } = vesselGroupEventsStatsApi

export const selectVesselGroupEventsStatsApiSlice = (state: RootState) =>
  state.vesselGroupEventsStatsApi

export const selectVesselGroupEventsStats = (params: VesselGroupEventsStatsParams) =>
  vesselGroupEventsStatsApi.endpoints.getVesselGroupEventsStats.select(params)
