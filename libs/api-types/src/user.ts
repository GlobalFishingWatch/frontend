export type UserPermissionType = 'application' | 'dataset' | 'entity'
export type UserPermissionValue =
  | 'workspace'
  | 'dataview'
  | 'map-client'
  | 'data-portal'
  | 'carrier-portal'
  | 'fishing-map'
  | 'indonesia:*'
  | 'carriers:*'
  | 'public'
  | 'user-application'
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
  intendedUse?: string
  whoEndUsers?: string
  problemToResolve?: string
  pullingDataOtherAPIS?: string
  apiTerms?: Date
}
