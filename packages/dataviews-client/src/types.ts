export type EndpointType = 'track' | 'info' | 'tiles' | 'events'

export interface Endpoint {
  type: EndpointType
  urlTemplate: string
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

export interface Dataview {
  id: number
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
  id: number
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
  dataviewId: number
  datasetId: string
  type?: string
  // identifies resource uniquely, ie vessel id
  mainDatasetParamId: string
  resolvedUrl: string
  data?: T
}
