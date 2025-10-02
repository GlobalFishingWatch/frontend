import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { uniqBy } from 'es-toolkit'
import { stringify } from 'qs'

import type { Vessel } from '@/types/vessel.types'
import { GFWAPI } from '@globalfishingwatch/api-client'
import type { APIPagination, Dataset, IdentityVessel } from '@globalfishingwatch/api-types'
import { DatasetTypes, EndpointId } from '@globalfishingwatch/api-types'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'

import type { UserPermissionValues } from './source'

const VESSEL_SEARCH_DATASETS = [
  'public-global-vessel-identity:v3.0',
  // 'public-panama-vessel-identity-fishing:v20211126',
  // 'public-panama-vessel-identity-non-fishing:v20211126', //check if public contains imo or switch to private
]

export const fetchVessels = createServerFn()
  .inputValidator((data: { source: UserPermissionValues }) => data)
  .handler(async ({ data }) => {
    const res = await fetch(`/api/vessels/${data.source}_registry`)
    if (!res.ok) {
      if (res.status === 404) {
        throw notFound()
      }

      throw new Error('Failed to fetch post')
    }

    const vessels = (await res.json()) as Vessel[]
    return vessels
  })

export const getVesselsFromAPI = async ({ id }: { id: string }) => {
  const datasetsResponse = await GFWAPI.fetch<Response>(
    `/datasets?${stringify(
      {
        ids: VESSEL_SEARCH_DATASETS,
        include: 'endpoints',
        cache: false,
        limit: 999999,
        offset: 0,
      },
      { arrayFormat: 'comma' }
    )}`,
    { responseType: 'default' }
  )
  const initialDatasets = (await datasetsResponse.json()) as APIPagination<Dataset>
  const datasets = uniqBy([...initialDatasets.entries], (d) => d.id)

  const datasetConfig = {
    endpoint: EndpointId.VesselSearch,
    datasetId: datasets[0].id,
    params: [],
    query: [
      { id: 'includes', value: ['MATCH_CRITERIA', 'OWNERSHIP'] },
      { id: 'datasets', value: datasets.map((d) => d.id) },
      {
        id: 'where',
        value: encodeURIComponent(`imo=${id}`),
      },
      { id: 'since', value: '' },
    ],
  }
  const url = resolveEndpoint(datasets[0], datasetConfig)

  if (url) {
    const results = await GFWAPI.fetch<APIPagination<IdentityVessel>>(url)

    const vesselWithTracks = results.entries.flatMap((vessel) => {
      const datasetById = datasets.find((d) => d.id === vessel.dataset)
      const trackDatasetId = getRelatedDatasetByType(datasetById, DatasetTypes.Tracks)?.id
      return { track: trackDatasetId ? trackDatasetId : '', ...vessel }
    })

    return vesselWithTracks[0]
  }
}

export const getRelatedDatasetByType = (
  dataset?: Dataset,
  datasetType?: DatasetTypes,
  { fullDatasetAllowed = false } = {}
) => {
  if (fullDatasetAllowed) {
    const fullDataset = dataset?.relatedDatasets?.find(
      (relatedDataset) =>
        relatedDataset.type === datasetType && relatedDataset.id.startsWith('full')
    )
    if (fullDataset) {
      return fullDataset
    }
  }
  return dataset?.relatedDatasets?.find((relatedDataset) => relatedDataset.type === datasetType)
}
