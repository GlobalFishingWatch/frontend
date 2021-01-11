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

export type DatasetTypes =
  | 'carriers-tracks:v1'
  | 'carriers-vessels:v1'
  | 'carriers-events:v1'
  | 'carriers-ports:v1'
  | '4wings:v1'
  | 'user-tracks:v1'
  | 'user-context-layer:v1'
  | 'data-download:v1'

export type DatasetStatus = 'done' | 'importing' | 'error'
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

export interface Dataset {
  id: string
  type: DatasetTypes
  alias: string[] | null
  name: string
  description: string
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
