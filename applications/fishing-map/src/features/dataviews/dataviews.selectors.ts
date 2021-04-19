import { createSelector } from 'reselect'
import { EndpointId, DataviewInstance, DataviewCategory } from '@globalfishingwatch/api-types'
import {
  resolveDataviews,
  UrlDataviewInstance,
  mergeWorkspaceUrlDataviewInstances,
} from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { GeneratorType } from '@globalfishingwatch/layer-composer/dist/generators'
import { ThinningLevels, THINNING_LEVELS } from 'data/config'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectUrlDataviewInstances } from 'routes/routes.selectors'
import { selectDatasets } from 'features/datasets/datasets.slice'
import {
  selectWorkspaceStatus,
  selectWorkspaceDataviewInstances,
} from 'features/workspace/workspace.selectors'
import { GUEST_USER_TYPE, selectUserData } from 'features/user/user.slice'
import { selectAllDataviews } from './dataviews.slice'

export const isGuestUser = createSelector([selectUserData], (userData) => {
  return userData?.type === GUEST_USER_TYPE
})

export const selectDataviews = createSelector(
  [selectAllDataviews, isGuestUser, selectDebugOptions],
  (dataviews, guestUser, { thinning }) => {
    return dataviews
  }
)

export const selectDataviewInstancesMerged = createSelector(
  [selectWorkspaceStatus, selectWorkspaceDataviewInstances, selectUrlDataviewInstances],
  (
    workspaceStatus,
    workspaceDataviewInstances,
    urlDataviewInstances = []
  ): UrlDataviewInstance[] | undefined => {
    if (workspaceStatus !== AsyncReducerStatus.Finished) {
      return
    }
    const mergedDataviewInstances = mergeWorkspaceUrlDataviewInstances(
      workspaceDataviewInstances as DataviewInstance<any>[],
      urlDataviewInstances
    )
    return mergedDataviewInstances
  }
)

export const selectDataviewInstancesResolved = createSelector(
  [selectDataviewInstancesMerged, selectDataviews, selectDatasets],
  (dataviewInstances, dataviews, datasets): UrlDataviewInstance[] | undefined => {
    if (!dataviewInstances) return
    const dataviewInstancesResolved = resolveDataviews(dataviewInstances, dataviews, datasets)
    return dataviewInstancesResolved
  }
)

export const selectDataviewInstancesByType = (type: Generators.Type) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.config?.type === type)
  })
}

export const selectDataviewInstancesByCategory = (category: DataviewCategory) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.category === category)
  })
}

export const selectDataviewInstancesByIds = (ids: string[]) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => ids.includes(dataview.id))
  })
}

export const selectVesselsDataviews = createSelector(
  [selectDataviewInstancesByType(Generators.Type.Track)],
  (dataviews) => dataviews
)

export const selectActiveVesselsDataviews = createSelector([selectVesselsDataviews], (dataviews) =>
  dataviews?.filter((d) => d.config?.visible)
)

export const selectContextAreasDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Context)],
  (contextDataviews) => {
    return contextDataviews
  }
)

export const selectActivityDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Activity)],
  (dataviews) => dataviews
)

export const selectActiveActivityDataviews = createSelector(
  [selectActivityDataviews],
  (dataviews) => dataviews?.filter((d) => d.config?.visible)
)

export const selectEnvironmentalDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Environment)],
  (dataviews) => dataviews
)

export const selectHasAnalysisLayersVisible = createSelector(
  [selectActivityDataviews, selectEnvironmentalDataviews],
  (activityDataviews = [], environmentalDataviews = []) => {
    const heatmapEnvironmentalDataviews = environmentalDataviews?.filter(
      ({ config }) => config?.type === GeneratorType.HeatmapAnimated
    )
    const visibleDataviews = [...activityDataviews, ...heatmapEnvironmentalDataviews]?.filter(
      ({ config }) => config?.visible === true
    )
    return visibleDataviews && visibleDataviews.length > 0
  }
)

export const selectEventsDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Events)],
  (dataviews) => dataviews
)
