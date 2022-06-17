import { AOI, Dataview, DataviewInstance } from '.'

export type ApiAppName = 'fishing-map' | 'marine-manager'

export interface WorkspaceViewport {
  zoom: number
  latitude: number
  longitude: number
}

export interface Workspace<State = unknown, Category = string> {
  id: string
  name: string
  app: ApiAppName
  description: string
  category?: Category
  public?: boolean
  aoi?: AOI
  viewport: WorkspaceViewport
  startAt: string
  endAt: string
  state?: State
  dataviews?: Partial<Dataview>[]
  dataviewInstances: DataviewInstance[]
  ownerId: number
  ownerType: string
  createdAt: string
}

export interface WorkspaceUpsert<T = any> extends Partial<Omit<Workspace<T>, 'aoi' | 'dataviews'>> {
  aoi?: string
  dataviews?: number[]
}
