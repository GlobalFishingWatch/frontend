import { createSelector } from '@reduxjs/toolkit'
import { uniqBy } from 'es-toolkit'

import type { DataviewDatasetConfig, IdentityVessel, Resource } from '@globalfishingwatch/api-types'
import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { getRelatedDatasetByType } from '@globalfishingwatch/datasets-client'
import type {
  GetDatasetConfigsCallbacks,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import {
  extendDataviewDatasetConfig,
  getResources,
  resolveDataviewDatasetResource,
  resolveDataviews,
  selectResources,
} from '@globalfishingwatch/dataviews-client'

import { selectAllDatasets, selectDeprecatedDatasets } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import {
  getIsVesselDataviewInstanceId,
  getVesselDataviewInstanceDatasetConfig,
  getVesselIdFromInstanceId,
  isDataviewDeprecated,
} from 'features/dataviews/dataviews.utils'
import { selectDataviewInstancesInjected } from 'features/dataviews/selectors/dataviews.injected.selectors'
import { selectWorkspaceDataviewInstancesMerged } from 'features/dataviews/selectors/dataviews.merged.selectors'
import { FAKE_VESSEL_NAME, selectDebugOptions } from 'features/debug/debug.slice'
import { selectTrackThinningConfig } from 'features/resources/resources.selectors.thinning'
import { infoDatasetConfigsCallback } from 'features/resources/resources.utils'
import { selectHighlightedTime } from 'features/timebar/timebar.slice'
import {
  selectTrackCorrectionTimerange,
  selectTrackCorrectionVesselDataviewId,
} from 'features/track-correction/track-correction.slice'
import { selectIsGuestUser, selectUserLogged } from 'features/user/selectors/user.selectors'
import { selectCurrentVesselEvent } from 'features/vessel/selectors/vessel.selectors'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { selectAllVesselGroups } from 'features/vessel-groups/vessel-groups.slice'
import {
  selectIsAnyVesselLocation,
  selectTrackCorrectionId,
  selectUrlDataviewInstancesOrder,
} from 'routes/routes.selectors'
import { formatInfoField } from 'utils/info'
import { createDeepEqualSelector } from 'utils/selectors'

const EMPTY_ARRAY: [] = []

export const selectDataviewInstancesMerged = createDeepEqualSelector(
  [selectWorkspaceDataviewInstancesMerged, selectDataviewInstancesInjected],
  (
    dataviewInstances = EMPTY_ARRAY,
    injectedDataviewInstances = EMPTY_ARRAY
  ): UrlDataviewInstance[] | undefined => {
    return [...dataviewInstances, ...injectedDataviewInstances]
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

export const selectAllDataviewInstancesResolved = createSelector(
  [
    selectDataviewInstancesMergedOrdered,
    selectAllDataviews,
    selectAllDatasets,
    selectAllVesselGroups,
    selectUserLogged,
    selectTrackThinningConfig,
    selectIsGuestUser,
    selectTrackCorrectionVesselDataviewId,
    selectTrackCorrectionId,
    selectHighlightedTime,
    selectTrackCorrectionTimerange,
    selectDeprecatedDatasets,
  ],
  (
    dataviewInstances,
    dataviews,
    datasets,
    vesselGroups,
    loggedUser,
    trackThinningZoomConfig,
    guestUser,
    trackCorrectionVesselDataviewId,
    trackCorrectionId,
    highlightedTime,
    trackCorrectionTimerange,
    deprecatedDatasets
  ): UrlDataviewInstance[] | undefined => {
    if (!dataviews?.length || !datasets?.length || !dataviewInstances?.length) {
      return EMPTY_ARRAY
    }

    const dataviewInstancesWithDatasetConfig = dataviewInstances.map((dataviewInstance) => {
      if (dataviewInstance && getIsVesselDataviewInstanceId(dataviewInstance.id)) {
        const vesselId = getVesselIdFromInstanceId(dataviewInstance.id)
        // New way to resolve datasetConfig for vessels to avoid storing all
        // the datasetConfig in the instance and save url string characters
        const config = { ...dataviewInstance.config }
        // Vessel pined from not logged user but is logged now and the related dataset is available
        if (loggedUser && !config.track && config.info) {
          const dataset = datasets.find((d) => d.id === config.info)
          const trackDatasetId = getRelatedDatasetByType(dataset, DatasetTypes.Tracks)?.id
          if (trackDatasetId) {
            config.track = trackDatasetId
          }
        }
        const newDataviewInstance = {
          ...dataviewInstance,
          config: {
            ...dataviewInstance.config,
            ...(trackThinningZoomConfig && {
              trackThinningZoomConfig,
            }),
          },
        }
        if (!dataviewInstance.datasetsConfig?.length) {
          const datasetsConfig: DataviewDatasetConfig[] = getVesselDataviewInstanceDatasetConfig(
            vesselId,
            config
          )
          newDataviewInstance.datasetsConfig = datasetsConfig
        }
        return newDataviewInstance
      }
      return dataviewInstance
    })

    const dataviewInstancesResolved = resolveDataviews(
      dataviewInstancesWithDatasetConfig,
      dataviews,
      datasets,
      vesselGroups
    )
    const dataviewInstancesResolvedWithConfigInjected = dataviewInstancesResolved.map(
      (dataview) => {
        if (dataview.id === trackCorrectionVesselDataviewId) {
          return {
            ...dataview,
            config: {
              ...(dataview.config || {}),
              highlightStartTime: trackCorrectionTimerange.start,
              highlightEndTime: trackCorrectionTimerange.end,
              showVesselIcon: false,
              ...(trackCorrectionId !== 'new' &&
                highlightedTime && {
                  highlightStartTime: highlightedTime.start,
                  highlightEndTime: highlightedTime.end,
                  showVesselIcon: true,
                }),
            },
          }
        }
        return dataview
      }
    )
    const callbacks: GetDatasetConfigsCallbacks = {
      info: infoDatasetConfigsCallback(guestUser),
    }
    const dataviewInstancesResolvedExtended = extendDataviewDatasetConfig(
      dataviewInstancesResolvedWithConfigInjected,
      callbacks
    )
    const dataviewInstancesResolvedExtendedUniq = uniqBy(
      dataviewInstancesResolvedExtended,
      (d) => d.id
    )
    if (dataviewInstancesResolvedExtendedUniq.length !== dataviewInstancesResolvedExtended.length) {
      console.warn(
        'Duplicated dataview instance ids:',
        dataviewInstancesResolvedExtended
          .filter((d, index, self) => self.findIndex((t) => t.id === d.id) !== index)
          .map((d) => d.id)
          .join(', '),
        dataviewInstancesResolvedExtended
      )
    }
    const dataviewInstancesResolvedExtendedUniqDeprecated =
      dataviewInstancesResolvedExtendedUniq.map((dataview) => {
        return {
          ...dataview,
          deprecated: dataview.deprecated ?? isDataviewDeprecated(dataview, deprecatedDatasets),
        }
      })
    return dataviewInstancesResolvedExtendedUniqDeprecated
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
export const selectDataviewInstancesResolved = createDeepEqualSelector(
  [
    selectDataviewsResources,
    selectResources,
    selectIsAnyVesselLocation,
    selectCurrentVesselEvent,
    selectDebugOptions,
  ],
  (dataviewsResources, resources, isAnyVesselLocation, currentVesselEvent, debugOptions) => {
    if (!dataviewsResources?.dataviews) {
      return defaultDataviewResolved
    }
    const hasCurrentEvent = isAnyVesselLocation && currentVesselEvent
    const dataviews = dataviewsResources.dataviews.map((dataview) => {
      if (dataview.category !== DataviewCategory.Vessels) {
        return dataview
      }
      const { url } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
      const infoResource: Resource<IdentityVessel> = resources[url]
      if (!infoResource || !infoResource.data) {
        return dataview
      }
      return {
        ...dataview,
        config: {
          ...dataview.config,
          name: debugOptions?.hideVesselNames
            ? FAKE_VESSEL_NAME
            : formatInfoField(
                getVesselProperty(infoResource.data as IdentityVessel, 'shipname'),
                'shipname'
              ),
          ...(hasCurrentEvent && {
            highlightEventStartTime: getUTCDateTime(currentVesselEvent.start).toISO()!,
            highlightEventEndTime: getUTCDateTime(currentVesselEvent.end).toISO()!,
          }),
        },
      } as UrlDataviewInstance
    })
    return dataviews as UrlDataviewInstance[]
  }
)
