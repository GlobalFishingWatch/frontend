import type { EventTypes } from './events'

export const DRAW_DATASET_SOURCE = 'drawn_on_gfw_map'

export interface UploadResponse {
  path: string
  url: string
}

export type EndpointParamType =
  | 'enum'
  | 'boolean'
  | 'number'
  | 'string'
  | 'sql'
  | 'date-iso' // legacy from v2 replaced by type: string, format: 'date-iso'
  | '4wings-datasets' // legacy from v2 replaced by type: string, array: true

export interface EndpointParam {
  id: string
  label: string
  type: EndpointParamType
  enum?: string[]
  array?: boolean
  required?: boolean
  description?: string
  default?: string | boolean | number
}

export enum EndpointId {
  ContextTiles = 'context-tiles',
  ContextFeature = 'context-feature',
  ClusterTiles = 'events-cluster-tiles',
  ClusterTilesInteraction = 'events-cluster-interaction',
  ContextGeojson = 'temporal-context-geojson',
  Events = 'events',
  EventsDetail = 'events-detail',
  FourwingsBreaks = '4wings-bins',
  FourwingsInteraction = '4wings-interaction',
  FourwingsLegend = '4wings-legend',
  FourwingsTiles = '4wings-tiles',
  Tracks = 'tracks',
  Thumbnails = 'thumbnails',
  PMTiles = 'pm-tiles',
  UserTracks = 'user-tracks-data',
  Vessel = 'vessel',
  VesselAdvancedSearch = 'advanced-search-vessels',
  VesselList = 'list-vessels',
  VesselSearch = 'search-vessels',
}

export interface Endpoint {
  id: EndpointId
  description?: string
  method?: 'GET' | 'POST'
  pathTemplate: string
  downloadable: boolean
  body?: any
  params: EndpointParam[]
  query: EndpointParam[]
}

export enum DatasetTypes {
  Context = 'context-layer:v1',
  Download = 'data-download:v1',
  Events = 'events:v1',
  Fourwings = '4wings:v1',
  PMTiles = 'pm-tiles:v1',
  Ports = 'ports:v1',
  TemporalContext = 'temporal-context-layer:v1',
  Thumbnails = 'thumbnails:v1',
  Tracks = 'tracks:v1',
  UserContext = 'user-context-layer:v1',
  UserTracks = 'user-tracks:v1',
  VesselGroups = 'vessel-group:v1',
  Vessels = 'vessels:v1',
}

export enum DatasetStatus {
  Error = 'error',
  Done = 'done',
  Deleted = 'deleted',
  Importing = 'importing',
}

export type DatasetGeometryType = 'polygons' | 'tracks' | 'points' | 'draw'
export type DatasetGeometryToGeoJSONGeometry = {
  [Property in DatasetGeometryType]: string[]
}
export type TimeFilterType = 'date' | 'dateRange'

export interface DatasetDocumentation {
  type?: string
  enable?: boolean
  status?: 'Active' | 'Deprecated'
  queries?: string[]
  provider?: string
}

export type DatasetConfigurationSourceFormat = 'GeoJSON' | 'Shapefile' | 'CSV' | 'KML'
export interface DatasetConfigurationUI {
  latitude?: string
  longitude?: string
  timestamp?: string
  sourceFormat?: DatasetConfigurationSourceFormat
  includeWithoutEndDate?: boolean // used in infrastructure layer to render points that we consider are still there because don't have end date
  pointName?: string
  pointSize?: string
  maxPointSize?: number
  minPointSize?: number
  startTime?: string | number
  endTime?: string | number
  timeFilterType?: TimeFilterType
  polygonColor?: string
  /**
   * Feature properties array to inform the API
   * which data is to be be added to tiles features
   */
  valueProperties?: string[]
  geometryType?: DatasetGeometryType
  lineId?: string | number
  segmentId?: string | number
}

export type DatasetConfigurationInterval = 'YEAR' | 'MONTH' | 'DAY' | 'HOUR'

interface DatasetBackendConfig {
  table?: string
  dataset?: string
  project?: string
  version?: number
  tileScale?: number
  tileOffset?: number
  timestamp?: string
  translate?: boolean | null
  numBytes?: number | null
  indexBoost?: number | null
  insightSources?: string[]
  interactionColumns?: string[]
  interactionGroupColumns?: string[]
  ttl?: number | null
  band?: string | null
  images?: string | null
  source?: string | null
  tableName?: string
  filePath?: string
  srid?: number
  file?: string
}

