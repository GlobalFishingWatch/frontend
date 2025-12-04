import { createApi } from '@reduxjs/toolkit/query/react'
import { getQueryParamsResolved, gfwBaseQuery } from 'queries/base'

import { type ApiEvents, DatasetTypes, EndpointId } from '@globalfishingwatch/api-types'
import type { InferQueryParams } from '@globalfishingwatch/datasets-client'
import { getEndpointByType } from '@globalfishingwatch/datasets-client'

const endpoint = getEndpointByType({
  type: DatasetTypes.Events,
  endpoint: EndpointId.Events,
})

type VesselEventsApiParams = InferQueryParams<typeof endpoint> & {
  ids?: string[]
}

// Define a service using a base URL and expected endpoints
export const vesselEventsApi = createApi({
  reducerPath: 'vesselEventsApi',
  baseQuery: gfwBaseQuery({
    baseUrl: endpoint.pathTemplate,
  }),
  endpoints: (builder) => ({
    getVesselEvents: builder.query<ApiEvents['entries'], VesselEventsApiParams>({
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
      transformResponse: (response: ApiEvents) => {
        return [...response.entries].sort((a, b) =>
          (a.start as string) < (b.start as string) ? 1 : -1
        )
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetVesselEventsQuery } = vesselEventsApi
