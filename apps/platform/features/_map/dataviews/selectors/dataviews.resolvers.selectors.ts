import { createSelector } from '@reduxjs/toolkit'
import { uniqBy } from 'es-toolkit'

import type { IdentityVessel, Locale, Resource } from '@globalfishingwatch/api-types'
import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '@globalfishingwatch/data-transforms/dates'
import type {
  GetDatasetConfigsCallbacks,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import {
  extendDataviewDatasetConfig,
  getIsVesselDataviewInstanceId,
  getResources,
  getVesselDataviewInstanceId,
  resolveDataviewDatasetResource,
  resolveDataviews,
  selectResources,
} from '@globalfishingwatch/dataviews-client'
import { BASEMAP_LABELS_DATAVIEW_SLUG } from '@platform/config/map/dataviews'

import { selectAllDatasets, selectDeprecatedDatasets } from 'features/_map/datasets/datasets.slice'
import { selectAllDataviews } from 'features/_map/dataviews/dataviews.slice'
import {
  isDataviewDeprecated,
  isHistoricalDataview,
  isRealTimeDataview,
  resolveVesselDataviewInstance,
  withLonglineSetsEvents,
} from 'features/_map/dataviews/dataviews.utils'
import { selectDataviewInstancesInjected } from 'features/_map/dataviews/selectors/dataviews.injected.selectors'
import { selectWorkspaceDataviewInstancesMerged } from 'features/_map/dataviews/selectors/dataviews.merged.selectors'
import { selectHighlightedTime } from 'features/_map/timebar/timebar.slice'
import { selectTimeMode } from 'features/_map/workspace/workspace.selectors'
import {
  selectIsGuestUser,
  selectUserLanguage,
  selectUserLogged,
} from 'features/_user/selectors/user.selectors'
import { selectAllVesselGroups } from 'features/_user/vessel-groups/vessel-groups.slice'
import { selectTrackCorrectionVesselDataviewId } from 'features/_vessels/track-correction/track-correction.slice'
import { selectCurrentVesselEvent } from 'features/_vessels/vessel/selectors/vessel.selectors'
import { selectLonglineSetsOnMap } from 'features/_vessels/vessel/vessel.config.selectors'
import { getVesselProperty } from 'features/_vessels/vessel/vessel.utils'
import { selectTrackThinningConfig } from 'features/data/resources/resources.selectors.thinning'
import { infoDatasetConfigsCallback } from 'features/data/resources/resources.utils'
import { FAKE_VESSEL_NAME, selectDebugOptions } from 'features/debug/debug.slice'
import {
  selectIsAnyVesselLocation,
  selectTrackCorrectionId,
  selectUrlDataviewInstancesOrder,
  selectVesselId,
} from 'router/routes.selectors'
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

// Returns highlightedTime only when track correction is active to avoid
// recomputing the entire dataview resolver on every timebar mousemove.
const selectHighlightedTimeForTrackCorrection = createSelector(
  [selectTrackCorrectionVesselDataviewId, selectTrackCorrectionId, selectHighlightedTime],
  (trackCorrectionVesselDataviewId, trackCorrectionId, highlightedTime) => {
    if (!trackCorrectionVesselDataviewId || trackCorrectionId === 'new') {
      return undefined
    }
    return highlightedTime
  }
)

export const selectAllDataviewInstancesResolved = createSelector(
  [
    selectTimeMode,
    selectDataviewInstancesMergedOrdered,
    selectAllDataviews,
    selectAllDatasets,
    selectAllVesselGroups,
    selectUserLogged,
    selectTrackThinningConfig,
    selectIsGuestUser,
    selectTrackCorrectionVesselDataviewId,
    selectTrackCorrectionId,
    selectHighlightedTimeForTrackCorrection,
    selectDeprecatedDatasets,
    selectUserLanguage,
    selectLonglineSetsOnMap,
    selectVesselId,
  ],
  (
    timeMode,
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
    deprecatedDatasets,
    language,
    longlineSetsOnMap,
    vesselId
  ): UrlDataviewInstance[] | undefined => {
    if (!dataviews?.length || !datasets?.length || !dataviewInstances?.length) {
      return EMPTY_ARRAY
    }

    const dataviewInstancesWithDatasetConfig = dataviewInstances.map((dataviewInstance) =>
      dataviewInstance && getIsVesselDataviewInstanceId(dataviewInstance.id)
        ? resolveVesselDataviewInstance(dataviewInstance, {
            datasets,
            loggedUser,
            trackThinningZoomConfig,
          })
        : dataviewInstance
    )

    const dataviewInstancesResolved = resolveDataviews(
      dataviewInstancesWithDatasetConfig,
      dataviews,
      datasets,
      vesselGroups
    )
    const longlineVesselDataviewInstanceId =
      longlineSetsOnMap && vesselId ? getVesselDataviewInstanceId(vesselId) : undefined

    const dataviewInstancesResolvedWithConfigInjected = dataviewInstancesResolved.map(
      (dataview) => {
        if (dataview.id === longlineVesselDataviewInstanceId) {
          return withLonglineSetsEvents(dataview, datasets)
        }
        if (dataview.id === trackCorrectionVesselDataviewId) {
          return {
            ...dataview,
            config: {
              ...(dataview.config || {}),
              showVesselIcon: false,
              ...(trackCorrectionId !== 'new' &&
                highlightedTime && {
                  showVesselIcon: true,
                }),
            },
          }
        }
        if (dataview.slug === BASEMAP_LABELS_DATAVIEW_SLUG && language) {
          return {
            ...dataview,
            config: {
              ...(dataview.config || {}),
              locale: language as Locale,
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

    return dataviewInstancesResolvedExtendedUniqDeprecated.filter((d) => {
      return timeMode === 'realTime' ? isRealTimeDataview(d) : isHistoricalDataview(d)
    })
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
