import type { FeatureCollection, LineString } from 'geojson'

import type {
  Anchorage,
  EventTypes,
  Locale,
  TimeFilterType,
  TrackSegment,
} from '@globalfishingwatch/api-types'
import { DataviewType } from '@globalfishingwatch/api-types'
import type { AggregationOperation } from '@globalfishingwatch/fourwings-aggregate'
import type {
  GeoJSONSourceSpecification,
  LayerSpecification,
  SourceSpecification,
} from '@globalfishingwatch/maplibre-gl'

import type { GeneratorType, Group } from '..'

import type { Interval } from './heatmap/types'

export type LayerVisibility = 'visible' | 'none'

export interface GeneratorFeature {
  id: string
  layerId: string
  generator: DataviewType
  isCluster?: boolean
}

export { DataviewType as GeneratorType }

export interface GlobalGeneratorConfig {
  start?: string
  end?: string
  zoom?: number
  token?: string
  compareStart?: string
  compareEnd?: string
  locale?: Locale
  visibleEvents?: EventTypes[]
  bivariateDataviews?: [string, string]
}

export interface GlobalGeneratorConfigExtended extends GlobalGeneratorConfig {
  zoomLoadLevel: number
  totalHeatmapAnimatedGenerators?: number
}

export type AnyData =
  | FeatureCollection
  | TrackSegment[]
  | RawEvent[]
  | Ruler[]
  | MapAnnotation[]
  | null

export interface GeneratorLegend {
  type?: string
  label?: string
  unit?: string
  color?: string
}

export interface GeneratorMetadata {
  legend?: GeneratorLegend
  interactive?: boolean
  [key: string]: any
}

export interface GeneratorConfig {
  id: string
  data?: AnyData
  type: DataviewType | string
  visible?: boolean
  color?: string
  opacity?: number
  metadata?: GeneratorMetadata
  attribution?: string
}

/**
 * This is the union of GeneratorConfig <T> with GlobalGeneratorConfig, which allows access to both
 * generator config params and global config params, at the generator level
 */
export type MergedGeneratorConfig<T> = T & GlobalGeneratorConfigExtended

/**
 * A default or satellite basemap
 */
export interface BasemapGeneratorConfig extends GeneratorConfig {
  type: DataviewType.Basemap
  basemap: BasemapType
}

/**
 * Place labels
 */
export interface BasemapLabelsGeneratorConfig extends GeneratorConfig {
  type: DataviewType.BasemapLabels
  locale?: Locale
}
/**
 * A solid color background layer
 */
export interface BackgroundGeneratorConfig extends GeneratorConfig {
  type: DataviewType.Background
  /**
   * Sets the color of the map background in any format supported by Mapbox GL, see https://docs.mapbox.com/mapbox-gl-js/style-spec/types/#color
   */
  color?: string
}

/**
 * Layers created by user uploading their own shapefile
 */
export interface UserContextGeneratorConfig extends GeneratorConfig {
  type: DataviewType.UserContext
  /**
   * Sets the color of the line https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#paint-fill-fill-color
   */
  color?: string
  /**
   * Sets the color of the line https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#paint-fill-fill-color
   */
  colorRamp?: ColorRampsIds
  /**
   * Url to grab the tiles from, internally using https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-tiles
   */
  tilesUrl: string
  /**
   * Id for API dataset in case you need to fetch geometries by gfw_id
   */
  datasetId?: string
  /**
   * SQL filter to apply to the dataset
   */
  filter?: string
  /**
   * Maximum zoom level for which tiles are available https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-maxzoom
   */
  maxzoom: number
  /**
   * Custom color ramp for filled layers
   */
  steps?: number[]
  /**
   * Property to get value to display the ramp
   */
  pickValueAt?: string
  /**
   * Disable interaction (needed when user uploaded a non-polygon layer)
   */
  disableInteraction?: boolean
  /**
   * Properties added to generated url search params
   * These properties would be available on the tile features
   */
  valueProperties?: string[]
  /**
   * Property to use as id internally in mapbox
   */
  promoteId?: string
  /**
   * Filter features by date or by dateRange
   */
  timeFilterType?: TimeFilterType
  /**
   * Feature property to drive timestamps filtering
   */
  startTimeFilterProperty?: string
  /**
   * Feature property to drive timestamps filtering
   */
  endTimeFilterProperty?: string
}

