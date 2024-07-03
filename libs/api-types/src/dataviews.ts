import { ApiAppName } from './workspaces'
import { Dataset } from './datasets'

export type ColorCyclingType = 'fill' | 'line'
export const INCLUDE_FILTER_ID = 'include'
export const EXCLUDE_FILTER_ID = 'exclude'
export type FilterOperator = typeof INCLUDE_FILTER_ID | typeof EXCLUDE_FILTER_ID

export interface DataviewContexLayerConfig {
  id: string
  dataset: string
}

export interface DataviewConfig<Type = any> {
  // TODO use any property from layer-composer here?
  type?: Type
  color?: string
  colorCyclingType?: ColorCyclingType
  visible?: boolean
  filters?: Record<string, any>
  filterOperators?: Record<string, FilterOperator>
  dynamicBreaks?: boolean
  maxZoom?: number
  layers?: DataviewContexLayerConfig[]
  /** Vessel datasets */
  info?: string
  track?: string
  events?: string[]
  includeWithoutEndDate?: boolean
  /*****************/
  [key: string]: any
}

export interface DataviewDatasetConfigParam {
  id: string
  value: string | number | boolean | string[] | number[]
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
  value: boolean | string // value to match
  disabled: string[] // disabled filter on matches
}

export interface DataviewFiltersConfig {
  order: string[]
  // Dictionary for datasets filters selection not allowed
  incompatibility: Record<string, IncomatibleFilterConfig[]>
}

export enum DataviewCategory {
  Activity = 'activity',
  Comparison = 'comparison',
  Context = 'context',
  Detections = 'detections',
  Environment = 'environment',
  Events = 'events',
  User = 'user',
  Vessels = 'vessels',
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
  dataviewId: Dataview['id'] | Dataview['slug']
  config?: DataviewConfig<Type>
  datasetsConfig?: DataviewDatasetConfig[]
}
