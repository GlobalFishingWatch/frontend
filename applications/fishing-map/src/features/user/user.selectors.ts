import { createSelector } from '@reduxjs/toolkit'
import orderBy from 'lodash/orderBy'
import { DatasetStatus, DatasetCategory } from '@globalfishingwatch/api-types'
import { selectDatasets } from 'features/datasets/datasets.slice'
import {
  selectContextAreasDataviews,
  selectEnvironmentalDataviews,
} from 'features/workspace/workspace.selectors'
import { selectWorkspaces } from 'features/workspaces-list/workspaces-list.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectUserStatus, selectUserLogged, GUEST_USER_TYPE, selectUserData } from './user.slice'

const DEFAULT_GROUP_ID = 'Default'

export const isGuestUser = createSelector([selectUserData], (userData) => {
  return userData?.type === GUEST_USER_TYPE
})

export const isUserLogged = createSelector(
  [selectUserStatus, selectUserLogged],
  (status, logged) => {
    return status === AsyncReducerStatus.Finished && logged
  }
)

export const isUserAuthorized = createSelector([selectUserData], (user) => {
  return (
    user?.permissions.find(
      (permission) =>
        permission.type === 'application' &&
        permission.value === 'fishing-map' &&
        permission.action === 'map.load'
    ) !== undefined
  )
})

export const selectUserId = createSelector([selectUserData], (userData) => {
  return userData?.id
})

export const selectUserGroups = createSelector([selectUserData], (userData) => {
  return userData?.groups
})

export const selectUserGroupsClean = createSelector([selectUserGroups], (userGroups) => {
  return userGroups?.filter((g) => g !== DEFAULT_GROUP_ID)
})

export const selectUserWorkspaces = createSelector(
  [selectUserData, selectWorkspaces],
  (userData, workspaces) => {
    return orderBy(
      workspaces?.filter((workspace) => workspace.ownerId === userData?.id),
      'createdAt',
      'desc'
    )
  }
)

export const selectUserDatasets = createSelector(
  [selectDatasets, selectUserId],
  (datasets, userId) => datasets?.filter((d) => d.ownerId === userId)
)

export const selectUserDatasetsByCategory = (datasetCategory: DatasetCategory) =>
  createSelector([selectUserDatasets], (datasets) =>
    datasets?.filter((d) => d.category === datasetCategory)
  )

export const selectUserDatasetsNotUsed = (datasetCategory: DatasetCategory) => {
  const dataviewsSelector =
    datasetCategory === DatasetCategory.Context
      ? selectContextAreasDataviews
      : selectEnvironmentalDataviews
  return createSelector(
    [selectUserDatasetsByCategory(datasetCategory), dataviewsSelector],
    (datasets, dataviews) => {
      const dataviewDatasets = dataviews?.flatMap(
        (dataview) => dataview.datasets?.flatMap(({ id }) => id || []) || []
      )
      return datasets.filter(
        ({ id, status }) => !dataviewDatasets?.includes(id) && status !== DatasetStatus.Error
      )
    }
  )
}
