import { FeatureCollection } from 'geojson'
import { StringUnitLength } from 'luxon'
import { AnySourceData, Layer } from '@globalfishingwatch/mapbox-gl'
import { Segment } from '@globalfishingwatch/data-transforms'
import { AggregationOperation } from '@globalfishingwatch/fourwings-aggregate'
import { Interval } from './heatmap/util/time-chunks'

export enum Type {
  Background = 'BACKGROUND',
  UserContext = 'USER_CONTEXT',
  TileCluster = 'TILE_CLUSTER',
  Context = 'CONTEXT',
  Basemap = 'BASEMAP',
  CartoPolygons = 'CARTO_POLYGONS',
  GL = 'GL',
  Heatmap = 'HEATMAP',
  HeatmapAnimated = 'HEATMAP_ANIMATED',
  Track = 'TRACK',
  VesselEvents = 'VESSEL_EVENTS',
  Rulers = 'RULERS',
}

export interface GeneratorFeature {
  id: string
  layerId: string
  generator: Type
  isCluster?: boolean
}

export interface GlobalGeneratorConfig {
  start?: string
  end?: string
  zoom?: number
  token?: string
}

export interface GlobalGeneratorConfigExtended extends GlobalGeneratorConfig {
  zoomLoadLevel: number
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
  type: Type | string
  visible?: boolean
  opacity?: number
  metadata?: GeneratorMetadata
}

/**
 * This is the union of GeneratorConfig <T> with GlobalGeneratorConfig, which allows access to both
 * generator config params and global config params, at the generator level
 */
export type MergedGeneratorConfig<T> = T & GlobalGeneratorConfigExtended

/**
 * A solid color background layer
 */
export interface BasemapGeneratorConfig extends GeneratorConfig {
  type: Type.Basemap
  /**
   * Sets the color of the map background in any format supported by Mapbox GL, see https://docs.mapbox.com/mapbox-gl-js/style-spec/types/#color
   */
  basemap: BasemapType
}

/**
 * A solid color background layer
 */
export interface BackgroundGeneratorConfig extends GeneratorConfig {
  type: Type.Background
  /**
   * Sets the color of the map background in any format supported by Mapbox GL, see https://docs.mapbox.com/mapbox-gl-js/style-spec/types/#color
   */
  color?: string
}

/**
 * Layers created by user uploading their own shapefile
 */
export interface UserContextGeneratorConfig extends GeneratorConfig {
  type: Type.UserContext
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
  type: Type.Context
  /**
   * Id for the layers dictionary, see CONTEXT_LAYERS from /generators/context/context-layers
   */
  layer: ContextLayerType
  /**
   * Contains the attribution to be displayed when the map is showing the layer.
   */
  attribution?: string
  /**
   * Url to grab the tiles from, internally using https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-tiles
   */
  tilesUrl: string
  /**
   * Sets the color of the line https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#paint-fill-fill-color
   */
  color?: StringUnitLength
}

export type TileClusterEventType = 'encounter' | 'loitering' | 'port'
/**
 * Layers created by user uploading their own shapefile
 */
export interface TileClusterGeneratorConfig extends GeneratorConfig {
  type: Type.TileCluster
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
  type: Type.GL
  sources?: AnySourceData[]
  layers?: Layer[]
}

/**
 * Renders outlined polygons for our CARTO tables library, typically context layers. Takes care of instanciating CARTO anonymous maps/layergroupid (hence asynchronous). cartoTableId should be provided but will fallback to base generator id in case it's not.
 */
export interface CartoPolygonsGeneratorConfig extends GeneratorConfig {
  type: Type.CartoPolygons
  cartoTableId?: string
  baseUrl?: string
  selectedFeatures?: any
  color?: string
  fillColor?: any
  strokeColor?: string
  strokeWidth?: number
  radius?: number
}

export type TrackGeneratorConfigData = FeatureCollection | Segment[] | null

/**
 * Renders a vessel track that can be filtered by time. Will use `start` and `end` from the global generator config, if set
 */
export interface TrackGeneratorConfig extends GeneratorConfig {
  type: Type.Track
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

export interface VesselEventsGeneratorConfig extends GeneratorConfig {
  type: Type.VesselEvents
  data: RawEvent[]
  color?: string
  event?: {
    activeIconsSize?: number
    activeStrokeColor?: string
    iconsSize?: number
    strokeColor?: string
  }
  track?: TrackGeneratorConfigData
  showIcons?: boolean
  showAuthorizationStatus?: boolean
  currentEventId?: string
  pointsToSegmentsSwitchLevel?: number
}

/**
 * Renders rulers showing a distance between two points, using great circle if needed
 */
export interface RulersGeneratorConfig extends GeneratorConfig {
  type: Type.Rulers
  /**
   * An array defining rulers with start and end coordinates, and an isNew flag
   */
  data: Ruler[]
}

export interface HeatmapGeneratorConfig extends GeneratorConfig {
  type: Type.Heatmap
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
  type: Type.HeatmapAnimated
  sublayers: HeatmapAnimatedGeneratorSublayer[]
  mode?: HeatmapAnimatedMode
  tilesAPI?: string
  breaksAPI?: string
  maxZoom?: number
  debug?: boolean
  debugLabels?: boolean
  datasetsStart?: string
  datasetsEnd?: string
  interactive?: boolean
  /**
   * Defines a fixed or a supported list of intervals in an Array format
   */
  interval?: Interval | Interval[]
  aggregationOperation?: AggregationOperation
  breaksMultiplier?: number
}

export type AnyGeneratorConfig =
  | BackgroundGeneratorConfig
  | BasemapGeneratorConfig
  | GlGeneratorConfig
  | CartoPolygonsGeneratorConfig
  | UserContextGeneratorConfig
  | ContextGeneratorConfig
  | TileClusterGeneratorConfig
  | TrackGeneratorConfig
  | VesselEventsGeneratorConfig
  | RulersGeneratorConfig
  | HeatmapGeneratorConfig
  | HeatmapAnimatedGeneratorConfig

// ---- Generator specific types
export enum BasemapType {
  Satellite = 'satellite',
  Default = 'basemap_default',
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

export type HeatmapAnimatedInteractionType =
  | 'presence'
  | 'presence-detail'
  | 'viirs'
  | 'fishing-effort'

export interface HeatmapAnimatedGeneratorSublayer {
  id: string
  datasets: string[]
  filter?: string
  colorRamp: ColorRampsIds
  colorRampWhiteEnd?: boolean
  visible?: boolean
  breaks?: number[]
  legend?: GeneratorLegend
  interactionType?: HeatmapAnimatedInteractionType
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
  // Uses a MGL heatmap layer to represent values with smooth translations between grid points. Works only with 1 sublayer
  Blob = 'blob',
  // Represents value in 3D stacked bars. Works with 0 - n sublayers
  Extruded = 'extruded',
  // Just show raw value ffor 1 sublayer
  Single = 'single',
}
