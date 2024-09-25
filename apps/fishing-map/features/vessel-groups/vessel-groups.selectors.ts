import { createSelector } from '@reduxjs/toolkit'
import { isAdvancedSearchAllowed } from 'features/search/search.selectors'
import { selectLocationQuery, selectUrlDataviewInstances } from 'routes/routes.selectors'
import { MAX_VESSEL_GROUP_VESSELS } from 'features/vessel-groups/vessel-groups-modal.slice'
import {
  selectLastVisitedWorkspace,
  selectWorkspace,
  selectWorkspaceDataviewInstances,
} from 'features/workspace/workspace.selectors'
import { selectHasUserGroupsPermissions } from 'features/user/selectors/user.permissions.selectors'
import { LastWorkspaceVisited } from 'features/workspace/workspace.slice'
import { WORKSPACE } from 'routes/routes'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { getVesselGroupsInDataviews } from 'features/datasets/datasets.utils'
import {
  selectNewVesselGroupSearchVessels,
  selectVesselGroupSearchVessels,
} from './vessel-groups-modal.slice'

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
  [selectHasUserGroupsPermissions, isAdvancedSearchAllowed],
  (hasUserGroupsPermissions, advancedSearchAllowed) => {
    return hasUserGroupsPermissions && advancedSearchAllowed
  }
)

export const selectWorkspaceVessselGroupsIds = createSelector(
  [selectWorkspaceDataviewInstances, selectUrlDataviewInstances],
  (workspaceDataviewInstances = [], urlDataviewInstances = []) => {
    return getVesselGroupsInDataviews([...workspaceDataviewInstances, ...urlDataviewInstances])
  }
)

export const selectVesselGroupWorkspaceToNavigate = createSelector(
  [selectLastVisitedWorkspace, selectWorkspace, selectLocationQuery],
  (lastVisitedWorkspace, workspace, query): LastWorkspaceVisited => {
    if (lastVisitedWorkspace) {
      return lastVisitedWorkspace
    }
    return {
      type: WORKSPACE,
      payload: {
        category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
        workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
      },
      query: query,
    }
  }
)

export const selectIsVessselGroupsFiltering = createSelector(
  [selectWorkspaceVessselGroupsIds],
  (workspaceVesselGroupIds = []) => {
    return workspaceVesselGroupIds.length > 0
  }
)
