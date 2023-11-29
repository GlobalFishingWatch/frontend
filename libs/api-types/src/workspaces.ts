import { DataviewInstance } from './dataviews'

export type ApiAppName = 'fishing-map' | 'marine-manager'

export interface WorkspaceViewport {
  zoom: number
  latitude: number
  longitude: number
}

export type OwnerType = 'super-user' | string

export interface Workspace<State = unknown, Category = string> {
  id: string
  name: string
  app: ApiAppName
  description: string
  category?: Category
  public?: boolean
  viewport: WorkspaceViewport
  startAt: string
  endAt: string
  state?: State
  dataviewInstances: DataviewInstance[]
  ownerId?: number
  ownerType?: OwnerType
  createdAt?: string
}

export type WorkspaceUpsert<State = unknown, Category = string> = Omit<
  Workspace<State, Category>,
  'id' | 'ownerId' | 'createdAt' | 'ownerType'
>
