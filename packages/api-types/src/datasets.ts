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

export interface Endpoint {
  id: string
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
  Fourwings = '4wings:v1',
  Tracks = 'user-tracks:v1',
  Context = 'user-context-layer:v1',
  Download = 'data-download:v1',
}

export enum DatasetStatus {
  Done = 'done',
  Importing = 'importing',
  Error = 'error',
}

export interface DatasetConfiguration {
  index?: string
  filePath?: string
  propertyToInclude?: string
  srid?: number
  [key: string]: unknown
}

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

export interface Dataset {
  id: string
  type: DatasetTypes
  alias: string[] | null
  name: string
  description: string
  schema?: Record<string, DatasetSchema>
  category?: string
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
  configuration: DatasetConfiguration | null
  relatedDatasets: RelatedDataset[] | null
  fieldsAllowed: string[]
}
