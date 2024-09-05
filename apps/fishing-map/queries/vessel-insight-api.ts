import { createApi } from '@reduxjs/toolkit/query/react'
import { getQueryParamsResolved, gfwBaseQuery } from 'queries/base'
import { InsightResponse, InsightType } from '@globalfishingwatch/api-types'

type BaseInsightParams = {
  includes: InsightType[]
}

export type VesselInsightParams = BaseInsightParams & {
  startDate: string
  endDate: string
  vessels: { vesselId: string; datasetId: string }[]
}

export type VesselGroupInsightParams = BaseInsightParams & {
  'start-date': string
  'end-date': string
  'vessel-groups': string[]
}

// Define a service using a base URL and expected endpoints
export const vesselInsightApi = createApi({
  reducerPath: 'vesselInsightApi',
  baseQuery: gfwBaseQuery<InsightResponse>({
    baseUrl: `/insights`,
  }),
  endpoints: (builder) => ({
    getVesselInsight: builder.mutation<InsightResponse, VesselInsightParams>({
      query: (body) => {
        return { url: '/vessels', method: 'POST', body }
      },
    }),
    getVesselGroupInsight: builder.query<InsightResponse, VesselGroupInsightParams>({
      // serializeQueryArgs: ({ queryArgs }: { queryArgs: VesselGroupInsightParams }) => {
      //   return [
      //     queryArgs.vesselGroups?.join('-'),
      //     queryArgs.includes?.join('-'),
      //     queryArgs.startDate,
      //     queryArgs.endDate,
      //   ].join('-')
      // },
      query: (params) => {
        return {
          url: `/vessel-groups${getQueryParamsResolved(params)}`,
        }
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetVesselInsightMutation, useGetVesselGroupInsightQuery } = vesselInsightApi
