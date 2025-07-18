import { createSelector } from '@reduxjs/toolkit'

import type { DataviewInstance } from '@globalfishingwatch/api-types'
import {
  mergeWorkspaceUrlDataviewInstances,
  type UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'

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
    const mergedDataviewInstances =
      mergeWorkspaceUrlDataviewInstances(
        workspaceDataviewInstances as DataviewInstance<any>[],
        urlDataviewInstances
      ) || []

    return mergedDataviewInstances
  }
)
