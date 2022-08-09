import { StaticImageData } from 'next/image'
import { useQuery } from 'react-query'
import { Interval } from '@globalfishingwatch/layer-composer'
import PrecipitationImage from 'assets/images/datasets/precipitation.jpg'
import { API_URL } from 'data/config'

const IMAGES_BY_ID = {
  precipitation: PrecipitationImage,
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
    intervals: Interval[]
    min: number
    max: number
    offset: number
    scale: number
  }
}

const getDatasets = async () => {
  try {
    const datasets: APIDataset[] = await fetch(`${API_URL}/datasets`).then((r) => r.json())
    const datasetsWithImages = datasets.map((d) => ({ ...d, image: IMAGES_BY_ID[d.id] }))
    return datasetsWithImages
  } catch (e) {
    console.log(e)
  }
}

export const useAPIDatasets = () => {
  const query = useQuery(['datasets'], getDatasets)
  return query
}
