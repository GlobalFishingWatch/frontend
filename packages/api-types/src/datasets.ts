export interface UploadResponse {
  path: string
  url: string
}

export interface EndpointParam {
  id: string
  label: string
  type: 'enum' | 'boolean' | 'number' | 'string' | 'date-iso' | 'sql' | '4wings-datasets'
  enum?: string[]
  array?: boolean
  required?: boolean
  description?: string
  default?: string | boolean | number
}

export enum EndpointId {
  Tracks = 'carriers-tracks',
  Vessel = 'carriers-vessel',
  VesselList = 'carriers-list-vessels',
  VesselSearch = 'carriers-search-vessels',
  VesselAdvancedSearch = 'carriers-advanced-search-vessels',
  FourwingsTiles = '4wings-tiles',
  FourwingsLegend = '4wings-legend',
  FourwingsInteraction = '4wings-interaction',
  UserContextTiles = 'user-context-tiles',
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
  Vessels = 'carriers-vessels:v1',
  Events = 'carriers-events:v1',
  Ports = 'carriers-ports:v1',
  Tracks = 'carriers-tracks:v1',
  Fourwings = '4wings:v1',
  Context = 'user-context-layer:v1',
  Download = 'data-download:v1',
  // TODO
  UserTracks = 'user-tracks:v1',
}

export enum DatasetStatus {
  Done = 'done',
  Importing = 'importing',
  Error = 'error',
}

export type DatasetCustomTypes = 'points' | 'lines' | 'geometries'
export interface DatasetConfiguration {
  index?: string
  filePath?: string
  srid?: number
  file?: string
  type?: DatasetCustomTypes
  format?: 'geojson'
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

export type DatasetSchema = {
  type: 'number' | 'string'
  maxLength: number
  minLength: number
  enum: string[]
  minimum: number
  maximum: number
}

export enum DatasetCategory {
  Context = 'context',
  Environment = 'environment',
}

export interface Dataset {
  id: string
  type: DatasetTypes
  alias: string[] | null
  name: string
  description: string
  schema?: Record<string, DatasetSchema>
  category?: DatasetCategory
  subcategory?: string
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
