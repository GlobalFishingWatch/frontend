import type { DataviewInstance } from './dataviews'

export type ApiAppName = 'fishing-map' | 'marine-manager'

export const WORKSPACE_PUBLIC_ACCESS = 'public'
export const WORKSPACE_PASSWORD_ACCESS = 'password'
export const WORKSPACE_PRIVATE_ACCESS = 'private'

export type WorkspaceViewAccessType =
  | typeof WORKSPACE_PUBLIC_ACCESS
  | typeof WORKSPACE_PASSWORD_ACCESS
  | typeof WORKSPACE_PRIVATE_ACCESS
export type WorkspaceEditAccessType =
  | typeof WORKSPACE_PASSWORD_ACCESS
  | typeof WORKSPACE_PRIVATE_ACCESS

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
  viewAccess: WorkspaceViewAccessType
  editAccess: WorkspaceEditAccessType
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
  'id' | 'ownerId' | 'createdAt' | 'ownerType' | 'viewAccess' | 'editAccess'
>
