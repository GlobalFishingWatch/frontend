import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { APIDataset, DatasetSource, DatasetType } from 'features/datasets/datasets.types'
import SeaSurfaceTemperature from 'assets/images/datasets/sea-surface-temperature.jpg'
import SeaSalinity from 'assets/images/datasets/sea-salinity.jpg'
import SeaChlorophyll from 'assets/images/datasets/sea-chlorophyll.jpg'
import AirTemperatureProjectionsMin from 'assets/images/datasets/air-surface-temperature-projections.jpg'
import PrecipitationProjections from 'assets/images/datasets/precipitation-projections.jpg'
import AerosolOpticalThickness from 'assets/images/datasets/aerosol-optical-thickness.jpg'
import ApparentFishingEffort from 'assets/images/datasets/apparent-fishing-effort.jpg'
import FootprintStructure from 'assets/images/datasets/footprint-structure.jpg'
import FootprintLandUse from 'assets/images/datasets/footprint-land-use.jpg'
import FootprintDensity from 'assets/images/datasets/footprint-density.jpg'
import Presence from 'assets/images/datasets/presence.jpg'
import { API_URL } from 'data/config'

const IMAGES_BY_ID = {
  'public-global-water-temperature:v20220801': SeaSurfaceTemperature,
  'public-global-water-salinity:v20220801': SeaSalinity,
  'public-global-chlorophyl:v20220801': SeaChlorophyll,
  'public-global-climate-projections-tasmin:v20220801': AirTemperatureProjectionsMin,
  'public-global-climate-projections-pr:v20220801': PrecipitationProjections,
  'public-global-terra-atmosphere': AerosolOpticalThickness,
  'public-global-fishing-effort:latest': ApparentFishingEffort,
  'public-global-presence:latest': Presence,
  'public-human-footprint-population-density': FootprintDensity,
  'public-human-footprint-land-use': FootprintLandUse,
  'public-human-footprint-infrastructure': FootprintStructure,
}

const getDatasets = async () => {
  const response = await fetch(`${API_URL}/datasets`)
  if (!response.ok) {
    throw new Error('Error fetching datasets')
  }
  const datasets: APIDataset[] = await response.json()
  const datasetsWithImages = datasets.map((d) =>
    IMAGES_BY_ID[d.id] ? { ...d, image: IMAGES_BY_ID[d.id] } : d
  )
  return datasetsWithImages
}

export type ApiDatasetsParams = {
  type?: DatasetType
  source?: DatasetSource
}
export const DATASET_QUERY_ID = 'datasets'
export const useAPIDatasets = ({ type, source }: ApiDatasetsParams = {}) => {
  const [intervalMs, setIntervalMs] = useState(0)
  const query = useQuery<APIDataset[]>([DATASET_QUERY_ID], getDatasets, {
    onSuccess: (datasets) => {
      const hasImportingDatasets = datasets.some((d) => d.status === 'IMPORTING')
      if (hasImportingDatasets) {
        setIntervalMs(5000)
      } else if (intervalMs > 0) {
        setIntervalMs(0)
      }
    },
    select: (datasets) => {
      if (type || source) {
        return datasets.filter((d) => {
          const matchType = type ? d.type === type : true
          const matchSource = source ? d.source === source : true
          return matchType && matchSource
        })
      }
      return datasets
    },
    refetchInterval: intervalMs,
  })
  return query
}

export const useAreAPIDatasetsImporting = () => {
  const { data } = useAPIDatasets()
  const importing = useMemo(() => {
    return (
      data !== undefined && data.some((dataset) => dataset.status && dataset.status === 'IMPORTING')
    )
  }, [data])
  return importing
}

export function useDeleleAPIDataset() {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    async (datasetId: string) => {
      const response = await fetch(`${API_URL}/datasets/${datasetId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Error deleting dataset')
      }
      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([DATASET_QUERY_ID])
      },
    }
  )
  return mutation
}
