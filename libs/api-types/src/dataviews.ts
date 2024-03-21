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

export enum DataviewType {
  Annotation = 'ANNOTATION',
  Background = 'BACKGROUND',
  Basemap = 'BASEMAP',
  BasemapLabels = 'BASEMAP_LABELS',
  CartoPolygons = 'CARTO_POLYGONS',
  Context = 'CONTEXT',
  GL = 'GL',
  Heatmap = 'HEATMAP',
  HeatmapStatic = 'HEATMAP_STATIC',
  HeatmapAnimated = 'HEATMAP_ANIMATED',
  Polygons = 'POLYGONS',
  Rulers = 'RULERS',
  TileCluster = 'TILE_CLUSTER',
  Track = 'TRACK',
  UserContext = 'USER_CONTEXT',
  UserPoints = 'USER_POINTS',
  VesselEvents = 'VESSEL_EVENTS',
  VesselEventsShapes = 'VESSEL_EVENTS_SHAPES',
}

export type DataviewSublayerConfig = {
  id: string
  datasets: Dataset[]
  color?: string
  colorRamp?: string
  visible?: boolean
  filter?: DataviewConfig['filter']
  filters?: DataviewConfig['filters']
  vesselGroups?: DataviewConfig['vessel-groups']
  maxZoom?: number
  legend?: {
    label: string
    unit: string
    color: string
  }
}

export interface DataviewConfig<Type = DataviewType> {
  /** Type to define what kind of layer to render, ex: fourwings, context, draw... */
  type?: Type
  /** Used in activity or detections layers to define which layers are active in all the options available */
  datasets?: string[]
  color?: string
  colorRamp?: string
  colorCyclingType?: ColorCyclingType
  /** Fourwings modes: 'compare' | 'bivariate' */
  comparisonMode?: string
  /** Fourwings visualizations: 'heatmap' | 'positions' */
  visualizationMode?: string
  /** Property used when a layer can use white as last step in its color ramp */
  colorRampWhiteEnd?: boolean
  auxiliarLayerActive?: boolean
  debug?: boolean
  visible?: boolean
  /** Used to limit the available FourwingsIntervals */
  interval?: string
  intervals?: string[]
  /** Basemap for deck layers, see libs/deck-layers/src/layers/basemap/BasemapLayer.ts */
  basemap?: string
  /** LayerGroup for deck layers z-index, see libs/deck-layers/src/utils/sort.ts */
  group?: string
  /** String decoded for url from filters Record */
  filter?: string // filters as url decoded ready to use
  filters?: Record<string, any>
  'vessel-groups'?: string[]
  filterOperators?: Record<string, FilterOperator>
  dynamicBreaks?: boolean
  maxZoom?: number
  layers?: DataviewContexLayerConfig[]
  /** Vessel datasets */
  info?: string
  track?: string
  events?: string[]
  sublayers?: DataviewSublayerConfig[]
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
