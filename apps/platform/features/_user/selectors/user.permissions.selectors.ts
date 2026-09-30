import { createSelector } from '@reduxjs/toolkit'
import { orderBy, uniqBy } from 'es-toolkit'

import type { UserPermission } from '@globalfishingwatch/api-types'
import { BADGES_GROUP_PREFIX, DatasetCategory, DatasetStatus } from '@globalfishingwatch/api-types'
import { checkExistPermissionInList } from '@globalfishingwatch/auth-middleware/utils'
import { DEFAULT_GROUP_ID } from '@globalfishingwatch/datasets-client'
import { PIPE_4_WORKSPACE_ID } from '@platform/config/map/workspaces'

import {
  AUTO_GENERATED_FEEDBACK_WORKSPACE_PREFIX,
  PRIVATE_SUFIX,
  USER_SUFIX,
} from 'data/map/config'
import { selectAllDatasets } from 'features/_map/datasets/datasets.slice'
import { getIsWorkspaceArchived } from 'features/_map/workspace/workspace.utils'
import type { AppWorkspace } from 'features/_map/workspaces-list/workspaces-list.slice'
import { selectWorkspaces } from 'features/_map/workspaces-list/workspaces-list.slice'
import { selectAllReports } from 'features/_reports/reports.slice'
import { selectUserData } from 'features/_user/selectors/user.selectors'

import { USER_GROUP_WORKSPACE } from '../user.slice'

import { selectPrivateUserGroups } from './user.groups.selectors'

const hasUserPermission = (permission: UserPermission) =>
  createSelector([selectUserData], (userData): boolean => {
    if (!userData?.permissions) return false
    return checkExistPermissionInList(userData.permissions, permission)
  })

export const selectHasTMTPermission = hasUserPermission({
  type: 'application',
  value: 'tmt',
  action: 'read',
})

export const selectHasDataviewEditPermissions = hasUserPermission({
  type: 'entity',
  value: 'dataview',
  action: 'create-all',
})

export const selectHasEditTranslationsPermissions = hasUserPermission({
  type: 'application',
  value: 'fishing-map',
  action: 'edit-translations',
})

export const selectHasAmbassadorBadge = hasUserPermission({
  type: 'user-property',
  value: 'gfw-ambassador-badge',
  action: 'read',
})
export const selectHasFeedbackProviderBadge = hasUserPermission({
  type: 'user-property',
  value: 'gfw-feedback-provider-badge',
  action: 'read',
})
export const selectHasPresenterBadge = hasUserPermission({
  type: 'user-property',
  value: 'gfw-presenter-badge',
  action: 'read',
})
export const selectHasTeacherBadge = hasUserPermission({
  type: 'user-property',
  value: 'gfw-teacher-badge',
  action: 'read',
})
export const selectHasImpactReporterBadge = hasUserPermission({
  type: 'user-property',
  value: 'gfw-impact-reporter-badge',
  action: 'read',
})

export const selectUserId = createSelector([selectUserData], (userData) => {
  return userData?.id
})

const selectUserGroups = createSelector([selectUserData], (userData) => {
  return userData?.groups
})

export const selectUserGroupsClean = createSelector([selectUserGroups], (userGroups) => {
  return userGroups?.filter((g) => g !== DEFAULT_GROUP_ID && !g.startsWith(BADGES_GROUP_PREFIX))
})

export const selectUserWorkspaces = createSelector(
  [selectUserData, selectWorkspaces],
  (userData, workspaces) => {
    return orderBy(
      workspaces?.filter(
        (workspace) =>
          workspace.ownerId === userData?.id &&
          !workspace.id.startsWith(AUTO_GENERATED_FEEDBACK_WORKSPACE_PREFIX)
      ),
      ['createdAt'],
      ['desc']
    )
  }
)

export const selectUserReports = createSelector(
  [selectUserData, selectAllReports],
  (userData, reports) => {
    return orderBy(
      reports?.filter(
        (report) =>
          report.ownerId === userData?.id &&
          !report.name.startsWith(AUTO_GENERATED_FEEDBACK_WORKSPACE_PREFIX)
      ),
      ['createdAt'],
      ['desc']
    )
  }
)

export const selectUserWorkspacesPrivate = createSelector(
  [selectPrivateUserGroups, selectWorkspaces],
  (groupsWithAccess = [], workspaces) => {
    const privateWorkspaces = workspaces?.filter(
      (workspace) =>
        workspace.id.includes(PRIVATE_SUFIX) &&
        !workspace.id.includes(USER_SUFIX) &&
        groupsWithAccess.some(
          (g) =>
            workspace.id.includes(g) ||
            (USER_GROUP_WORKSPACE[g] && workspace.id.includes(USER_GROUP_WORKSPACE[g]))
        )
    )
    return orderBy(privateWorkspaces, ['createdAt'], ['desc'])
  }
)

const filterActiveWorkspaces = (workspaces: AppWorkspace[]) =>
  workspaces.filter((workspace) => !getIsWorkspaceArchived(workspace))

export const selectUserWorkspacesActive = createSelector(
  [selectUserWorkspaces],
  filterActiveWorkspaces
)

export const selectUserWorkspacesPrivateActive = createSelector(
  [selectUserWorkspacesPrivate],
  filterActiveWorkspaces
)

export const selectUserWorkspacesArchived = createSelector(
  [selectUserWorkspaces, selectUserWorkspacesPrivate, selectWorkspaces],
  (userWorkspaces, privateWorkspaces, workspaces) => {
    const archivedDefault = workspaces.filter((w) => w.id === PIPE_4_WORKSPACE_ID)
    const archived = [...archivedDefault, ...privateWorkspaces, ...userWorkspaces].filter(
      getIsWorkspaceArchived
    )
    return orderBy(
      uniqBy(archived, (w) => w.id),
      ['createdAt'],
      ['desc']
    )
  }
)

export const selectUserDatasets = createSelector(
  [selectAllDatasets, selectUserId],
  (datasets, userId) =>
    datasets
      ?.filter((d) => d.ownerId === userId && d.status !== DatasetStatus.Deleted)
      // TODO sort by creation while included in the api, for now using reverse as API returns chronological order
      // .sort((a, b) => (a.createdAt <= b.createdAt ? -1 : 1))
      .reverse()
)

const selectUserDatasetsByCategory = (datasetCategory: DatasetCategory) =>
  createSelector([selectUserDatasets], (datasets) =>
    datasets?.filter((d) => d.category === datasetCategory)
  )

export const selectUserContextDatasets = selectUserDatasetsByCategory(DatasetCategory.Context)
export const selectUserVesselGroups = selectUserDatasetsByCategory(DatasetCategory.VesselGroups)
export const selectUserEnvironmentDatasets = selectUserDatasetsByCategory(
  DatasetCategory.Environment
)
