import { FeatureCollection } from 'geojson'

import { GeneratorStyles } from '../types'

import { Segment } from './track/segments-to-geojson'

export enum Type {
  Background = 'BACKGROUND',
  Basemap = 'BASEMAP',
  CartoPolygons = 'CARTO_POLYGONS',
  GL = 'GL',
  Heatmap = 'HEATMAP',
  HeatmapAnimated = 'HEATMAP_ANIMATED',
  Track = 'TRACK',
  VesselEvents = 'VESSEL_EVENTS',
  Rulers = 'RULERS',
}

export interface Generator {
  type: string
  getStyle: (layer: GeneratorConfig) => GeneratorStyles
}

export interface GlobalGeneratorConfig {
  start?: string
  end?: string
  zoom?: number
  zoomLoadLevel?: number
}

export interface GeneratorConfig extends GlobalGeneratorConfig {
  id: string
  datasetParamsId?: string
  dataviewId?: string
  type: Type | string
  visible?: boolean
  opacity?: number
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
 * Placeholder for a generic set of Mapbox GL layers (consisting of one or more sources and one or mor layers)
 */
export interface GlGeneratorConfig extends GeneratorConfig {
  sources?: any
  layers?: any
}

/**
 * Renders outlined polygons for our CARTO tables library, typically context layers. Takes care of instanciating CARTO anonymous maps/layergroupid (hence asynchronous)
 */
export interface CartoPolygonsGeneratorConfig extends GeneratorConfig {
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
  data: RawEvent[]
  currentEventId?: string
}

/**
 * Renders rulers showing a distance between two points, using great circle if needed
 */
export interface RulersGeneratorConfig extends GeneratorConfig {
  /**
   * An array defining rulers with start and end coordinates, and an isNew flag
   */
  data: Ruler[]
}

export interface HeatmapGeneratorConfig extends GeneratorConfig {
  start: string
  end: string
  zoom: number
  maxZoom?: number
  tileset: string
  fetchStats?: boolean
  statsFilter?: string
  colorRamp?: ColorRamps
  serverSideFilter?: string
  updateColorRampOnTimeChange?: boolean
}

export interface HeatmapAnimatedGeneratorConfig extends HeatmapGeneratorConfig {
  delta?: number
  geomType: string
  quantizeOffset?: number
  colorRampMult: number
}

export type AnyGeneratorConfig =
  | BackgroundGeneratorConfig
  | GlGeneratorConfig
  | CartoPolygonsGeneratorConfig
  | TrackGeneratorConfig
  | VesselEventsGeneratorConfig
  | RulersGeneratorConfig
  | HeatmapGeneratorConfig
  | HeatmapAnimatedGeneratorConfig

// ---- Generator specific types
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

// ---- Heatmap Generator types
export type ColorRamps = 'fishing' | 'presence' | 'reception'
export type HeatmapColorRamp = {
  [key: string]: ColorRamps
}
export type HeatmapColorRampColors = {
  [key in string]: string[]
}
