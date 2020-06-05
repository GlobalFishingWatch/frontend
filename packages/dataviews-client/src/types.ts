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
  id: string
  type: string
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
  viewParams?: ViewParams
  defaultViewParams?: ViewParams
  datasetsParams?: DatasetParams[]
  defaultDatasetParams?: DatasetParams[]
  datasetIds?: string[]
  datasets?: Dataset[] // foreign
}

export interface WorkspaceDataview {
  id: number
  viewParams?: ViewParams
  datasetsParams?: DatasetParams[]
}

export interface Workspace {
  workspaceDataviews: WorkspaceDataview[]
}
