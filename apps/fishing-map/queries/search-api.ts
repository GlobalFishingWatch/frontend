import { createApi } from '@reduxjs/toolkit/query/react'
import { stringify } from 'qs'
import { gfwBaseQuery } from 'queries/base'

import { getAdvancedSearchQuery } from '@globalfishingwatch/api-client'
import {
  type APIVesselSearchPagination,
  DatasetTypes,
  EndpointId,
  type IdentityVessel,
} from '@globalfishingwatch/api-types'
import { getEndpointByType } from '@globalfishingwatch/datasets-client'

const endpoint = getEndpointByType({
  type: DatasetTypes.Vessels,
  endpoint: EndpointId.VesselSearch,
})
// TODO:DR (dataset-refactor) use the new typing for the params
type SearchIncludes = 'MATCH_CRITERIA' | 'OWNERSHIP'

type SearchOwnerParams = {
  owner: string | string[]
  datasets: string[]
  includes?: SearchIncludes[]
}

// Define a service using a base URL and expected endpoints
export const vesselSearchApi = createApi({
  reducerPath: 'vesselSearchApi',
  baseQuery: gfwBaseQuery({
    baseUrl: endpoint.pathTemplate,
  }),
  endpoints: (builder) => ({
    searchByOwner: builder.query<APIVesselSearchPagination<IdentityVessel>, SearchOwnerParams>({
      serializeQueryArgs: ({ queryArgs }) => {
        return [
          JSON.stringify(queryArgs.owner),
          JSON.stringify(queryArgs.datasets),
          JSON.stringify(queryArgs.includes),
        ].join('-')
      },
      query: ({ owner, datasets, includes = [] }) => {
        const ownerArray = Array.isArray(owner) ? owner : [owner]
        const params = {
          where: getAdvancedSearchQuery([{ key: 'owner', value: ownerArray }]),
          includes,
          datasets,
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
export const { useSearchByOwnerQuery } = vesselSearchApi
