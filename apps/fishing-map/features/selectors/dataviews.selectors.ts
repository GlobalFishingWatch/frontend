import { createSelector } from '@reduxjs/toolkit'
import {
  DatasetConfigsTransforms,
  getDataviewsForResourceQuerying,
  mergeWorkspaceUrlDataviewInstances,
  resolveDataviews,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { DatasetTypes, DataviewCategory, DataviewInstance } from '@globalfishingwatch/api-types'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import {
  selectWorkspaceDataviewInstances,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { selectUrlDataviewInstances } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { selectThinningConfig } from 'features/selectors/resources.selectors'
import { selectWorkspaceStateProperty } from 'features/selectors/app.selectors'
import { TimebarGraphs } from 'types'
import { hasDatasetConfigVesselData } from 'features/datasets/datasets.utils'
import { isActivityDataview } from 'features/workspace/activity/activity.utils'

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

export const selectAllDataviewInstancesResolved = createSelector(
  [selectDataviewInstancesMerged, selectAllDataviews, selectAllDatasets],
  (dataviewInstances, dataviews, datasets): UrlDataviewInstance[] | undefined => {
    if (!dataviewInstances) return
    const dataviewInstancesResolved = resolveDataviews(dataviewInstances, dataviews, datasets)
    return dataviewInstancesResolved
  }
)

/**
 * Calls getDataviewsForResourceQuerying to prepare track dataviews' datasetConfigs.
 * Injects app-specific logic by using getDataviewsForResourceQuerying's callback
 */
export const selectDataviewsForResourceQuerying = createSelector(
  [
    selectAllDataviewInstancesResolved,
    selectThinningConfig,
    selectWorkspaceStateProperty('timebarGraph'),
  ],
  (dataviewInstances, thinningConfig, timebarGraph) => {
    const datasetConfigsTransforms: DatasetConfigsTransforms = {
      [GeneratorType.Track]: ([info, track, ...events]) => {
        const trackWithThinning = track
        if (thinningConfig) {
          const thinningQuery = Object.entries(thinningConfig).map(([id, value]) => ({
            id,
            value,
          }))
          trackWithThinning.query = [...(track.query || []), ...thinningQuery]
        }

        const trackWithoutSpeed = trackWithThinning
        const query = [...(trackWithoutSpeed.query || [])]
        const fieldsQueryIndex = query.findIndex((q) => q.id === 'fields')
        let trackGraph
        if (timebarGraph !== TimebarGraphs.None) {
          trackGraph = { ...trackWithoutSpeed }
          const fieldsQuery = {
            id: 'fields',
            value: timebarGraph,
          }
          if (fieldsQueryIndex > -1) {
            query[fieldsQueryIndex] = fieldsQuery
            trackGraph.query = query
          } else {
            trackGraph.query = [...query, fieldsQuery]
          }
        }

        // Clean resources when mandatory vesselId is missing
        // needed for vessels with no info datasets (zebraX)
        const vesselData = hasDatasetConfigVesselData(info)
        return [
          trackWithoutSpeed,
          ...events,
          ...(vesselData ? [info] : []),
          ...(trackGraph ? [trackGraph] : []),
        ]
      },
    }
    return getDataviewsForResourceQuerying(dataviewInstances || [], datasetConfigsTransforms)
  }
)

export const selectDataviewInstancesResolved = createSelector(
  [selectDataviewsForResourceQuerying, selectWorkspaceStateProperty('activityCategory')],
  (dataviews = [], activityCategory) => {
    return dataviews.filter((dataview) => {
      const activityDataview = isActivityDataview(dataview)
      return activityDataview ? dataview.category === activityCategory : true
    })
  }
)
export const selectDataviewInstancesByType = (type: GeneratorType) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.config?.type === type)
  })
}

export const selectTrackDataviews = createSelector(
  [selectDataviewInstancesByType(GeneratorType.Track)],
  (dataviews) => dataviews
)

export const selectVesselsDataviews = createSelector([selectTrackDataviews], (dataviews) => {
  return dataviews?.filter(
    (dataview) =>
      !dataview.datasets ||
      (dataview.datasets?.[0]?.type !== DatasetTypes.UserTracks &&
        dataview.category === DataviewCategory.Vessels)
  )
})

export const selectActiveVesselsDataviews = createSelector([selectVesselsDataviews], (dataviews) =>
  dataviews?.filter((d) => d.config?.visible)
)

export const selectActiveTrackDataviews = createSelector([selectTrackDataviews], (dataviews) =>
  dataviews?.filter((d) => d.config?.visible)
)
