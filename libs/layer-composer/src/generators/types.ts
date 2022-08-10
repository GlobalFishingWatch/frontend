import { FeatureCollection, LineString } from 'geojson'
import {
  SourceSpecification,
  LayerSpecification,
  GeoJSONSourceSpecification,
} from '@globalfishingwatch/maplibre-gl'
import { AggregationOperation } from '@globalfishingwatch/fourwings-aggregate'
import { Segment, Locale } from '@globalfishingwatch/api-types'
import { Group } from '..'
import { Interval } from './heatmap/types'

export type LayerVisibility = 'visible' | 'none'

export enum GeneratorType {
  Background = 'BACKGROUND',
  Basemap = 'BASEMAP',
  BasemapLabels = 'BASEMAP_LABELS',
  CartoPolygons = 'CARTO_POLYGONS',
  Context = 'CONTEXT',
  GL = 'GL',
  Heatmap = 'HEATMAP',
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

export interface GeneratorFeature {
  id: string
  layerId: string
  generator: GeneratorType
  isCluster?: boolean
}

export interface GlobalGeneratorConfig {
  start?: string
  end?: string
  zoom?: number
  token?: string
  compareStart?: string
  compareEnd?: string
  locale?: Locale
}

export interface GlobalGeneratorConfigExtended extends GlobalGeneratorConfig {
  zoomLoadLevel: number
  totalHeatmapAnimatedGenerators?: number
}

export type AnyData = FeatureCollection | Segment[] | RawEvent[] | Ruler[] | null

export interface GeneratorLegend {
  type?: string
  label?: string
  unit?: string
  color?: string
}

export interface GeneratorMetadata {
  legend?: GeneratorLegend
  [key: string]: any
}

export interface GeneratorConfig {
  id: string
  data?: AnyData
  type: GeneratorType | string
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
  type: GeneratorType.Basemap
  basemap: BasemapType
}

/**
 * Place labels
 */
export interface BasemapLabelsGeneratorConfig extends GeneratorConfig {
  type: GeneratorType.BasemapLabels
  locale?: Locale
}
/**
 * A solid color background layer
 */
export interface BackgroundGeneratorConfig extends GeneratorConfig {
  type: GeneratorType.Background
  /**
   * Sets the color of the map background in any format supported by Mapbox GL, see https://docs.mapbox.com/mapbox-gl-js/style-spec/types/#color
   */
  color?: string
}

/**
 * Layers created by user uploading their own shapefile
 */
export interface UserContextGeneratorConfig extends GeneratorConfig {
  type: GeneratorType.UserContext
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
}

/**
 * Contextual layers provided by GFW
 */
export interface ContextGeneratorConfig extends GeneratorConfig {
  type: GeneratorType.Context
  /**
   * Id for the layers dictionary, see CONTEXT_LAYERS from /generators/context/context-layers
   */
  layer: ContextLayerType
  /**
   * Id for API dataset in case you need to fetch geometries by gfw_id
   */
  datasetId?: string
  /**
   * Url to grab the tiles from, internally using https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-tiles
   */
  tilesUrl: string
  /**
   * Sets the color of the line https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#paint-fill-fill-color
   */
  color?: string
}

export type TileClusterEventType = 'encounter' | 'loitering' | 'port'
/**
 * Layers created by user uploading their own shapefile
 */
export interface TileClusterGeneratorConfig extends GeneratorConfig {
  type: 'TILE_CLUSTER'
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
}

/**
 * Placeholder for a generic set of Mapbox GL layers (consisting of one or more sources and one or mor layers)
 */
export interface GlGeneratorConfig extends GeneratorConfig {
  id: string
  type: GeneratorType.GL
  sources?: SourceSpecification[]
  layers?: LayerSpecification[]
}

/**
 * Renders outlined polygons for our CARTO tables library, typically context layers. Takes care of instanciating CARTO anonymous maps/layergroupid (hence asynchronous). cartoTableId should be provided but will fallback to base generator id in case it's not.
 */
export interface CartoPolygonsGeneratorConfig extends GeneratorConfig {
  type: GeneratorType.CartoPolygons
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
  | Segment[]
  | null

/**
 * Renders a vessel track that can be filtered by time. Will use `start` and `end` from the global generator config, if set
 */
export interface TrackGeneratorConfig extends GeneratorConfig {
  type: GeneratorType.Track
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
}

export interface PolygonsGeneratorConfig extends GeneratorConfig {
  type: GeneratorType.Polygons
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
}

export interface VesselEventsGeneratorConfig extends GeneratorConfig {
  type: GeneratorType.VesselEvents
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
  type: GeneratorType.VesselEventsShapes
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
  type: GeneratorType.Rulers
  /**
   * An array defining rulers with start and end coordinates, and an isNew flag
   */
  data: Ruler[]
}

export interface HeatmapGeneratorConfig extends GeneratorConfig {
  type: GeneratorType.Heatmap
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

export interface HeatmapAnimatedGeneratorConfig extends GeneratorConfig {
  type: GeneratorType.HeatmapAnimated
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
}

export type AnyGeneratorConfig =
  | BackgroundGeneratorConfig
  | BasemapGeneratorConfig
  | BasemapLabelsGeneratorConfig
  | CartoPolygonsGeneratorConfig
  | ContextGeneratorConfig
  | GlGeneratorConfig
  | HeatmapAnimatedGeneratorConfig
  | HeatmapGeneratorConfig
  | PolygonsGeneratorConfig
  | RulersGeneratorConfig
  | TileClusterGeneratorConfig
  | TrackGeneratorConfig
  | UserContextGeneratorConfig
  | VesselEventsGeneratorConfig

// ---- Generator specific types
export enum BasemapType {
  Satellite = 'satellite',
  Default = 'basemap_default',
  Labels = 'basemap_labels',
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
  type: string
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
}

export type AuthorizationOptions = 'authorized' | 'partially' | 'unmatched'

export type Ruler = {
  start: {
    latitude: number
    longitude: number
  }
  end: {
    latitude: number
    longitude: number
  }
  isNew?: boolean
}

export type HeatmapAnimatedInteractionType = 'activity' | 'detections'

export interface HeatmapAnimatedGeneratorSublayer {
  id: string
  datasets: string[]
  filter?: string
  vesselGroups?: string
  colorRamp: ColorRampsIds
  colorRampWhiteEnd?: boolean
  visible?: boolean
  breaks?: number[]
  legend?: GeneratorLegend
  interactionType?: HeatmapAnimatedInteractionType
  availableIntervals?: Interval[]
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
