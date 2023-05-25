import { createSelector } from '@reduxjs/toolkit'
import { selectActivityDatasets } from 'features/datasets/datasets.selectors'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { selectAllDataviewsInWorkspace } from 'features/dataviews/dataviews.selectors'
import { isAdvancedSearchAllowed } from 'features/search/search.selectors'
import { getDatasetsInDataviews } from 'features/datasets/datasets.utils'
import { selectUrlDataviewInstances } from 'routes/routes.selectors'
import {
  MAX_VESSEL_GROUP_VESSELS,
  selectNewVesselGroupSearchVessels,
  selectVesselGroupSearchVessels,
} from 'features/vessel-groups/vessel-groups.slice'
import { selectWorkspaceDataviewInstances } from 'features/workspace/workspace.selectors'
import { selectUserGroupsPermissions } from 'features/user/user.selectors'

export const selectAllVesselGroupSearchVessels = createSelector(
  [selectVesselGroupSearchVessels, selectNewVesselGroupSearchVessels],
  (vessels, newVessels) => {
    return [...(newVessels || []), ...(vessels || [])]
  }
)

export const selectHasVesselGroupVesselsOverflow = createSelector(
  [selectAllVesselGroupSearchVessels],
  (vessels = []) => {
    return vessels.length > MAX_VESSEL_GROUP_VESSELS
  }
)

export const selectHasVesselGroupSearchVessels = createSelector(
  [selectAllVesselGroupSearchVessels],
  (vessels = []) => {
    return vessels.length > 0
  }
)

export const selectVessselGroupsAllowed = createSelector(
  [selectUserGroupsPermissions, isAdvancedSearchAllowed],
  (hasUserGroupsPermissions, advancedSearchAllowed) => {
    return hasUserGroupsPermissions && advancedSearchAllowed
  }
)

export const selectWorkspaceVessselGroupsIds = createSelector(
  [selectWorkspaceDataviewInstances, selectUrlDataviewInstances],
  (workspaceDataviewInstances = [], urlDataviewInstances = []) => {
    return [...workspaceDataviewInstances, ...urlDataviewInstances].flatMap(
      (dvi) => dvi.config?.filters?.['vessel-groups'] || []
    )
  }
)

export const selectIsVessselGroupsFiltering = createSelector(
  [selectWorkspaceVessselGroupsIds],
  (workspaceVesselGroupIds = []) => {
    return workspaceVesselGroupIds.length > 0
  }
)

export const selectActivityDatasetsInWorkspace = createSelector(
  [selectAllDataviewsInWorkspace, selectActivityDatasets, selectAllDatasets],
  (dataviews, vesselsDatasets, allDatasets) => {
    const datasetsIds = getDatasetsInDataviews(dataviews)
    const datasets = allDatasets.flatMap(({ id, relatedDatasets }) => {
      if (!datasetsIds.includes(id)) return []
      return [id, ...(relatedDatasets || []).map((d) => d.id)]
    })
    return vesselsDatasets.filter((dataset) => datasets.includes(dataset.id))
  }
)
