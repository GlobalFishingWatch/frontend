import { ApiAppName, Dataset } from '.'

export type ColorCyclingType = 'fill' | 'line'

export interface DataviewConfig<Type = any> {
  // TODO use any property from layer-composer here?
  type?: Type
  color?: string
  colorCyclingType?: ColorCyclingType
  visible?: boolean
  filters?: Record<string, any>
  dynamicBreaks?: boolean
  maxZoom?: number
  [key: string]: any
}

export interface DataviewDatasetConfigParam {
  id: string
  value: string | number | boolean | string[]
}

export interface DataviewDatasetConfig {
  datasetId: string
  endpoint: string
  params: DataviewDatasetConfigParam[]
  query?: DataviewDatasetConfigParam[]
  metadata?: Record<string, any>
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
  type: 'flag' | 'number' | 'date' | 'fleet' | 'string'
  mandatory?: boolean
  guest?: boolean
}

export interface DataviewInfoConfig {
  fields: DataviewInfoConfigField[]
}

export interface DataviewEventsConfig {
  showIcons: boolean
  showAuthorizationStatus: boolean
  pointsToSegmentsSwitchLevel: boolean
}

export interface IncomatibleFilterConfig {
  id: string // id of the filter
  value: boolean // value to match
  disabled: string[] // disabled filter on matches
}

export interface DataviewFiltersConfig {
  order: string[]
  // Dictionary for datasets filters selection not allowed
  incompatibility: Record<string, IncomatibleFilterConfig[]>
}

export enum DataviewCategory {
  Context = 'context',
  Events = 'events',
  Environment = 'environment',
  Activity = 'activity',
  Detections = 'detections',
  Vessels = 'vessels',
  Comparison = 'comparison',
}

export interface Dataview<Type = any, Category = DataviewCategory> {
  id: number
  slug: string
  name: string
  app: ApiAppName
  description: string
  category?: Category
  createdAt?: string
  updatedAt?: string
  config: DataviewConfig<Type>
  datasets?: Dataset[]
  infoConfig?: DataviewInfoConfig
  eventsConfig?: DataviewEventsConfig
  filtersConfig?: DataviewFiltersConfig
  datasetsConfig?: DataviewDatasetConfig[]
}

export interface DataviewInstance<Type = any>
  extends Partial<Omit<Dataview<Type>, 'id' | 'config'>> {
  id: string
  dataviewId: number
  config?: DataviewConfig<Type>
  datasetsConfig?: DataviewDatasetConfig[]
}
