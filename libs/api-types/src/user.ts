import type { UserApplicationIntendedUse } from './user-applications'

export const BADGES_GROUP_PREFIX = 'GFW Badges'
export const BADGES_GROUP_ADMIN_ID = `${BADGES_GROUP_PREFIX} - Administrator`
export const AMBASSADOR_BADGE_ID = `${BADGES_GROUP_PREFIX} - Ambassador`
export const FEEDBACK_PROVIDER_BADGE_ID = `${BADGES_GROUP_PREFIX} - Feedback Provider`
export const PRESENTER_BADGE_ID = `${BADGES_GROUP_PREFIX} - Presenter`
export const TEACHER_BADGE_ID = `${BADGES_GROUP_PREFIX} - Teacher`
export const IMPACT_REPORTER_BADGE_ID = `${BADGES_GROUP_PREFIX} - Impact Reporter`

export type BADGES_GROUP =
  | typeof AMBASSADOR_BADGE_ID
  | typeof FEEDBACK_PROVIDER_BADGE_ID
  | typeof PRESENTER_BADGE_ID
  | typeof TEACHER_BADGE_ID
  | typeof IMPACT_REPORTER_BADGE_ID

export type BADGES_PERMISSIONS =
  | 'gfw-ambassador-badge'
  | 'gfw-feedback-provider-badge'
  | 'gfw-impact-reporter-badge'
  | 'gfw-presenter-badge'
  | 'gfw-teacher-badge'

export type UserPermissionType =
  | 'application'
  | 'dataset'
  | 'entity'
  | 'insights'
  | 'report'
  | 'user-group'
  | 'user-property'
  | 'vessel-group'
  | 'vessel-info'
  | 'vessel'
  | 'workspace'

export type UserPermissionValue =
  | '*-public'
  | '*global*'
  | '*public*'
  | 'bunker'
  | 'carrier-portal'
  | 'carrier'
  | 'carriers:*'
  | 'commercial-sources'
  | 'coverage'
  | 'data-portal'
  | 'dataview'
  | 'encounter'
  | 'fishing-map'
  | 'fishing'
  | 'gap'
  | 'indonesia:*'
  | 'loitering'
  | 'map-client'
  | 'non-commercial-sources'
  | 'port_visit'
  | 'public'
  | 'support'
  | 'tmt'
  | 'user-application'
  | 'vessel_identity_iuu_vessel_list'
  | 'vessel-group'
  | 'vessel-insights'
  | 'workspace'
  | BADGES_PERMISSIONS

export type UserPermissionAction =
  | 'basic-search'
  | 'create-all'
  | 'create'
  | 'delete-all'
  | 'delete'
  | 'read-all'
  | 'read'
  | string

export type UserPermission = {
  type: UserPermissionType
  value: UserPermissionValue
  action: UserPermissionAction
}

export type UserGroupId =
  | 'belize'
  | 'brazil'
  | 'chile'
  | 'costa rica'
  | 'costarica'
  | 'ecuador'
  | 'montenegro'
  | 'norway'
  | 'palau'
  | 'panama'
  | 'papua new guinea'
  | 'peru'
  | 'ssf-aruna'
  | 'ssf-ipnlf'
  | 'ssf-rare'

export type UserGroup<T = UserGroupId> = {
  id: T
  name: string
  default: boolean
  createdAt: string
  description: string | null
  roles?: { id: string; description: string }[]
  users?: UserData[]
}

export type FutureUserData = {
  id: number
  email: string
  groups: UserGroup[]
  invitationNotes?: string
}

export type UserData = {
  id: number
  type: string
  groups: string[]
  cohort?: string
  permissions: UserPermission[]
  email?: string
  firstName?: string
  lastName?: string
  photo?: string
  language?: string
  country?: string
  organization?: string
  organizationCategory?: string
  organizationType?: string
  intendedUse?: UserApplicationIntendedUse
  whoEndUsers?: string
  problemToResolve?: string
  pullingDataOtherAPIS?: string
  apiTerms?: string
  invitationNotes?: string
}
