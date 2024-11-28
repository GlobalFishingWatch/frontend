import type { UserApplicationIntendedUse } from './user-applications'

export type UserPermissionType = 'application' | 'dataset' | 'entity'
export type UserPermissionValue =
  | 'carrier-portal'
  | 'carriers:*'
  | 'data-portal'
  | 'dataview'
  | 'fishing-map'
  | 'indonesia:*'
  | 'map-client'
  | 'public'
  | 'user-application'
  | 'vessel-group'
  | 'workspace'

export type UserPermissionAction =
  | 'read'
  | 'read-all'
  | 'create'
  | 'create-all'
  | 'delete'
  | 'delete-all'
  | string

export interface UserPermission {
  type: UserPermissionType
  value: UserPermissionValue
  action: UserPermissionAction
}

export interface UserGroup {
  id: number
  name: string
  default: boolean
  createdAt: string
  description: string | null
  roles?: { id: string; description: string }[]
  users?: UserData[]
}

export interface FutureUserData {
  id: number
  email: string
  groups: UserGroup[]
}

export interface UserData {
  id: number
  type: string
  groups: string[]
  permissions: UserPermission[]
  email?: string
  firstName?: string
  lastName?: string
  photo?: string
  language?: string
  country?: string
  organization?: string
  organizationType?: string
  intendedUse?: UserApplicationIntendedUse
  whoEndUsers?: string
  problemToResolve?: string
  pullingDataOtherAPIS?: string
  apiTerms?: string
}
