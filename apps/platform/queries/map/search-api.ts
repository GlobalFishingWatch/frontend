import { createApi } from '@reduxjs/toolkit/query/react'
import { stringify } from 'qs'
import { gfwBaseQuery } from 'queries/base'
import { injectQueryApi } from 'queries/inject-api'

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

injectQueryApi(vesselSearchApi)

export const { useSearchByOwnerQuery } = vesselSearchApi