/**
 * Layers created by user uploading their own shapefile
 */
export interface UserPointsGeneratorConfig extends GeneratorConfig {
  type: DataviewType.UserPoints
  /**
   * Sets the color of the line https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#paint-fill-fill-color
   */
  color?: string
  /**
   * Url to grab the tiles from, internally using https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-tiles
   */
  tilesUrl: string
  /**
   * Id for API dataset in case you need to fetch geometries by gfw_id
   */
  datasetId?: string
  /**
   * Property to use as id internally in mapbox
   */
  promoteId?: string
  /**
   * SQL filter to apply to the dataset
   */
  filter?: string
  /**
   * Filters object without parse
   */
  filters?: Record<string, any>
  /**
   * Feature property to drive circle radius
   */
  circleRadiusProperty?: string
  /**
   * min max values of the circleRadiusProperty
   * circle radius linear interpolation will be based on this range
   */
  circleRadiusRange?: number[]
  /**
   * min point size of the values range lower end
   */
  minPointSize?: number
  /**
   * man point size of the values range higher end
   */
  maxPointSize?: number
  /**
   * Property to get value to display the ramp
   */
  pickValueAt?: string
  /**
   * Disable interaction (needed when user uploaded a non-polygon layer)
   */
  disableInteraction?: boolean
  /**
   * Properties added to generated url search params
   * These properties would be available on the tile features
   */
  valueProperties?: string[]
  /**
   * Maximum zoom level for which tiles are available https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-maxzoom
   */
  maxzoom: number
  /**
   * Filter features by date or by dateRange
   */
  timeFilterType?: TimeFilterType
  /**
   * Include features that don't contain and endDate property
   * filtering by dateRange assumes that the feature is still active
   */
  includeWithoutEndDate?: boolean
  /**
   * Feature property to drive timestamps filtering
   */
  startTimeFilterProperty?: string
  /**
   * Feature property to drive timestamps filtering
   */
  endTimeFilterProperty?: string
}

export type GlobalUserPointsGeneratorConfig = Required<
  MergedGeneratorConfig<UserPointsGeneratorConfig>
>

/**
 * Contextual layers provided by GFW
 */
export interface ContextGeneratorConfig extends GeneratorConfig {
  type: DataviewType.Context
  /**
   * Id for the layers dictionary, see CONTEXT_LAYERS from /generators/context/context-layers
   */
  layer: ContextLayerType
  /**
   * Id for API dataset in case you need to fetch geometries by gfw_id
   */
  datasetId?: string
  /**
   * Property to use as id internally in mapbox
   */
  promoteId?: string
  /**
   * Properties to be used as value
   */
  valueProperties?: string[]
  /**
   * Url to grab the tiles from, internally using https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-tiles
   */
  tilesUrl: string
  /**
   * Maximum zoom level for which tiles are available https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-maxzoom
   */
  maxzoom: number
  /**
   * Sets the color of the line https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#paint-fill-fill-color
   */
  color?: string
  /**
   * Filter the polygons displayed https://docs.mapbox.com/help/glossary/filter/
   */
  filters?: Record<string, string[]>
}

export type GlobalUserContextGeneratorConfig = Required<
  MergedGeneratorConfig<UserContextGeneratorConfig>
>

export type TileClusterEventType = 'encounter' | 'loitering' | 'port'
/**
 * Layers created by user uploading their own shapefile
 */
