import { AOI, Dataview, DataviewInstance } from '.'

export type ApiAppName = 'fishing-map' | 'marine-reserves'

export interface WorkspaceViewport {
  zoom: number
  latitude: number
  longitude: number
}

export interface Workspace<T = unknown> {
  id: string
  name: string
  app: ApiAppName
  description: string
  aoi?: AOI
  viewport: WorkspaceViewport
  startAt: string
  endAt: string
  state?: T
  dataviews?: Partial<Dataview>[]
  dataviewInstances: DataviewInstance[]
}

export interface WorkspaceUpsert<T = any> extends Partial<Omit<Workspace<T>, 'aoi' | 'dataviews'>> {
  aoi?: number
  dataviews?: number[]
}
