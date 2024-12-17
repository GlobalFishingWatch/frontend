import type { UserApplicationIntendedUse } from './user-applications'

export const BADGES_GROUP_PREFIX = 'GFW Badges'
export const BADGES_GROUP_ADMIN_ID = `${BADGES_GROUP_PREFIX} - Administrator`
export const AMBASSADOR_BADGE_ID = `${BADGES_GROUP_PREFIX} - Ambassador`
export const FEEDBACK_PROVIDER_BADGE_ID = `${BADGES_GROUP_PREFIX} - Feedback Provider`
export const PRESENTER_BADGE_ID = `${BADGES_GROUP_PREFIX} - Presenter`
export const TEACHER_BADGE_ID = `${BADGES_GROUP_PREFIX} - Teacher`

export type BADGES_GROUP =
  | typeof AMBASSADOR_BADGE_ID
  | typeof FEEDBACK_PROVIDER_BADGE_ID
  | typeof PRESENTER_BADGE_ID
  | typeof TEACHER_BADGE_ID

export type BADGES_PERMISSIONS =
  | 'gfw-presenter-badge'
  | 'gfw-teacher-badge'
  | 'gfw-feedback-provider-badge'
  | 'gfw-ambassador-badge'

export type UserPermissionType =
  | 'application'
  | 'dataset'
  | 'entity'
  | 'user-group'
  | 'user-property'

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
  | BADGES_PERMISSIONS

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
