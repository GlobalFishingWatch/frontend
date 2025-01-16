import { createApi } from '@reduxjs/toolkit/query/react'
import { getQueryParamsResolved, gfwBaseQuery } from 'queries/base'

import type { ApiEvents } from '@globalfishingwatch/api-types'

type VesselEventsApiParams = {
  ids?: string[]
  vessels: string[]
  datasets: string[]
  'start-date': string
  'end-date': string
}

// Define a service using a base URL and expected endpoints
export const vesselEventsApi = createApi({
  reducerPath: 'vesselEventsApi',
  baseQuery: gfwBaseQuery({
    baseUrl: '/events',
  }),
  endpoints: (builder) => ({
    getVesselEvents: builder.query<ApiEvents, VesselEventsApiParams>({
      serializeQueryArgs: ({ queryArgs }: { queryArgs: VesselEventsApiParams }) => {
        return [
          queryArgs.ids?.join('-'),
          queryArgs.vessels?.join('-'),
          queryArgs.datasets?.join('-'),
          queryArgs['start-date'],
          queryArgs['end-date'],
        ].join('-')
      },
      query: (queryParams) => {
        const params = {
          ...queryParams,
          limit: 9999999,
          offset: 0,
        }
        return {
          url: getQueryParamsResolved(params),
        }
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetVesselEventsQuery } = vesselEventsApi
