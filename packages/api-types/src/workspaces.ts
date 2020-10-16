import { Dataset, AOI, Dataview, DataviewInstance } from '.'

export interface Workspace {
  id: number
  description: string
  name: string
  aoi?: AOI
  viewport: {
    zoom: number
    latitude: number
    longitude: number
  }
  start: string
  end: string
  datasets?: Partial<Dataset>[]
  dataviews?: Partial<Dataview>[]
  dataviewInstances: DataviewInstance[]
}

export interface WorkspaceUpsert extends Partial<Omit<Workspace, 'aoi' | 'dataviews'>> {
  aoi?: number
  dataviews?: number[]
}
