import { createSelector } from '@reduxjs/toolkit'

import type { DataviewInstance } from '@globalfishingwatch/api-types'
import {
  mergeWorkspaceUrlDataviewInstances,
  type UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'

import { getIsInjectedDataview } from 'features/dataviews/selectors/dataviews.injected.selectors'
import {
  selectWorkspaceDataviewInstances,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { selectIsRouteWithWorkspace, selectUrlDataviewInstances } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

const EMPTY_ARRAY: [] = []

// To avoid circular dependencies this needs to be a different file
// as dataviews.resolver and dataview.injected selectors needs it
export const selectWorkspaceDataviewInstancesMerged = createSelector(
  [
    selectIsRouteWithWorkspace,
    selectWorkspaceStatus,
    selectWorkspaceDataviewInstances,
    selectUrlDataviewInstances,
  ],
  (
    isWorkspaceLocation,
    workspaceStatus,
    workspaceDataviewInstances,
    urlDataviewInstances = EMPTY_ARRAY
  ): UrlDataviewInstance[] | undefined => {
    if (isWorkspaceLocation && workspaceStatus !== AsyncReducerStatus.Finished) {
      return
    }
    // There was a bug where the windows.prompt asked to the user to save the workspace before leaving the page and
    // it was creating duplicated dataview instances because the injected dataviews were included into the saved workspace.
    // Later when the workspace is loaded, the injected dataviews are included again and this creates duplicated dataview instances.
    // To fix it there is a new injected flag into the dataview instance to avoid including them,
    // but this workaround is needed to discard already saved workspaces:
    const cleanWorkspaceDataviewInstances = workspaceDataviewInstances?.filter((d) => {
      return !getIsInjectedDataview(d)
    })
    const mergedDataviewInstances =
      mergeWorkspaceUrlDataviewInstances(
        cleanWorkspaceDataviewInstances as DataviewInstance<any>[],
        urlDataviewInstances
      ) || []

    return mergedDataviewInstances
  }
)
