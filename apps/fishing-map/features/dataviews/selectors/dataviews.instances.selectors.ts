import { createSelector } from '@reduxjs/toolkit'
import {
  DatasetTypes,
  DataviewCategory,
  DataviewType,
  DataviewDatasetConfig,
  DataviewInstance,
} from '@globalfishingwatch/api-types'
import {
  extendDataviewDatasetConfig,
  GetDatasetConfigsCallbacks,
  getResources,
  mergeWorkspaceUrlDataviewInstances,
  resolveDataviews,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { VESSEL_PROFILE_DATAVIEWS_INSTANCES } from 'data/default-workspaces/context-layers'
import { selectAllDatasets, selectDeprecatedDatasets } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import {
  getVesselDataviewInstance,
  getVesselDataviewInstanceDatasetConfig,
  VESSEL_DATAVIEW_INSTANCE_PREFIX,
} from 'features/dataviews/dataviews.utils'
import { selectTrackThinningConfig } from 'features/resources/resources.selectors.thinning'
import { infoDatasetConfigsCallback } from 'features/resources/resources.utils'
import { selectIsGuestUser, selectUserLogged } from 'features/user/selectors/user.selectors'
import { selectViewOnlyVessel } from 'features/vessel/vessel.config.selectors'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import { getRelatedIdentityVesselIds } from 'features/vessel/vessel.utils'
import {
  selectWorkspaceDataviewInstances,
  selectWorkspaceStateProperty,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import {
  selectIsWorkspaceLocation,
  selectUrlDataviewInstances,
  selectIsAnyVesselLocation,
  selectIsVesselLocation,
  selectVesselId,
  selectUrlDataviewInstancesOrder,
} from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { createDeepEqualSelector } from 'utils/selectors'

const EMPTY_ARRAY: [] = []

export const selectDataviewInstancesMerged = createSelector(
  [
    selectIsWorkspaceLocation,
    selectWorkspaceStatus,
    selectWorkspaceDataviewInstances,
    selectUrlDataviewInstances,
    selectIsAnyVesselLocation,
    selectIsVesselLocation,
    selectVesselId,
    selectVesselInfoData,
  ],
  (
    isWorkspaceLocation,
    workspaceStatus,
    workspaceDataviewInstances,
    urlDataviewInstances = EMPTY_ARRAY,
    isAnyVesselLocation,
    isVesselLocation,
    urlVesselId,
    vessel
  ): UrlDataviewInstance[] | undefined => {
    if (isWorkspaceLocation && workspaceStatus !== AsyncReducerStatus.Finished) {
      return
    }
    const mergedDataviewInstances =
      mergeWorkspaceUrlDataviewInstances(
        workspaceDataviewInstances as DataviewInstance<any>[],
        urlDataviewInstances
      ) || []

    if (isAnyVesselLocation) {
      const existingDataviewInstance = mergedDataviewInstances?.find(
        ({ id }) => urlVesselId && id.includes(urlVesselId)
      )
      if (!existingDataviewInstance && vessel?.identities) {
        const vesselDatasets = {
          info: vessel.info,
          track: vessel.track,
          ...(vessel?.events?.length && {
            events: vessel?.events,
          }),
          relatedVesselIds: getRelatedIdentityVesselIds(vessel),
        }

        const dataviewInstance = getVesselDataviewInstance({ id: urlVesselId }, vesselDatasets)
        const datasetsConfig: DataviewDatasetConfig[] = getVesselDataviewInstanceDatasetConfig(
          urlVesselId,
          vesselDatasets
        )
        mergedDataviewInstances.push({ ...dataviewInstance, datasetsConfig })
      }
      if (isVesselLocation) {
        VESSEL_PROFILE_DATAVIEWS_INSTANCES.forEach((dataviewInstance) => {
          if (!mergedDataviewInstances.find(({ id }) => id === dataviewInstance.id)) {
            mergedDataviewInstances.push({ ...dataviewInstance })
          }
        })
      }
    }
    return mergedDataviewInstances
  }
)

export const selectDataviewInstancesMergedOrdered = createSelector(
  [selectDataviewInstancesMerged, selectUrlDataviewInstancesOrder],
  (dataviewInstances = [], dataviewInstancesOrder): UrlDataviewInstance[] => {
    if (!dataviewInstancesOrder || !dataviewInstancesOrder.length) {
      return dataviewInstances
    }
    const dataviewInstancesOrdered = dataviewInstances.sort(
      (a, b) => dataviewInstancesOrder.indexOf(a.id) - dataviewInstancesOrder.indexOf(b.id)
    )
    return [...dataviewInstancesOrdered]
  }
)

export const selectTimebarGraphSelector = selectWorkspaceStateProperty('timebarGraph')

export const selectAllDataviewInstancesResolved = createSelector(
  [
    selectDataviewInstancesMergedOrdered,
    selectAllDataviews,
    selectAllDatasets,
    selectUserLogged,
    selectTrackThinningConfig,
    selectIsGuestUser,
  ],
  (
    dataviewInstances,
    dataviews,
    datasets,
    loggedUser,
    trackThinningZoomConfig,
    guestUser
  ): UrlDataviewInstance[] | undefined => {
    if (!dataviews?.length || !datasets?.length || !dataviewInstances?.length) {
      return EMPTY_ARRAY
    }
    const dataviewInstancesWithDatasetConfig = dataviewInstances.map((dataviewInstance) => {
      if (
        dataviewInstance.id?.startsWith(VESSEL_DATAVIEW_INSTANCE_PREFIX) &&
        !dataviewInstance.datasetsConfig?.length &&
        dataviewInstance.config?.info
      ) {
        const vesselId = dataviewInstance.id.split(VESSEL_DATAVIEW_INSTANCE_PREFIX)[1]
        // New way to resolve datasetConfig for vessels to avoid storing all
        // the datasetConfig in the instance and save url string characters
        const config = { ...dataviewInstance.config }
        // Vessel pined from not logged user but is logged now and the related dataset is available
        if (loggedUser && !config.track) {
          const dataset = datasets.find((d) => d.id === config.info)
          const trackDatasetId = getRelatedDatasetByType(dataset, DatasetTypes.Tracks)?.id
          if (trackDatasetId) {
            config.track = trackDatasetId
          }
        }
        const datasetsConfig: DataviewDatasetConfig[] = getVesselDataviewInstanceDatasetConfig(
          vesselId,
          config
        )
        return {
          ...dataviewInstance,
          config: {
            ...dataviewInstance.config,
            trackThinningZoomConfig,
          },
          datasetsConfig,
        }
      }
      return dataviewInstance
    })
    const dataviewInstancesResolved = resolveDataviews(
      dataviewInstancesWithDatasetConfig,
      dataviews,
      datasets
    )
    const callbacks: GetDatasetConfigsCallbacks = {
      info: infoDatasetConfigsCallback(guestUser),
    }
    const dataviewInstancesResolvedExtended = extendDataviewDatasetConfig(
      dataviewInstancesResolved,
      callbacks
    )
    return dataviewInstancesResolvedExtended
  }
)
/**
 * Calls getResources to prepare track dataviews' datasetConfigs.
 * Injects app-specific logic by using getResources's callback
 */
export const selectDataviewsResources = createSelector(
  [selectAllDataviewInstancesResolved],
  (dataviewInstances) => {
    return getResources(dataviewInstances || [])
  }
)

const defaultDataviewResolved: UrlDataviewInstance[] = []
export const selectDataviewInstancesResolved = createSelector(
  [selectDataviewsResources],
  (dataviewsResources) => {
    return dataviewsResources.dataviews || defaultDataviewResolved
  }
)

export const selectActiveDataviewInstancesResolved = createSelector(
  [selectDataviewInstancesResolved],
  (dataviewInstances) => {
    return dataviewInstances.filter((d) => d.config?.visible)
  }
)

const selectDataviewInstancesByType = (type: DataviewType) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.config?.type === type)
  })
}

