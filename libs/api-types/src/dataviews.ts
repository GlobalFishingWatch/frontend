import { Locale } from './i18n'
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
  Graticules = 'GRATICULES',
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
  /** FourwingsVisualizationMode = 'hetamap' | 'heatmap-high-res' | 'positions' */
  visualizationMode?: string
  /** Property used when a layer can use white as last step in its color ramp */
  colorRampWhiteEnd?: boolean
  /** Property used when a track layer can use white as the color for its vessel events */
  singleTrack?: boolean
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
  /** String encoded for url from filters Record */
  filter?: string
  /** Record with id filter as key and filters as values */
  filters?: Record<string, any>
  'vessel-groups'?: string[]
  filterOperators?: Record<string, FilterOperator>
  /** Min value for filters in environmental layers to perform frontend data filtering */
  minVisibleValue?: number
  /** Max value for filters in environmental layers to perform frontend data filtering */
  maxVisibleValue?: number
  /** Fourwings dataset without temporal data */
  static?: boolean
  /** Initial breaks for fourwings datasets */
  breaks?: number[]
  locale?: Locale
  dynamicBreaks?: boolean
  maxZoom?: number
  maxZoomCluster?: number
  layers?: DataviewContexLayerConfig[]
  /** Legacy for duplicated events in the API */
  duplicatedEventsWorkaround?: boolean
  /** Stats calculated for environmental layers reports */
  stats?: {
    max: number
    min: number
    mean: number
  }

  /** Used to store the vessel name */
  name?: string
  event?:
    | string
    // Used in VV
    | {
        activeIconsSize?: number
        activeStrokeColor?: string
        strokeColor?: string
        iconsPrefix?: string
        inactiveIconsSize?: number
      }
  pointsToSegmentsSwitchLevel?: number
  showIcons?: boolean
  showAuthorizationStatus?: boolean
  aggregationOperation?: string
  breaksMultiplier?: number

  /** Vessel datasets */
  info?: string
  track?: string
  events?: string[]
  relatedVesselIds?: string[]
  /** Fourwings layers merged, needed for Activity or Detections */
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
