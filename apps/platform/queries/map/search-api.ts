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
  ownerFlag?: string | string[]
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
          JSON.stringify(queryArgs.ownerFlag),
          JSON.stringify(queryArgs.datasets),
          JSON.stringify(queryArgs.includes),
        ].join('-')
      },
      query: ({ owner, ownerFlag, datasets, includes = [] }) => {
        const ownerArray = Array.isArray(owner) ? owner : [owner]
        // registryOwners.flag is not supported by the search API's where clause,
        // so we need the ownership data to filter by owner flag client-side
        const needsOwnership = Boolean(ownerFlag?.length) && !includes.includes('OWNERSHIP')
        const params = {
          where: getAdvancedSearchQuery([{ key: 'owner', value: ownerArray }]),
          includes: needsOwnership ? [...includes, 'OWNERSHIP' as const] : includes,
          datasets,
        }
        return {
          url: stringify(params, { arrayFormat: 'indices', addQueryPrefix: true }),
        }
      },
      transformResponse: (
        response: APIVesselSearchPagination<IdentityVessel>,
        _meta,
        { owner, ownerFlag }: SearchOwnerParams
      ) => {
        if (!ownerFlag?.length) return response
        const ownerFlags = (Array.isArray(ownerFlag) ? ownerFlag : [ownerFlag]).map((flag) =>
          flag.toUpperCase()
        )
        const ownerNames = (Array.isArray(owner) ? owner : [owner]).map((name) =>
          name.toUpperCase()
        )
        const entries = response.entries.filter((vessel) =>
          vessel.registryOwners?.some(
            (registryOwner) =>
              ownerFlags.includes(registryOwner.flag?.toUpperCase()) &&
              ownerNames.some((name) => registryOwner.name?.toUpperCase().includes(name))
          )
        )
        return { ...response, entries, total: entries.length }
      },
    }),
  }),
})

injectQueryApi(vesselSearchApi)

export const { useSearchByOwnerQuery } = vesselSearchApi
