import { createApi } from '@reduxjs/toolkit/query/react'
import { getQueryParamsResolved, gfwBaseQuery } from 'queries/base'
import { ApiEvents, PortVisitEvent } from '@globalfishingwatch/api-types'

type VesselEventsApiParams = {
  start: string
  end: string
  dataset: string
}

export const portInfoApi = createApi({
  reducerPath: 'portInfoApi',
  baseQuery: gfwBaseQuery({
    baseUrl: '/events',
  }),
  endpoints: (builder) => ({
    getPortInfo: builder.query<PortVisitEvent, VesselEventsApiParams>({
      query: (params) => {
        const queryParams = {
          'start-date': params.start,
          'end-date': params.end,
          datasets: [params.dataset],
          limit: 1,
          offset: 0,
          // TODO:PORTS
          // confidences: 4
        }
        return {
          url: getQueryParamsResolved(queryParams),
        }
      },
      transformResponse(res: ApiEvents) {
        return res.entries?.[0].port_visit as PortVisitEvent
      },
    }),
  }),
})

export const { useGetPortInfoQuery } = portInfoApi