export interface TileClusterGeneratorConfig extends GeneratorConfig {
  type: 'TILE_CLUSTER'
  /**
   * Defines the 3 steps for the circle radius
   */
  breaks?: number[]
  /**
   * Defines the maximum zoom that returns clusters
   */
  maxZoomCluster?: number
  /**
   * Sets the color of the line https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#paint-fill-fill-color
   */
  color?: string
  /**
   * Url to grab the tiles from, internally using https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-tiles
   */
  tilesUrl: string
  /**
   * List of types supported by the API, optional to allow using resolved url params directly (eg: using resolve-endpoints)
   */
  eventTypes?: TileClusterEventType | TileClusterEventType[]
  /**
   * List of datasets to retrieve the data from, optional to allow using resolved url params directly (eg: using resolve-endpoints)
   */
  dataset?: string
  /**
   * Uses a workaround when having duplicated events to show only 1 event
   */
  duplicatedEventsWorkaround?: boolean
  /**
   * Event id to highlight on active
   */
  currentEventId?: string
  /**
   * Filter the points
   */
  filters?: Record<string, any>
}

/**
 * Placeholder for a generic set of Mapbox GL layers (consisting of one or more sources and one or mor layers)
 */
export interface GlGeneratorConfig extends GeneratorConfig {
  id: string
  type: DataviewType.GL
  sources?: SourceSpecification[]
  layers?: LayerSpecification[]
}

/**
 * Renders outlined polygons for our CARTO tables library, typically context layers. Takes care of instanciating CARTO anonymous maps/layergroupid (hence asynchronous). cartoTableId should be provided but will fallback to base generator id in case it's not.
 */
export interface CartoPolygonsGeneratorConfig extends GeneratorConfig {
  type: DataviewType.CartoPolygons
  cartoTableId?: string
  baseUrl?: string
  selectedFeatures?: any
  color?: string
  fillColor?: any
  strokeColor?: string
  strokeWidth?: number
  radius?: number
}

export type TrackGeneratorConfigData =
  | FeatureCollection<LineString, { coordinateProperties: { times: number[] } }>
  | TrackSegment[]
  | null

/**
 * Renders a vessel track that can be filtered by time. Will use `start` and `end` from the global generator config, if set
 */
export interface TrackGeneratorConfig extends GeneratorConfig {
  type: DataviewType.Track
  /**
   * A GeoJSON made of one or more LineStrings. Features should have `coordinateProperties` set in order to filter by time
   */
  data: TrackGeneratorConfigData
  /**
   * Progresseively simplify geometries when zooming out for improved performance
   */
  simplify?: boolean
  /**
   * Sets the color of the map background in any format supported by Mapbox GL, see https://docs.mapbox.com/mapbox-gl-js/style-spec/types/#color
   */
  color?: string
  useOwnColor?: boolean
  /**
   * Sets the opacity for the track line
   */
  opacity?: number
  /**
   * Sets a portion of the track to highlight visually
   */
  highlightedTime?: {
    start: string
    end: string
  }
  /**
   * Sets a portion of the track to highlight visually
   */
  highlightedEvent?: {
    start: string
    end: string
  }
  /**
   * Filter the tracks displayed https://docs.mapbox.com/help/glossary/filter/
   */
  filters?: Record<string, (string | number)[]>
  /**
   * Filter segment points by its coordinateProperties
   */
  coordinateFilters?: Record<string, (string | number)[]>
  /**
   * Property to use as id internally in mapbox
   */
  promoteId?: string
}

export interface PolygonsGeneratorConfig extends GeneratorConfig {
  type: DataviewType.Polygons
  /**
   * A GeoJSON feature collection
   */
  data?: FeatureCollection
  /**
   * The url to grab the geojson
   */
  url?: string
  /**
   * Sets the color of the map background in any format supported by Mapbox GL, see https://docs.mapbox.com/mapbox-gl-js/style-spec/types/#color
   */
  color?: string
  /**
   * Sets the opacity for the track line
   */
  opacity?: number
  /**
   * Sets the ordering group the polygons belong to
   */
  group?: Group
}

export interface VesselEventsGeneratorConfig extends GeneratorConfig {
  type: DataviewType.VesselEvents
  data: RawEvent[]
  color?: string
  event?: {
    activeIconsSize?: number
    activeStrokeColor?: string
    iconsPrefix?: string
    iconsSize?: number
    inactiveIconsSize?: number
    strokeColor?: string
  }
  track?: TrackGeneratorConfigData
  showIcons?: boolean
  showAuthorizationStatus?: boolean
  currentEventId?: string
  pointsToSegmentsSwitchLevel?: number
}

