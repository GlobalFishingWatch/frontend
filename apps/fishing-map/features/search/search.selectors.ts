import { createSelector } from '@reduxjs/toolkit'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { selectUserData } from 'features/user/user.slice'
import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import { isGuestUser } from 'features/user/user.selectors'
import { filterDatasetsByUserType, getDatasetsInDataviews } from 'features/datasets/datasets.utils'
import { selectAllDataviewsInWorkspace } from 'features/dataviews/dataviews.selectors'
import { SearchType } from './search.slice'

export const selectSearchDatasetsInWorkspace = createSelector(
  [selectAllDataviewsInWorkspace, selectVesselsDatasets],
  (dataviews, vesselsDatasets) => {
    const datasets = getDatasetsInDataviews(dataviews)
    return vesselsDatasets.filter(
      (dataset) =>
        datasets.includes(dataset.id) ||
        dataset.relatedDatasets?.some((related) => datasets.includes(related.id))
    )
  }
)

export const selectSearchDatasets = (type: SearchType) =>
  createSelector(
    [selectSearchDatasetsInWorkspace, selectUserData, isGuestUser],
    (datasets, userData, guestUser) => {
      if (!userData || !datasets?.length) return
      const datasetsWithPermissions = datasets.filter((dataset) => {
        const permission = { type: 'dataset', value: dataset?.id, action: `${type}-search` }
        return checkExistPermissionInList(userData?.permissions, permission)
      })
      return filterDatasetsByUserType(datasetsWithPermissions, guestUser)
    }
  )

export const selectBasicSearchDatasets = createSelector(
  [selectSearchDatasets('basic')],
  (basicSearchDatasets) => {
    return basicSearchDatasets
  }
)

export const selectAdvancedSearchDatasets = createSelector(
  [selectSearchDatasets('advanced')],
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
