import { createApi } from '@reduxjs/toolkit/query/react'
import { getQueryParamsResolved, gfwBaseQuery } from 'queries/base'
import { RootState } from 'reducers'
import {
  InsightResponse,
  InsightType,
  VesselGroupInsightResponse,
} from '@globalfishingwatch/api-types'

export type VesselInsightParams = {
  includes: InsightType[]
  startDate: string
  endDate: string
  vessels: { vesselId: string; datasetId: string }[]
}

export type VesselGroupInsightParams = {
  vesselGroupId: string
  insight: InsightType
  start: string
  end: string
}

// Define a service using a base URL and expected endpoints
export const vesselInsightApi = createApi({
  reducerPath: 'vesselInsightApi',
  baseQuery: gfwBaseQuery<InsightResponse | VesselGroupInsightResponse>({
    baseUrl: `/insights`,
  }),
  endpoints: (builder) => ({
    getVesselInsight: builder.mutation<InsightResponse, VesselInsightParams>({
      // TODO review this in vessel profile
      query: (body) => {
        return { url: '/vessels', method: 'POST', body }
      },
    }),
    getVesselGroupInsight: builder.query<VesselGroupInsightResponse, VesselGroupInsightParams>({
      query: ({ vesselGroupId, insight, start, end }) => {
        const query = {
          includes: [insight],
          'vessel-groups': [vesselGroupId],
          'start-date': start,
          'end-date': end,
        }
        return {
          url: `/vessel-groups${getQueryParamsResolved(query)}`,
        }
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetVesselInsightMutation, useGetVesselGroupInsightQuery } = vesselInsightApi

export const selectVesselGroupInsightApiSlice = (state: RootState) => state.vesselInsightApi

export const selectVesselGroupInsight = (params: VesselGroupInsightParams) =>
  vesselInsightApi.endpoints.getVesselGroupInsight.select(params)
