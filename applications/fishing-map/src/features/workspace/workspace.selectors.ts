import { createSelector } from '@reduxjs/toolkit'
import uniqBy from 'lodash/uniqBy'
import { Generators } from '@globalfishingwatch/layer-composer'
import {
  Dataset,
  DatasetTypes,
  DataviewCategory,
  DataviewInstance,
} from '@globalfishingwatch/api-types'
import {
  resolveDataviews,
  UrlDataviewInstance,
  mergeWorkspaceUrlDataviewInstances,
} from '@globalfishingwatch/dataviews-client'
import { WorkspaceState } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectDatasets } from 'features/datasets/datasets.slice'
import { selectDataviews } from 'features/dataviews/dataviews.slice'
import { selectUrlDataviewInstances } from 'routes/routes.selectors'
import { RootState } from 'store'
import { PUBLIC_SUFIX } from 'data/config'

export const getDatasetsByDataview = (dataview: UrlDataviewInstance) =>
  Object.entries(dataview.datasetsConfig || {}).flatMap(([id, value]) => {
    const dataset = dataview.datasets?.find((dataset) => dataset.id === id)
    if (!dataset) return []
    return {
      id,
      label: dataset.name,
    }
  })

export const selectWorkspace = (state: RootState) => state.workspace.data
export const selectWorkspaceStatus = (state: RootState) => state.workspace.status
export const selectWorkspaceCustomStatus = (state: RootState) => state.workspace.customStatus
export const selectWorkspaceError = (state: RootState) => state.workspace.error

export const isWorkspacePublic = createSelector([selectWorkspace], (workspace) => {
  return workspace?.id.slice(-PUBLIC_SUFIX.length) === PUBLIC_SUFIX
})

export const selectCurrentWorkspaceId = createSelector([selectWorkspace], (workspace) => {
  return workspace?.id
})

export const selectWorkspaceViewport = createSelector([selectWorkspace], (workspace) => {
  return workspace?.viewport
})

export const selectWorkspaceTimeRange = createSelector([selectWorkspace], (workspace) => {
  return {
    start: workspace?.startAt,
    end: workspace?.endAt,
  }
})

export const selectWorkspaceDataviewInstances = createSelector([selectWorkspace], (workspace) => {
  return workspace?.dataviewInstances
})

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

export const selectWorkspaceState = createSelector(
  [selectWorkspace],
  (workspace): WorkspaceState => {
    return workspace?.state || ({} as WorkspaceState)
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

export const selectDatasetsByType = (type: DatasetTypes) => {
  return createSelector([selectDatasets], (datasets) => {
    return uniqBy(
      datasets.flatMap((dataset) => {
        if (dataset.type === type) return dataset
        const relatedDatasetId = dataset.relatedDatasets?.find(
          (relatedDataset) => relatedDataset.type === type
        )?.id
        if (!relatedDatasetId) return []
        const relatedDataset = datasets.find((dataset) => dataset.id === relatedDatasetId)
        return relatedDataset || []
      }),
      'id'
    )
  })
}

export const selectVesselsDatasets = createSelector(
  [selectDatasetsByType(DatasetTypes.Vessels)],
  (datasets) => {
    return datasets
  }
)
export const selectTracksDatasets = createSelector(
  [selectDatasetsByType(DatasetTypes.Tracks)],
  (datasets) => {
    return datasets
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

export const selectEnvironmentalDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Environment)],
  (dataviews) => dataviews
)

export const selectEventsDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Events)],
  (dataviews) => dataviews
)

export const selectTemporalgridDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Activity)],
  (dataviews) => dataviews
)

export const selectHasAnalysisLayersVisible = createSelector(
  [selectTemporalgridDataviews],
  (dataviews) => {
    const visibleDataviews = dataviews?.filter(({ config }) => config?.visible === true)
    return visibleDataviews && visibleDataviews.length > 0
  }
)

export const selectActiveTemporalgridDataviews = createSelector(
  [selectTemporalgridDataviews],
  (dataviews) => dataviews?.filter((d) => d.config?.visible)
)

export const selectTemporalgridDatasets = createSelector(
  [selectTemporalgridDataviews],
  (dataviews) => {
    if (!dataviews) return

    return dataviews.flatMap((dataview) => getDatasetsByDataview(dataview))
  }
)

export const getRelatedDatasetByType = (dataset?: Dataset, datasetType?: DatasetTypes) => {
  return dataset?.relatedDatasets?.find((relatedDataset) => relatedDataset.type === datasetType)
}