export interface VesselEventsShapesGeneratorConfig extends GeneratorConfig {
  type: DataviewType.VesselEventsShapes
  data: RawEvent[]
  color?: string
  track?: TrackGeneratorConfigData
  showAuthorizationStatus?: boolean
  currentEventsIds?: string[]
  pointsToSegmentsSwitchLevel?: number
  vesselId?: string
}

/**
 * Renders rulers showing a distance between two points, using great circle if needed
 */
export interface RulersGeneratorConfig extends GeneratorConfig {
  type: DataviewType.Rulers
  /**
   * An array defining rulers with start and end coordinates
   */
  data: Ruler[]
}

/**
 * Renders map text annotations
 */
export interface AnnotationsGeneratorConfig extends GeneratorConfig {
  type: DataviewType.Annotation
  /**
   * An array defining annotations with label, color and start and end coordinates
   */
  data: MapAnnotation[]
}

export interface HeatmapGeneratorConfig extends GeneratorConfig {
  type: DataviewType.Heatmap
  // Types needed but already in GlobalGeneratorConfig
  // start: string
  // end: string
  // zoom: number
  maxZoom?: number
  numBreaks?: number
  breaks?: number[]
  tilesUrl: string
  static?: boolean
  statsUrl?: string
  scalePowExponent?: number
  datasets: string[]
  fetchStats?: boolean
  filters?: string
  statsFilter?: string
  colorRamp?: ColorRampsIds
}

export interface HeatmapStaticGeneratorConfig extends GeneratorConfig {
  type: DataviewType.HeatmapStatic
  tilesAPI?: string
  maxZoom?: number
  numBreaks?: number
  breaks?: number[]
  breaksMultiplier?: number
  datasets: string[]
  group?: Group
  filters?: string
  colorRamp?: ColorRampsIds
  interactive?: boolean
  aggregationOperation?: AggregationOperation
  minVisibleValue?: number
  maxVisibleValue?: number
}

export interface HeatmapAnimatedGeneratorConfig extends GeneratorConfig {
  type: DataviewType.HeatmapAnimated
  sublayers: HeatmapAnimatedGeneratorSublayer[]
  mode?: HeatmapAnimatedMode
  group?: Group
  tilesAPI?: string
  breaksAPI?: string
  dynamicBreaks?: boolean
  updateDebounce?: boolean
  maxZoom?: number
  debug?: boolean
  debugLabels?: boolean
  datasetsStart?: string
  datasetsEnd?: string
  interactive?: boolean
  /**
   * Defines a supported list of intervals in an Array format
   */
  availableIntervals?: Interval[]
  aggregationOperation?: AggregationOperation
  breaksMultiplier?: number
  minVisibleValue?: number
  maxVisibleValue?: number
}

/**
 * Renders vessel position arrows that can be filtered by time and colored by speed or rules
 */
export interface VesselPositionsGeneratorConfig extends GeneratorConfig {
  type: GeneratorType.VesselPositions
  /**
   * A GeoJSON feature collection containing vessel positions with course property
   */
  data: FeatureCollection
  /**
   * Color mode to determine how arrows are colored
   */
  colorMode?: 'all' | 'content' | 'labels'
  /**
   * Colors to apply based on rules
   */
  ruleColors?: any[]
  /**
   * Colors to apply based on project settings
   */
  projectColors?: Record<string, string>
  highlightedTime?: {
    start: string
    end: string
  }
  hiddenLabels?: string[]
}

export type AnyGeneratorConfig =
  | AnnotationsGeneratorConfig
  | BackgroundGeneratorConfig
  | BasemapGeneratorConfig
  | BasemapLabelsGeneratorConfig
  | CartoPolygonsGeneratorConfig
  | ContextGeneratorConfig
  | GlGeneratorConfig
  | HeatmapStaticGeneratorConfig
  | HeatmapAnimatedGeneratorConfig
  | HeatmapGeneratorConfig
  | PolygonsGeneratorConfig
  | RulersGeneratorConfig
  | TileClusterGeneratorConfig
  | TrackGeneratorConfig
  | UserContextGeneratorConfig
  | VesselEventsGeneratorConfig
  | VesselEventsShapesGeneratorConfig
  | VesselPositionsGeneratorConfig

