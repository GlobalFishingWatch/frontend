import { StaticImageData } from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { Interval } from '@globalfishingwatch/layer-composer'
import { AggregationOperation } from '@globalfishingwatch/fourwings-aggregate'
import PrecipitationImage from 'assets/images/datasets/precipitation.jpg'
import { API_URL } from 'data/config'

const IMAGES_BY_ID = {
  'public-global-water-temperature:v20220801': PrecipitationImage,
  'public-global-water-salinity:v20220801': PrecipitationImage,
  'public-global-chlorophyl:v20220801': PrecipitationImage,
}

export type DatasetSource = 'GEE' | 'GFW' | 'LOCAL'
export type DatasetType = '4wings' | 'context'

export type APIDataset = {
  id: string
  name: string
  description: string
  source: DatasetSource
  type: DatasetType
  startDate: string
  endDate: string
  unit: string
  image?: StaticImageData
  tags?: string[]
  configuration: {
    aggregationOperation: AggregationOperation
    intervals: Interval[]
    min: number
    max: number
    offset: number
    scale: number
  }
}

const getDatasets = async () => {
  const datasets: APIDataset[] = await fetch(`${API_URL}/datasets`).then((r) => r.json())
  const datasetsWithImages = datasets.map((d) => ({ ...d, image: IMAGES_BY_ID[d.id] }))
  return datasetsWithImages
}

export const useAPIDatasets = () => {
  const query = useQuery<APIDataset[]>(['datasets'], getDatasets)
  return query
}
