import { createSelector } from '@reduxjs/toolkit'

import type { Dataset, UserData } from '@globalfishingwatch/api-types'
import { checkExistPermissionInList } from '@globalfishingwatch/auth-middleware/utils'
import {
  getDatasetVersion,
  removeDatasetVersion,
  replaceDatasetPrivateToPublic,
} from '@globalfishingwatch/datasets-client'

import { PRIVATE_SUFIX, PUBLIC_SUFIX } from 'data/map/config'
import { selectVesselsDatasets } from 'features/_map/datasets/datasets.selectors'
import { selectAllDatasets, selectDeprecatedDatasets } from 'features/_map/datasets/datasets.slice'
import {
  filterDatasetsByUserType,
  getDatasetLabel,
  getDatasetsInDataviews,
} from 'features/_map/datasets/datasets.utils'
import { selectAllDataviewInstancesResolved } from 'features/_map/dataviews/selectors/dataviews.resolvers.selectors'
import { selectAllDataviewsInWorkspace } from 'features/_map/dataviews/selectors/dataviews.selectors'
import { getIsWorkspaceArchived } from 'features/_map/workspace/workspace.utils'
import { selectPrivateSearchDatasetIds } from 'features/_user/selectors/user.groups.selectors'
import { selectIsGuestUser, selectUserData } from 'features/_user/selectors/user.selectors'
import { isDatasetSearchFieldNeededSupported } from 'features/_vessels/search/advanced/advanced-search.utils'
import type { SearchType } from 'features/_vessels/search/search.config'
import { selectSearchSources } from 'features/_vessels/search/search.config.selectors'
import {
  DEFAULT_VESSEL_IDENTITY_DATASET,
  DEFAULT_VESSEL_IDENTITY_ID,
} from 'features/_vessels/vessel/vessel.config'
import { selectWorkspaceId } from 'router/routes.selectors'

const EMPTY_ARRAY: [] = []

const selectSearchDatasetsInWorkspace = createSelector(
  [
    selectAllDataviewsInWorkspace,
    selectAllDataviewInstancesResolved,
    selectVesselsDatasets,
    selectAllDatasets,
    selectPrivateSearchDatasetIds,
    selectSearchSources,
    selectDeprecatedDatasets,
    selectWorkspaceId,
  ],
  (
    dataviews,
    dataviewInstances = EMPTY_ARRAY,
    vesselsDatasets,
    allDatasets,
    privateSearchDatasetIds,
    searchSources,
    deprecatedDatasets,
    workspaceId
  ) => {
    const isArchivedWorkspace = !!workspaceId && getIsWorkspaceArchived({ id: workspaceId })
    // Archived (pipe 4) workspaces search only their own layers, as the default dataviews are
    // built for the current pipe. Any other workspace searches every dataset available: the
    // default dataviews plus the private datasets granted by permissions
    const datasetsIds = isArchivedWorkspace
      ? getDatasetsInDataviews(dataviewInstances)
      : [...getDatasetsInDataviews(dataviews), ...privateSearchDatasetIds]
    const datasets = allDatasets.flatMap(({ id, relatedDatasets }) => {
      if (!datasetsIds.includes(id)) return EMPTY_ARRAY
      return [id, ...(relatedDatasets || []).map((d) => d.id)]
    })
    // Private datasets granted by permissions replace their public version when it is in the workspace
    const workspaceDatasets = isArchivedWorkspace
      ? [
          ...datasets,
          ...privateSearchDatasetIds.filter((id) =>
            datasets.includes(replaceDatasetPrivateToPublic(id))
          ),
        ]
      : datasets
    // Archived workspaces search only v4 datasets. Their instances can inherit datasets from
    // dataviews built for the current pipe and would mix v5 identities into the request.
    // Anywhere else the global identity is searched only in the current pipe version, as v4
    // layers still list the v4 identity as a related dataset
    const searchDatasetsIds = isArchivedWorkspace
      ? workspaceDatasets.filter((id) => getDatasetVersion(id)?.startsWith('v4.'))
      : workspaceDatasets.filter(
          (id) =>
            removeDatasetVersion(id) !== DEFAULT_VESSEL_IDENTITY_DATASET ||
            id === DEFAULT_VESSEL_IDENTITY_ID
        )
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
