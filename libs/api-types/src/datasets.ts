import { EventTypes } from './events'

export interface UploadResponse {
  path: string
  url: string
}

export type EndpointParamType =
  | 'enum'
  | 'boolean'
  | 'number'
  | 'string'
  | 'date-iso'
  | 'sql'
  | '4wings-datasets'

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
  ClusterTiles = 'events-cluster-tiles',
  ContextGeojson = 'temporal-context-geojson',
  Events = 'events',
  EventsDetail = 'events-detail',
  FourwingsBreaks = '4wings-bins',
  FourwingsInteraction = '4wings-interaction',
  FourwingsLegend = '4wings-legend',
  FourwingsTiles = '4wings-tiles',
  Tracks = 'tracks',
  UserContextTiles = 'user-context-tiles',
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
  Vessels = 'vessels:v1',
  Events = 'events:v1',
  Ports = 'ports:v1',
  Tracks = 'tracks:v1',
  Fourwings = '4wings:v1',
  Context = 'user-context-layer:v1',
  TemporalContext = 'temporal-context-layer:v1',
  Download = 'data-download:v1',
  // TODO
  UserTracks = 'user-tracks:v1',
}

export enum DatasetStatus {
  Error = 'error',
  Done = 'done',
  Deleted = 'deleted',
  Importing = 'importing',
}

export type DatasetGeometryType = 'polygons' | 'tracks' | 'points' | 'draw'

export interface DatasetDocumentation {
  queries?: string[]
}

export interface DatasetConfiguration {
  index?: string
  filePath?: string
  srid?: number
  file?: string
  type?: EventTypes
  geometryType?: DatasetGeometryType
  format?: 'geojson'
  documentation?: DatasetDocumentation
  fields?: string[]
  [key: string]: unknown
}

export interface EnviromentalDatasetConfiguration extends DatasetConfiguration {
  propertyToInclude: string
  propertyToIncludeRange: { min: number; max: number }
}

export type AnyDatasetConfiguration = DatasetConfiguration | EnviromentalDatasetConfiguration

export type RelatedDataset = {
  id: string
  type: DatasetTypes
}

export type DatasetSchemaType = 'number' | 'string' | 'boolean'

export type DatasetSchema = {
  type: DatasetSchemaType
  maxLength: number
  minLength: number
  enum: string[]
  minimum: number
  maximum: number
  stats?: boolean
}

export enum DatasetCategory {
  Event = 'event',
  Context = 'context',
  Environment = 'environment',
  Activity = 'activity',
}

export interface Dataset {
  id: string
  type: DatasetTypes
  alias: string[] | null
  name: string
  description: string
  schema?: Record<string, DatasetSchema>
  category?: DatasetCategory
  subcategory?: EventTypes | string
  source?: string
  status: DatasetStatus
  importLogs?: string
  unit?: string
  ownerType: string
  ownerId: number
  startDate?: string
  endDate?: string
  createdAt: string
  endpoints?: Endpoint[]
  configuration: AnyDatasetConfiguration | null
  relatedDatasets: RelatedDataset[] | null
  fieldsAllowed: string[]
}

export interface ThinningConfig {
  'distance-fishing'?: number
  'bearing-val-fishing'?: number
  'change-speed-fishing'?: number
  'min-accuracy-fishing'?: number
  'distance-transit'?: number
  'bearing-val-transit'?: number
  'change-speed-transit'?: number
  'min-accuracy-transit'?: number
}
