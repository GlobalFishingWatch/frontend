import type { StaticImageData } from 'next/image'
import type { AggregationOperation } from '@globalfishingwatch/fourwings-aggregate'
import type { Interval } from '@globalfishingwatch/layer-composer'

export type DatasetSource = 'GEE' | 'GFW' | 'LOCAL'
export type DatasetType = '4wings' | 'context'

export type BaseApiDatasetConfig = {
  fileId: string
}

export type ContextApiDatasetConfig = BaseApiDatasetConfig & {
  polygonId: string
}

export type FourwingsApiDatasetResolution = 'hour' | 'day'
export type FourwingsApiDatasetConfig = BaseApiDatasetConfig & {
  maxZoom: number
  aggregationOperation: AggregationOperation
  intervals: Interval[]
  min: number
  max: number
  offset: number
  scale: number
  fields: {
    value: string
    resolution: FourwingsApiDatasetResolution
    lat: string
    lon: string
    timestamp: string
    filters: string[]
  }
}

export type ImportStatus = 'CREATED' | 'IMPORTING' | 'ERROR' | 'COMPLETED'

export type BaseDataset = {
  id: string
  name: string
  description: string
  source: DatasetSource
  type: DatasetType
  image?: StaticImageData
  status: ImportStatus
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

export type ContextAPIDatasetUpdate = Partial<BaseDataset> & {
  configuration: Partial<ContextApiDatasetConfig>
}
export type FourwingsAPIDatasetUpdate = Partial<BaseDataset> & {
  configuration: Partial<FourwingsApiDatasetConfig>
}
export type APIDatasetUpdate = ContextAPIDatasetUpdate | FourwingsAPIDatasetUpdate
