import { createSelector } from '@reduxjs/toolkit'
import { uniqBy } from 'es-toolkit'

import type { VesselGroup } from '@globalfishingwatch/api-types'

import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import { getVesselGroupsInDataviews } from 'features/datasets/datasets.utils'
import { selectActiveVesselGroupDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectActiveActivityAndDetectionsDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { getVesselDatasetsWithoutEventsRelated } from 'features/reports/vessel-groups/vessels/vessel-group-report-vessels.selectors'
import { isAdvancedSearchAllowed } from 'features/search/search.selectors'
import { selectUserId } from 'features/user/selectors/user.permissions.selectors'
import { getVesselGroupVesselsCount } from 'features/vessel-groups/vessel-groups.utils'
import {
  MAX_VESSEL_GROUP_VESSELS,
 selectVesselGroupModalVessels,  selectVesselGroupsModalSearchText } from 'features/vessel-groups/vessel-groups-modal.slice'
import {
  selectLastVisitedWorkspace,
  selectWorkspace,
  selectWorkspaceDataviewInstances,
} from 'features/workspace/workspace.selectors'
import type { LastWorkspaceVisited } from 'features/workspace/workspace.slice'
import { WORKSPACE } from 'routes/routes'
import { selectLocationQuery, selectUrlDataviewInstances } from 'routes/routes.selectors'

import { selectAllVesselGroups } from './vessel-groups.slice'

export const selectVesselGroupsModalSearchIds = createSelector(
  [selectVesselGroupsModalSearchText],
  (text) => {
    if (!text) {
      return []
    }
    return text?.split(/[\s|,]+/).filter(Boolean)
  }
)

export const selectHasVesselGroupVesselsOverflow = createSelector(
  [selectVesselGroupModalVessels],
  (vessels = []) => {
    return (
      vessels !== null &&
      getVesselGroupVesselsCount({ vessels } as VesselGroup) > MAX_VESSEL_GROUP_VESSELS
    )
  }
)

export const selectHasVesselGroupSearchVessels = createSelector(
  [selectVesselGroupModalVessels],
  (vessels = []) => {
    return vessels !== null && vessels.length > 0
  }
)

export const selectVessselGroupsAllowed = createSelector(
  [isAdvancedSearchAllowed],
  (advancedSearchAllowed) => {
    return advancedSearchAllowed
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
  [selectActiveActivityAndDetectionsDataviews, selectActiveVesselGroupDataviews],
  (activeActivityAndDetectionsDataviews, activeVesselGroupDataviews = []) => {
    return (
      [
        ...getVesselGroupsInDataviews(activeActivityAndDetectionsDataviews),
        ...activeVesselGroupDataviews,
      ].length > 0
    )
  }
)

export const selectVesselGroupModalDatasetsWithoutEventsRelated = createSelector(
  [selectVesselGroupModalVessels, selectVesselsDatasets],
  (vessels = [], vesselDatasets) => {
    return getVesselDatasetsWithoutEventsRelated(vessels, vesselDatasets)
  }
)

export const selectUserVesselGroups = createSelector(
  [selectAllVesselGroups, selectUserId],
  (vesselGroups, userId) => {
    return vesselGroups?.filter((d) => d.ownerId === userId)
  }
)

export const selectWorkspaceVesselGroups = createSelector(
  [selectAllVesselGroups, selectWorkspaceVessselGroupsIds],
  (vesselGroups, workspaceVesselGroupsIds) => {
    return vesselGroups?.filter((d) => workspaceVesselGroupsIds.includes(d.id))
  }
)

export const selectAllVisibleVesselGroups = createSelector(
  [selectAllVesselGroups, selectWorkspaceVesselGroups],
  (userVesselGroups = [], workspaceVesselGroups = []) => {
    return uniqBy([...userVesselGroups, ...workspaceVesselGroups], (v) => v.id)
  }
)
