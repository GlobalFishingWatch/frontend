import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { APIDataset, DatasetSource, DatasetType } from 'features/datasets/datasets.types'
import PrecipitationImage from 'assets/images/datasets/precipitation.jpg'
import { API_URL } from 'data/config'

const IMAGES_BY_ID = {
  'public-global-water-temperature:v20220801': PrecipitationImage,
  'public-global-water-salinity:v20220801': PrecipitationImage,
  'public-global-chlorophyl:v20220801': PrecipitationImage,
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
