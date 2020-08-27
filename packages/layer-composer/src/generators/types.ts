import { FeatureCollection } from 'geojson'
import { Segment } from './track/segments-to-geojson'
import { Geoms } from './heatmap/types'

export enum Type {
  Background = 'BACKGROUND',
  UserContext = 'USER_CONTEXT',
  Basemap = 'BASEMAP',
  CartoPolygons = 'CARTO_POLYGONS',
  GL = 'GL',
  Heatmap = 'HEATMAP',
  HeatmapAnimated = 'HEATMAP_ANIMATED',
  Track = 'TRACK',
  VesselEvents = 'VESSEL_EVENTS',
  Rulers = 'RULERS',
}

export interface GlobalGeneratorConfig {
  start: string
  end: string
  zoom: number
  zoomLoadLevel?: number
  token?: string
}

export type AnyData = FeatureCollection | Segment[] | RawEvent[] | Ruler[]

export interface GeneratorConfig {
  id: string
  data?: AnyData
  type: Type | string
  visible?: boolean
  opacity?: number
}

/**
 * This is the union of GeneratorConfig <T> with GlobalGeneratorConfig, which allows access to both
 * generator config params and global config params, at the generator level
 */
export type MergedGeneratorConfig<T> = T & GlobalGeneratorConfig

/**
 * A solid color background layer
 */
export interface BasemapGeneratorConfig extends GeneratorConfig {
  type: Type.Basemap
  /**
   * Sets the color of the map background in any format supported by Mapbox GL, see https://docs.mapbox.com/mapbox-gl-js/style-spec/types/#color
   */
  basemap?: string
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
   * Url to grab the tiles from, internally using https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-tiles
   */
  tilesUrl: string
}

/**
 * Placeholder for a generic set of Mapbox GL layers (consisting of one or more sources and one or mor layers)
 */
export interface GlGeneratorConfig extends GeneratorConfig {
  type: Type.GL
  sources?: any
  layers?: any
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

/**
 * Renders a vessel track that can be filtered by time. Will use `start` and `end` from the global generator config, if set
 */
export interface TrackGeneratorConfig extends GeneratorConfig {
  type: Type.Track
  /**
   * A GeoJSON made of one or more LineStrings. Features should have `coordinateProperties` set in order to filter by time
   */
  data: FeatureCollection | Segment[]
  /**
   * Progresseively simplify geometries when zooming out for improved performance
   */
  simplify?: boolean
  /**
   * Sets the color of the map background in any format supported by Mapbox GL, see https://docs.mapbox.com/mapbox-gl-js/style-spec/types/#color
   */
  color?: string
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
  currentEventId?: string
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
  tilesUrl: string
  statsUrl?: string
  fetchStats?: boolean
  statsFilter?: string
  geomType?: Geoms
  colorRamp?: ColorRampsIds
  serverSideFilter?: string
  updateColorRampOnTimeChange?: boolean
}

export interface HeatmapAnimatedGeneratorConfig extends GeneratorConfig {
  type: Type.HeatmapAnimated
  // TODO remove as not animated config
  tileset: string
  // TODO match with not animated config (tilesUrl)
  tilesAPI?: string
  geomType?: Geoms
  datasetStart?: string
  datasetEnd?: string
  maxZoom?: number
  debug?: boolean
  debugLabels?: boolean
  colorRamp?: ColorRampsIds
  serverSideFilter?: string
}

export type AnyGeneratorConfig =
  | BackgroundGeneratorConfig
  | BasemapGeneratorConfig
  | GlGeneratorConfig
  | CartoPolygonsGeneratorConfig
  | UserContextGeneratorConfig
  | TrackGeneratorConfig
  | VesselEventsGeneratorConfig
  | RulersGeneratorConfig
  | HeatmapGeneratorConfig
  | HeatmapAnimatedGeneratorConfig

// ---- Generator specific types
export enum BasemapType {
  Satellite = 'satellite',
  Landmass = 'landmass',
  Graticules = 'graticules',
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
  encounter?: {
    authorized: boolean
    authorizationStatus: AuthorizationOptions
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

// ---- Heatmap Generator color ramps types
export type ColorRampsIds =
  | 'fishing'
  | 'presence'
  | 'reception'
  | 'teal'
  | 'magenta'
  | 'lilac'
  | 'salmon'
  | 'sky'
  | 'red'
  | 'yellow'
  | 'green'
  | 'orange'
