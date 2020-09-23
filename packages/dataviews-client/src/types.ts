import { GeoJSON } from 'geojson'
import { FetchResponseTypes } from '@globalfishingwatch/api-client/dist/api-client'
import { Generators } from '@globalfishingwatch/layer-composer'

export interface EndpointParam {
  id: string
  label: string
  description: string
  type: 'enum' | 'boolean' | 'number' | 'string' | 'Date ISO' | 'sql'
  values?: string[]
  default?: string | boolean | number
  required?: boolean
}

export interface Endpoint {
  id: string
  description: string
  pathTemplate: string
  downloadable: boolean
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

export interface Dataset {
  id: string
  type: DatasetTypes
  alias: string[]
  name: string
  description: string
  category: string
  subcategory: string
  source: string
  status: DatasetStatus
  importLogs: string
  unit: string
  ownerId: number
  startDate: string
  endDate: string
  endpoints?: Endpoint[]
  configuration: DatasetConfiguration
}

export interface DataviewConfig {
  type?: Generators.Type | string
  color?: string
  colorRamp?: Generators.ColorRampsIds
  [key: string]: unknown
}

export interface DataviewDatasetConfigParams {
  id: string
  value: string | number | boolean
}

export interface DataviewDatasetConfig {
  endpoint: string
  params: DataviewDatasetConfigParams[]
  query: DataviewDatasetConfigParams[]
}

export interface DataviewDatasetConfigDict {
  [key: string]: DataviewDatasetConfig
}

export interface DataviewCreation {
  name: string
  description: string
  datasets: string[]
  config?: DataviewConfig
}

export interface Dataview {
  id: number
  name: string
  description: string
  createdAt?: string
  updatedAt?: string
  config: DataviewConfig
  datasets?: Dataset[]
  datasetsConfig?: DataviewDatasetConfigDict
}

export interface AOI {
  id: number
  name: string
  area: number
  geometry?: GeoJSON
  bbox: number[]
}

export interface WorkspaceDataviewConfig {
  config: DataviewConfig
  datasetsConfig: DataviewDatasetConfigDict
}

export interface WorkspaceDataviewConfigDict {
  [id: string]: WorkspaceDataviewConfig
}

export interface Workspace {
  id: number
  description: string
  name: string
  dataviews: Dataview[]
  dataviewsConfig: WorkspaceDataviewConfigDict
  aoi?: AOI
  viewport: {
    zoom: number
    latitude: number
    longitude: number
  }
  start: string
  end: string
}

export interface WorkspaceUpsert extends Partial<Omit<Workspace, 'aoi' | 'dataviews'>> {
  aoi?: number
  dataviews?: number[]
}

export interface Resource<T = unknown> {
  dataviewId: number | string
  datasetId: string
  type?: string
  // identifies resource uniquely, ie vessel id
  datasetParamId: string
  resolvedUrl: string
  responseType?: FetchResponseTypes
  data?: T
}
