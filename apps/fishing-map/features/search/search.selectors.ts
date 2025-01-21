import { createSelector } from '@reduxjs/toolkit'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'

import type { Dataset, UserData } from '@globalfishingwatch/api-types'

import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import {
  filterDatasetsByUserType,
  getDatasetLabel,
  getDatasetsInDataviews,
} from 'features/datasets/datasets.utils'
import { selectAllDataviewsInWorkspace } from 'features/dataviews/selectors/dataviews.selectors'
import { isDatasetSearchFieldNeededSupported } from 'features/search/advanced/advanced-search.utils'
import type { SearchType } from 'features/search/search.config'
import { selectPrivateUserGroups } from 'features/user/selectors/user.groups.selectors'
import { selectIsGuestUser,selectUserData } from 'features/user/selectors/user.selectors'
import { PRIVATE_SEARCH_DATASET_BY_GROUP } from 'features/user/user.config'

const EMPTY_ARRAY: [] = []

const selectSearchDatasetsInWorkspace = createSelector(
  [
    selectAllDataviewsInWorkspace,
    selectVesselsDatasets,
    selectAllDatasets,
    selectPrivateUserGroups,
  ],
  (dataviews, vesselsDatasets, allDatasets, privateUserGroups) => {
    const datasetsIds = [
      ...getDatasetsInDataviews(dataviews),
      ...privateUserGroups.flatMap((group) => {
        return PRIVATE_SEARCH_DATASET_BY_GROUP[group] || []
      }),
    ]
    const datasets = allDatasets.flatMap(({ id, relatedDatasets }) => {
      if (!datasetsIds.includes(id)) return EMPTY_ARRAY
      return [id, ...(relatedDatasets || []).map((d) => d.id)]
    })
    return vesselsDatasets.filter((dataset) => datasets.includes(dataset.id))
  }
)

const filterDatasetByPermissions = (
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

function selectSearchDatasetsInWorkspaceByType(type: SearchType) {
  return createSelector(
    [selectSearchDatasetsInWorkspace, selectUserData, selectIsGuestUser],
    (datasets, userData, guestUser): Dataset[] => {
      if (!userData || !datasets?.length) return EMPTY_ARRAY
      // This is needed to ensure we allow searching in datasets with the minimum fields needed
      const datasetsWithShipname = datasets.filter((dataset) =>
        isDatasetSearchFieldNeededSupported(dataset)
      )
      return filterDatasetByPermissions(datasetsWithShipname, type, userData, guestUser)
    }
  )
}

export const selectBasicSearchDatasets = selectSearchDatasetsInWorkspaceByType('basic')
export const selectAdvancedSearchDatasets = selectSearchDatasetsInWorkspaceByType('advanced')

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

const selectSearchDatasetsNotGuestAllowed = createSelector(
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
