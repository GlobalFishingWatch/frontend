import { StaticImageData } from 'next/image'
import { AggregationOperation } from '@globalfishingwatch/fourwings-aggregate'
import { Interval } from '@globalfishingwatch/layer-composer'

export type DatasetSource = 'GEE' | 'GFW' | 'LOCAL'
export type DatasetType = '4wings' | 'context'

export type BaseApiDatasetConfig = {
  fileId: string
}

export type ContextApiDatasetConfig = BaseApiDatasetConfig & {
  polygonId: string
}

export type FourwingsApiDatasetConfig = BaseApiDatasetConfig & {
  maxZoom: number
  aggregationOperation: AggregationOperation
  intervals: Interval[]
  min: number
  max: number
  offset: number
  scale: number
  fields: {
    resolution: 'hour'
    lat: 'lat'
    lon: 'lon'
    timestamp: 'timestamp'
    filters: []
  }
}

export type BaseDataset = {
  id: string
  name: string
  description: string
  source: DatasetSource
  type: DatasetType
  image?: StaticImageData
  tags?: string[]
}

export type ContextAPIDataset = BaseDataset & {
  configuration: ContextApiDatasetConfig
}

export type FourwingsAPIDataset = BaseDataset & {
  startDate: string
  endDate: string
  unit: string
  configuration: FourwingsApiDatasetConfig
}

export type APIDataset = ContextAPIDataset | FourwingsAPIDataset

export type ContextAPIDatasetUpdate = Partial<ContextAPIDataset> & {
  configuration: Partial<FourwingsApiDatasetConfig>
}
export type FourwingsAPIDatasetUpdate = Partial<FourwingsAPIDataset> & {
  configuration: Partial<ContextApiDatasetConfig>
}
export type APIDatasetUpdate = ContextAPIDatasetUpdate | FourwingsAPIDatasetUpdate
