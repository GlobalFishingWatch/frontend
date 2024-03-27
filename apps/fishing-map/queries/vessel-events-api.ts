import { createApi } from '@reduxjs/toolkit/query/react'
import { stringify } from 'qs'
import { gfwBaseQuery } from 'queries/base'

type SearchOwnerParams = {
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
    getVesselEvents: builder.query({
      serializeQueryArgs: ({ queryArgs }: { queryArgs: SearchOwnerParams }) => {
        return [
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
          url: stringify(params, { arrayFormat: 'indices', addQueryPrefix: true }),
        }
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetVesselEventsQuery } = vesselEventsApi
