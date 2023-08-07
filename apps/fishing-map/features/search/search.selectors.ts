import { createSelector } from '@reduxjs/toolkit'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { Dataset, UserData } from '@globalfishingwatch/api-types'
import { selectUserData, isGuestUser } from 'features/user/user.slice'
import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import {
  filterDatasetsByUserType,
  getDatasetLabel,
  getDatasetsInDataviews,
} from 'features/datasets/datasets.utils'
import { selectAllDataviewsInWorkspace } from 'features/dataviews/dataviews.selectors'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { SearchType } from 'features/search/search.config'

export const selectSearchDatasetsInWorkspace = createSelector(
  [selectAllDataviewsInWorkspace, selectVesselsDatasets, selectAllDatasets],
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
    [selectVesselsDatasets, selectUserData, isGuestUser],
    (datasets, userData, guestUser) => {
      if (!userData || !datasets?.length) return
      return filterDatasetByPermissions(datasets, type, userData, guestUser)
    }
  )

export const selectSearchDatasetsInWorkspaceByType = (type: SearchType) =>
  createSelector(
    [selectSearchDatasetsInWorkspace, selectUserData, isGuestUser],
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

export const selectSearchDatasetsNotGuestAllowed = createSelector(
  [selectSearchDatasetsInWorkspace, selectBasicSearchDatasets],
  (searchDatasets = [], basicSearchDatasets = []) => {
    const basicSearchDatasetIds = basicSearchDatasets.map((d) => d.id)
    return searchDatasets.filter((d) => !basicSearchDatasetIds.includes(d.id))
  }
)

export const selectSearchDatasetsNotGuestAllowedLabels = createSelector(
  [selectSearchDatasetsNotGuestAllowed],
  (datasets = []) => {
    return datasets.map((d) => getDatasetLabel(d))
  }
)
