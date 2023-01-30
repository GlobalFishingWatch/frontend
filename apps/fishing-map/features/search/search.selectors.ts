import { createSelector } from '@reduxjs/toolkit'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { Dataset, UserData } from '@globalfishingwatch/api-types'
import { selectUserData, isGuestUser } from 'features/user/user.slice'
import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import { filterDatasetsByUserType, getDatasetsInDataviews } from 'features/datasets/datasets.utils'
import { selectAllDataviewsInWorkspace } from 'features/dataviews/dataviews.selectors'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { SearchType } from './search.slice'

export const selectSearchDatasetsInWorkspace = createSelector(
  [
    (state) => selectAllDataviewsInWorkspace(state),
    (state) => selectVesselsDatasets(state),
    (state) => selectAllDatasets(state),
  ],
  (dataviews, vesselsDatasets, allDatasets) => {
    const datasetsIds = getDatasetsInDataviews(dataviews)
    const datasets = allDatasets.flatMap(({ id, relatedDatasets }) => {
      if (!datasetsIds.includes(id)) return []
      return [id, ...(relatedDatasets || []).map((d) => d.id)]
    })
    return vesselsDatasets.filter((dataset) => datasets.includes(dataset.id))
  }
)

export const filterDatasetByPermissions = (
  datasets: Dataset[],
  type: SearchType,
  userData: UserData,
  isGuest: boolean
) => {
  const datasetsWithPermissions = datasets.filter((dataset) => {
    const permission = { type: 'dataset', value: dataset?.id, action: `${type}-search` }

    return checkExistPermissionInList(userData?.permissions, permission)
  })
  return filterDatasetsByUserType(datasetsWithPermissions, isGuest)
}

export const selectAllSearchDatasetsByType = (type: SearchType) =>
  createSelector(
    [
      (state) => selectVesselsDatasets(state),
      (state) => selectUserData(state),
      (state) => isGuestUser(state),
    ],
    (datasets, userData, guestUser) => {
      if (!userData || !datasets?.length) return
      return filterDatasetByPermissions(datasets, type, userData, guestUser)
    }
  )

export const selectSearchDatasetsInWorkspaceByType = (type: SearchType) =>
  createSelector(
    [
      (state) => selectSearchDatasetsInWorkspace(state),
      (state) => selectUserData(state),
      (state) => isGuestUser(state),
    ],
    (datasets, userData, guestUser) => {
      if (!userData || !datasets?.length) return
      return filterDatasetByPermissions(datasets, type, userData, guestUser)
    }
  )

export const selectBasicSearchDatasets = createSelector(
  [selectSearchDatasetsInWorkspaceByType('basic')],
  (basicSearchDatasets) => {
    return basicSearchDatasets
  }
)

export const selectAdvancedSearchDatasets = createSelector(
  [selectSearchDatasetsInWorkspaceByType('advanced')],
  (advancedSearchDatasets) => {
    return advancedSearchDatasets
  }
)

export const isBasicSearchAllowed = createSelector(
  [selectBasicSearchDatasets],
  (searchDatasets) => {
    return searchDatasets && searchDatasets.length > 0
  }
)

export const isAdvancedSearchAllowed = createSelector(
  [selectAdvancedSearchDatasets],
  (searchDatasets) => {
    return searchDatasets && searchDatasets.length > 0
  }
)
