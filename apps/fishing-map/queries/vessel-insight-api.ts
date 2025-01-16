import { createApi } from '@reduxjs/toolkit/query/react'
import { getQueryParamsResolved, gfwBaseQuery } from 'queries/base'
import type { RootState } from 'reducers'

import type {
  InsightResponse,
  InsightType,
  VesselGroupInsightResponse,
} from '@globalfishingwatch/api-types'

export type BaseInsightParams = {
  insight: InsightType
  start: string
  end: string
}

export type VesselInsightParams = BaseInsightParams & {
  vessels: { vesselId: string; datasetId: string }[]
}

export type VesselGroupInsightParams = BaseInsightParams & {
  vesselGroupId: string
}

const getBaseQueryParams = (params: BaseInsightParams) => {
  return {
    includes: [params.insight],
    'start-date': params.start,
    'end-date': params.end,
  }
}

export const vesselInsightApi = createApi({
  reducerPath: 'vesselInsightApi',
  baseQuery: gfwBaseQuery<InsightResponse | VesselGroupInsightResponse>({
    baseUrl: `/insights`,
  }),
  endpoints: (builder) => ({
    getVesselInsight: builder.query<InsightResponse, VesselInsightParams>({
      query: ({ vessels, ...params }) => {
        const query = {
          ...getBaseQueryParams(params),
          vessels: vessels.map((v) => v.vesselId),
          datasets: vessels.map((v) => v.datasetId),
        }
        return { url: `/vessels${getQueryParamsResolved(query)}` }
      },
    }),
    getVesselGroupInsight: builder.query<VesselGroupInsightResponse, VesselGroupInsightParams>({
      query: ({ vesselGroupId, ...params }) => {
        const query = {
          ...getBaseQueryParams(params),
          'vessel-groups': [vesselGroupId],
        }
        return {
          url: `/vessel-groups${getQueryParamsResolved(query)}`,
        }
      },
    }),
  }),
})

export const { useGetVesselInsightQuery, useGetVesselGroupInsightQuery } = vesselInsightApi

export const selectVesselGroupInsightApiSlice = (state: RootState) => state.vesselInsightApi

export const selectVesselGroupInsight = (params: VesselGroupInsightParams) =>
  vesselInsightApi.endpoints.getVesselGroupInsight.select(params)
