import { createApi } from '@reduxjs/toolkit/query/react'
import { gfwBaseQuery } from 'queries/base'
import { InsightResponse } from '@globalfishingwatch/api-types'

type VesselInsightParams = {
  vessels: { vesselId: string; datasetId: string }[]
  includes: string[]
  startDate: string
  endDate: string
}

// Define a service using a base URL and expected endpoints
export const vesselInsightApi = createApi({
  reducerPath: 'vesselInsightApi',
  baseQuery: gfwBaseQuery<InsightResponse>({
    baseUrl: `/insights/vessels`,
    method: 'POST',
  }),
  endpoints: (builder) => ({
    getVesselInsight: builder.mutation<InsightResponse, VesselInsightParams>({
      query: (body) => ({ url: '', method: 'POST', body }),
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetVesselInsightMutation } = vesselInsightApi
