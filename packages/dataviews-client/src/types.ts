import { GeoJSON } from 'geojson'
import { FetchResponseTypes } from '@globalfishingwatch/api-client/dist/api-client'

export type EndpointType = 'track' | 'info' | 'tiles' | 'events'

export type EndpointParam = {
  id: string
  label: string
  required: boolean
  type: string
  default: unknown
  description: string
}

export interface Endpoint {
  id: string
  description: string
  pathTemplate: string
  params: EndpointParam[]
  query: EndpointParam[]
  downloadable: boolean
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

export interface Dataset {
  id: string
  type: DatasetTypes
  name: string
  source: string
  description: string
  ownerId: number
  endpoints?: Endpoint[]
}

export interface ViewParams {
  type?: string
  [propName: string]: unknown
}

export interface DatasetParams {
  [propName: string]: unknown
}

export interface DatasetParamsConfig {
  dataset: string
  endpoint: string
  params: DatasetParams
  query: DatasetParams
}

export interface DataviewCreation {
  name: string
  description: string
  datasets: string[]
  defaultView?: ViewParams
}

export interface Dataview {
  id: number
  name: string
  description: string
  createdAt?: string
  updatedAt?: string
  view?: ViewParams
  defaultView?: ViewParams
  datasetsParams?: DatasetParams[]
  datasetsConfig?: DatasetParams[]
  datasets?: Dataset[]
  datasetsId?: number[]
}

export interface WorkspaceDataview {
  id: number | string
  view?: ViewParams
  datasetsParams?: DatasetParams[]
}

export interface AOI {
  id: number
  area: number
  geometry?: GeoJSON
  bbox: number[]
}

export interface Workspace {
  id: number
  description: string
  label: string
  dataviews: number[] | Dataview[]
  dataviewsId: number[]
  workspaceDataviews: WorkspaceDataview[]
  aoiId: number
  aoi?: AOI
  zoom: number
  latitude: number
  longitude: number
  start: string
  end: string
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

export interface ResolvedDataview extends Dataview {
  uid: string
  datasetsParamIds: string[]
}