export const selectTrackDataviews = selectDataviewInstancesByType(DataviewType.Track)

export const selectAllActiveTrackDataviews = createSelector([selectTrackDataviews], (dataviews) =>
  dataviews?.filter((d) => d.config?.visible)
)

export const selectUserTrackDataviews = createSelector([selectTrackDataviews], (dataviews) => {
  return dataviews?.filter(
    (dataview) =>
      !dataview.datasets ||
      (dataview.datasets?.[0]?.type === DatasetTypes.UserTracks &&
        dataview.category === DataviewCategory.User)
  )
})

export const selectActiveUserTrackDataviews = createSelector(
  [selectUserTrackDataviews],
  (dataviews) => dataviews?.filter((d) => d.config?.visible)
)

export const selectVesselsDataviews = createSelector([selectTrackDataviews], (dataviews) => {
  return dataviews?.filter(
    (dataview) =>
      !dataview.datasets ||
      (dataview.datasets?.[0]?.type !== DatasetTypes.UserTracks &&
        dataview.category === DataviewCategory.Vessels)
  )
})

export const selectActiveVesselsDataviews = createDeepEqualSelector(
  [selectVesselsDataviews],
  (dataviews) => dataviews?.filter((d) => d.config?.visible)
)

export const selectVesselProfileDataview = createDeepEqualSelector(
  [selectVesselsDataviews, selectVesselId],
  (dataviews, vesselId) => dataviews.find(({ id }) => vesselId && id.includes(vesselId))
)

export const selectVesselProfileColor = createSelector(
  [selectVesselProfileDataview],
  (dataview) => dataview?.config?.color
)

export const selectActiveTrackDataviews = createDeepEqualSelector(
  [selectTrackDataviews, selectIsAnyVesselLocation, selectViewOnlyVessel, selectVesselId],
  (dataviews, isVesselLocation, viewOnlyVessel, vesselId) => {
    return dataviews?.filter(({ config, id }) => {
      if (isVesselLocation && viewOnlyVessel) {
        return id === `${VESSEL_DATAVIEW_INSTANCE_PREFIX}${vesselId}` && config?.visible
      }
      return config?.visible
    })
  }
)

export const selectDeprecatedDataviewInstances = createSelector(
  [selectAllDataviewInstancesResolved, selectDeprecatedDatasets],
  (dataviews, deprecatedDatasets = {}) => {
    return dataviews?.filter(({ datasetsConfig, config }) => {
      const hasDatasetsDeprecated =
        datasetsConfig?.some((datasetConfig) => deprecatedDatasets[datasetConfig.datasetId]) ||
        false
      const hasConfigDeprecated = config?.datasets
        ? config.datasets.some((d) => deprecatedDatasets[d])
        : false
      return hasDatasetsDeprecated || hasConfigDeprecated
    })
  }
)

export const selectHasDeprecatedDataviewInstances = createSelector(
  [selectDeprecatedDataviewInstances],
  (deprecatedDataviews) => {
    return deprecatedDataviews && deprecatedDataviews.length > 0
  }
)
