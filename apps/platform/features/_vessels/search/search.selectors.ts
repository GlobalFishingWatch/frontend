import { createSelector } from '@reduxjs/toolkit'

import type { Dataset, UserData } from '@globalfishingwatch/api-types'
import { checkExistPermissionInList } from '@globalfishingwatch/auth-middleware/utils'

import { PRIVATE_SUFIX, PUBLIC_SUFIX } from 'data/map/config'
import { PIPE_5_WORKSPACE_ID } from 'data/map/workspaces'
import { selectVesselsDatasets } from 'features/_map/datasets/datasets.selectors'
import { selectAllDatasets, selectDeprecatedDatasets } from 'features/_map/datasets/datasets.slice'
import {
  filterDatasetsByUserType,
  getDatasetLabel,
  getDatasetsInDataviews,
} from 'features/_map/datasets/datasets.utils'
import { selectAllDataviewsInWorkspace } from 'features/_map/dataviews/selectors/dataviews.selectors'
import { selectPrivateUserGroups } from 'features/_user/selectors/user.groups.selectors'
import { selectIsGuestUser, selectUserData } from 'features/_user/selectors/user.selectors'
import { PRIVATE_SEARCH_DATASET_BY_GROUP } from 'features/_user/user.config'
import { isDatasetSearchFieldNeededSupported } from 'features/_vessels/search/advanced/advanced-search.utils'
import type { SearchType } from 'features/_vessels/search/search.config'
import { selectSearchSources } from 'features/_vessels/search/search.config.selectors'
import {
  DEFAULT_VESSEL_IDENTITY_ID,
  VESSEL_IDENTITY_ID_V5,
} from 'features/_vessels/vessel/vessel.config'
import { selectWorkspaceId } from 'router/routes.selectors'

const EMPTY_ARRAY: [] = []

const selectSearchDatasetsInWorkspace = createSelector(
  [
    selectAllDataviewsInWorkspace,
    selectVesselsDatasets,
    selectAllDatasets,
    selectPrivateUserGroups,
    selectSearchSources,
    selectDeprecatedDatasets,
    selectWorkspaceId,
  ],
  (
    dataviews,
    vesselsDatasets,
    allDatasets,
    privateUserGroups,
    searchSources,
    deprecatedDatasets,
    workspaceId
  ) => {
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
    // In the pipe 5 workspace the vessel identity dataset is searched in its v5 version
    const searchDatasetsIds =
      workspaceId === PIPE_5_WORKSPACE_ID
        ? datasets.map((id) => (id === DEFAULT_VESSEL_IDENTITY_ID ? VESSEL_IDENTITY_ID_V5 : id))
        : datasets
    const filteredDatasets = vesselsDatasets.filter((dataset) =>
      searchDatasetsIds.includes(dataset.id)
    )

    // Remove public-... datasets if a corresponding private-... dataset exists
    const privateDatasetsIds = filteredDatasets.flatMap((d) =>
      d.id.startsWith(PRIVATE_SUFIX) ? [d.id] : []
    )
    const filteredDatasetsPrioritised = filteredDatasets.filter((d) => {
      if (deprecatedDatasets[d.id]) {
        return false
      }
      if (d.id.startsWith(PUBLIC_SUFIX) && !searchSources?.includes(d.id)) {
        return !privateDatasetsIds.includes(d.id.replace(PUBLIC_SUFIX, PRIVATE_SUFIX))
      }
      return true
    })
    return filteredDatasetsPrioritised
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
