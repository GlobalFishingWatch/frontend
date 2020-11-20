import { ApiAppName, Dataset } from '.'

export interface DataviewConfig<T = any> {
  // TODO use any property from layer-composer here?
  type?: T
  color?: string
  visible?: boolean
  [key: string]: any
}

export interface DataviewDatasetConfigParams {
  id: string
  value: string | number | boolean | string[]
}

export interface DataviewDatasetConfig {
  datasetId: string
  endpoint: string
  params: DataviewDatasetConfigParams[]
  query?: DataviewDatasetConfigParams[]
}

export interface DataviewCreation<T = any> {
  name: string
  app: ApiAppName
  description: string
  config?: DataviewConfig<T>
  datasetsConfig?: DataviewDatasetConfig[]
}

export interface DataviewInfoConfigField {
  id: string
  type: 'flag' | 'number' | 'date'
}

export interface DataviewInfoConfig {
  fields: DataviewInfoConfigField[]
}

export interface Dataview<T = any> {
  id: number
  name: string
  app: ApiAppName
  description: string
  createdAt?: string
  updatedAt?: string
  config: DataviewConfig<T>
  datasets?: Dataset[]
  infoConfig?: DataviewInfoConfig
  datasetsConfig?: DataviewDatasetConfig[]
}

export interface DataviewInstance<T = any> extends Partial<Omit<Dataview<T>, 'id' | 'config'>> {
  id: string
  dataviewId: number
  config?: DataviewConfig<T>
  datasetsConfig?: DataviewDatasetConfig[]
}
