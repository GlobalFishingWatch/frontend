import { AOI, Dataview, DataviewInstance } from '.'

export interface Workspace<T = unknown> {
  id: string
  name: string
  description: string
  aoi?: AOI
  viewport: {
    zoom: number
    latitude: number
    longitude: number
  }
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
