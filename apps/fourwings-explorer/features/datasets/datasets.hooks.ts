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
  const datasets: APIDataset[] = await fetch(`${API_URL}/datasets`).then((r) => r.json())
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
  const query = useQuery<APIDataset[]>([DATASET_QUERY_ID], getDatasets, {
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
  })
  return query
}