// ---- Generator specific types
export enum BasemapType {
  Satellite = 'satellite',
  Default = 'basemap_default',
  Labels = 'basemap_labels',
  Bathymetry = 'bathymetry',
}

// ---- Generator specific types
export enum ContextLayerType {
  EEZ = 'eez-areas',
  HighSeas = 'high-seas',
  EEZBoundaries = 'eez-boundaries',
  MPA = 'mpa',
  MPANoTake = 'mpa-no-take',
  MPARestricted = 'mpa-restricted',
  TunaRfmo = 'tuna-rfmo',
  WPPNRI = 'wpp-nri',
  Graticules = 'graticules',
  FAO = 'fao',
  ProtectedSeas = 'protected-seas',
}

export type RawEvent = {
  id: string
  type: EventTypes
  position: {
    lng?: number
    lon?: number
    lat: number
  }
  start: number
  end: number
  highlight?: boolean
  vessel?: {
    id: string
    name: string
  }
  encounter?: {
    authorized: boolean
    authorizationStatus: AuthorizationOptions
    vessel: {
      id: string
      name: string
    }
  }
  port_visit?: {
    intermediateAnchorage: Anchorage
  }
}

export type AuthorizationOptions = 'authorized' | 'partially' | 'unmatched'

export type Ruler = {
  id: number
  start: {
    latitude: number
    longitude: number
  }
  end: {
    latitude: number
    longitude: number
  }
  isNew: boolean
}

export type MapAnnotation = {
  id: number
  lon: number | string
  lat: number | string
  label: string
  color?: string
}

export type HeatmapAnimatedInteractionType = 'activity' | 'detections'

export interface HeatmapAnimatedGeneratorSublayer {
  id: string
  datasets: string[]
  attribution?: string
  filter?: string
  vesselGroups?: string
  colorRamp: ColorRampsIds
  colorRampWhiteEnd?: boolean
  visible?: boolean
  breaks?: number[]
  legend?: GeneratorLegend
  interactionType?: HeatmapAnimatedInteractionType
  availableIntervals?: Interval[]
  metadata?: GeneratorMetadata
}

// ---- Heatmap Generator color ramps types
export type ColorRampId =
  | 'teal'
  | 'magenta'
  | 'lilac'
  | 'salmon'
  | 'sky'
  | 'red'
  | 'yellow'
  | 'green'
  | 'orange'
  | 'bathymetry' // Custom one for the bathymetry dataset

export type ColorRampWhiteId =
  | 'teal_toWhite'
  | 'magenta_toWhite'
  | 'lilac_toWhite'
  | 'salmon_toWhite'
  | 'sky_toWhite'
  | 'red_toWhite'
  | 'yellow_toWhite'
  | 'green_toWhite'
  | 'orange_toWhite'
  | 'bathymetry_toWhite'

export type ColorRampsIds = ColorRampId | ColorRampWhiteId

export enum HeatmapAnimatedMode {
  // Pick sublayer with highest value and place across this sublayer's color ramp. Works with 0 - n sublayers
  Compare = 'compare',
  // Place values on a 2D bivariate scale where the two axis represent the two sublayers. Works only with 2 sublayers
  Bivariate = 'bivariate',
  // Compare between two time periods. Applies to all visible activity layers.
  TimeCompare = 'timeCompare',
  // Uses a MGL heatmap layer to represent values with smooth translations between grid points. Works only with 1 sublayer
  Blob = 'blob',
  // Represents value in 3D stacked bars. Works with 0 - n sublayers
  Extruded = 'extruded',
  // Just show raw value ffor 1 sublayer
  Single = 'single',
}
export interface VesselsEventsSource extends GeoJSONSourceSpecification {
  id: string
}

export type ColorBarOption = {
  id: string
  value: string
}
