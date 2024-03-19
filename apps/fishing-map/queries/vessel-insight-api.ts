import { createApi } from '@reduxjs/toolkit/query/react'
import { gfwBaseQuery } from 'queries/base'

export type VesselInsightParams = {
  vessels: { vesselId: string; datasetId: string }[]
  includes: string[]
  startDate: string
  endDate: string
}

// Define a service using a base URL and expected endpoints
export const vesselInsightApi = createApi({
  reducerPath: 'vesselInsightApi',
  baseQuery: gfwBaseQuery({
    baseUrl: `/insights/vessels`,
    method: 'POST',
  }),
  tagTypes: ['Insight'],
  endpoints: (builder) => ({
    getVesselInsight: builder.mutation({
      query: (body) => {
        console.log('body:', body)
        return { url: '', method: 'POST', body }
      },
      invalidatesTags: ['Insight'],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetVesselInsightMutation } = vesselInsightApi
