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
  type: EndpointType
  pathTemplate: string
  params: EndpointParam[]
  query: EndpointParam[]
  downloadable: boolean
}

export interface Dataset {
  id: string
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

export interface Dataview {
  id: number | string
  name: string
  description: string
  createdAt?: string
  updatedAt?: string
  view?: ViewParams
  defaultView?: ViewParams
  datasetsParams?: DatasetParams[]
  defaultDatasetsParams?: DatasetParams[]
  datasets?: Dataset[] // foreign
}

export interface WorkspaceDataview {
  id: number | string
  view?: ViewParams
  datasetsParams?: DatasetParams[]
}

export interface Workspace {
  workspaceDataviews: WorkspaceDataview[]
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
