export type EndpointType = 'track' | 'info' | 'tiles' | 'events'

export interface Endpoint {
  type: EndpointType
  urlTemplate: string
}

export interface Dataset {
  id: string
  endpoints?: Endpoint[]
}

export interface Dataview {
  id: string
  name?: string
  description?: string
  config?: any
  datasets?: Dataset[]
  datasetsIds?: string[]
}

export interface DataviewWorkspace {
  id: string
  overrides?: any
  datasetParams?: any
  dataview?: Dataview
}

export interface Workspace {
  id?: string
  zoom: number
  latitude: number
  longitude: number
  start: string
  end: string
  dataviewsWorkspace?: DataviewWorkspace[]
}