export interface DatasetConfiguration extends DatasetBackendConfig {
  id?: string
  index?: string
  type?: EventTypes
  source?: string
  function?: 'AVG' | 'SUM'
  aggregationOperation?: 'avg' | 'sum'
  geometryType?: DatasetGeometryType
  format?: 'geojson'
  documentation?: DatasetDocumentation
  fields?: string[]
  idProperty?: string
  /**
   * Feature properties array to inform the API
   * which data is to be be added to tiles features
   */
  valueProperties?: string[]
  propertyToInclude?: string
  maxZoom?: number
  min?: number
  max?: number
  intervals?: DatasetConfigurationInterval[]
  disableInteraction?: boolean
  apiSupportedVersions?: ('v1' | 'v2' | 'v3')[]
  configurationUI?: DatasetConfigurationUI
}

export interface EnviromentalDatasetConfiguration extends DatasetConfiguration {
  min: number
  max: number
  offset: number
  scale: number
  propertyToInclude: string
  propertyToIncludeRange: { min: number; max: number }
  maxZoom?: number
}

export type AnyDatasetConfiguration = DatasetConfiguration | EnviromentalDatasetConfiguration

export type RelatedDataset = {
  id: string
  type: DatasetTypes
}

export type DatasetSchemaType =
  | 'range'
  | 'number'
  | 'string'
  | 'boolean'
  | 'array'
  | 'coordinate'
  | 'timestamp'

export type DatasetSchemaFormat = 'date-time' | 'latitude' | 'longitude'

export type DatasetSchemaItemEnum = (string | number | boolean)[]
export type DatasetSchemaItemOperation = 'gt' | 'lt' | 'gte' | 'lte'
export type DatasetSchemaItem = {
  type: DatasetSchemaType
  enum?: DatasetSchemaItemEnum
  format?: DatasetSchemaFormat
  maxLength?: number
  minLength?: number
  min?: number
  max?: number
  stats?: boolean
  unit?: string
  singleSelection?: boolean
  operation?: DatasetSchemaItemOperation
  items?: { type: DatasetSchemaType; enum: string[] }
  properties?: Record<string, DatasetSchemaItem>
}

export type DatasetSchema = {
  type: DatasetSchemaType
  maxLength: number
  minLength: number
  enum: string[]
  min: number
  max: number
  stats?: boolean
  unit?: string
  singleSelection?: boolean
  items?: Record<string, DatasetSchemaItem>
}

export enum DatasetCategory {
  Event = 'event',
  Detections = 'detections',
  Context = 'context',
  Environment = 'environment',
  Activity = 'activity',
  Vessel = 'vessel',
  VesselGroups = 'vessel groups',
}

export enum DatasetSubCategory {
  Info = 'info',
  Track = 'track',
  Fishing = 'fishing',
  Presence = 'presence',
  Viirs = 'viirs',
  Sar = 'sar',
}

export interface DatasetFile {
  name: string
  size: number | string
  lastUpdate: string
}

export interface Dataset {
  id: string
  type: DatasetTypes
  alias: string[] | null
  name: string
  description: string
  readme?: string
  schema?: Record<string, DatasetSchema | DatasetSchemaItem>
  category?: DatasetCategory
  subcategory?: DatasetSubCategory | EventTypes | string
  source?: string
  status: DatasetStatus
  importLogs?: string
  unit?: string
  ownerType: string
  ownerId: number
  startDate?: string
  endDate?: string
  lastUpdated?: string
  createdAt: string
  files?: DatasetFile[]
  endpoints?: Endpoint[]
  configuration: AnyDatasetConfiguration | null
  relatedDatasets: RelatedDataset[] | null
  fieldsAllowed: string[]
  filters: Record<string, DatasetSchemaItem>
}

export interface ThinningConfig {
  /**
   * Maximum distance between fishing points (in km)
   */
  'distance-fishing'?: number
  /**
   * Maximum distance between points in transit (in km)
   */
  'distance-transit'?: number
  /**
   * Accumulated bearing change between consecutive fishing points (in degrees)
   */
  'bearing-val-fishing'?: number
  /**
   * Accumulated bearing change between consecutive points in transit (in degrees)
   */
  'bearing-val-transit'?: number
  /**
   * Accumulated speed change between consecutive fishing points (in percentage)
   */
  'change-speed-fishing'?: number
  /**
   * Accumulated speed change between consecutive pointsin transit (in percentage)
   */
  'change-speed-transit'?: number
  /**
   * Maximum number of fishing points that could be skipped when no other
   * thinning criterias are met (in quantity)
   *
   * This is to ensure we always include a point if X previous fishing points
   * were not included
   */
  'min-accuracy-fishing'?: number
  /**
   * Maximum number of points in transit that could be skipped when no other
   * thinning criterias are met (in quantity)
   *
   * This is to ensure we always include a point if X previous points in transit
   * were not included
   */
  'min-accuracy-transit'?: number
}
