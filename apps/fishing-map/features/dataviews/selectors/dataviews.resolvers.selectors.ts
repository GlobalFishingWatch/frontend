import { createSelector } from '@reduxjs/toolkit'

import type {
  DataviewDatasetConfig,
  DataviewInstance,
  IdentityVessel,
  Resource,
} from '@globalfishingwatch/api-types'
import { DatasetTypes, DataviewCategory, EventTypes } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import type {
  GetDatasetConfigsCallbacks,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import {
  extendDataviewDatasetConfig,
  getResources,
  mergeWorkspaceUrlDataviewInstances,
  resolveDataviewDatasetResource,
  resolveDataviews,
  selectResources,
} from '@globalfishingwatch/dataviews-client'
import type { ColorRampId } from '@globalfishingwatch/deck-layers'

import { VESSEL_PROFILE_DATAVIEWS_INSTANCES } from 'data/default-workspaces/context-layers'
import { PORTS_FOOTPRINT_DATAVIEW_SLUG } from 'data/workspaces'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import {
  dataviewHasVesselGroupId,
  getVesselDataviewInstance,
  getVesselDataviewInstanceDatasetConfig,
  getVesselEncounterTrackDataviewInstance,
  VESSEL_DATAVIEW_INSTANCE_PREFIX,
} from 'features/dataviews/dataviews.utils'
import { selectVesselTemplateDataviews } from 'features/dataviews/selectors/dataviews.vessels.selectors'
import {
  getVesselGroupActivityDataviewInstance,
  getVesselGroupDataviewInstance,
  getVesselGroupEventsDataviewInstances,
} from 'features/reports/report-vessel-group/vessel-group-report.dataviews'
import { REPORT_EVENTS_GRAPH_DATAVIEW_AREA_SLUGS } from 'features/reports/reports.config'
import {
  selectReportCategorySelector,
  selectReportEventsGraph,
} from 'features/reports/reports.config.selectors'
import type {
  ReportActivitySubCategory,
  ReportEventsSubCategory,
} from 'features/reports/reports.types'
import { selectTrackThinningConfig } from 'features/resources/resources.selectors.thinning'
import { infoDatasetConfigsCallback } from 'features/resources/resources.utils'
import { selectIsGuestUser, selectUserLogged } from 'features/user/selectors/user.selectors'
import {
  selectCurrentVesselEvent,
  selectVesselInfoData,
} from 'features/vessel/selectors/vessel.selectors'
import { getRelatedIdentityVesselIds, getVesselProperty } from 'features/vessel/vessel.utils'
import { selectAllVesselGroups } from 'features/vessel-groups/vessel-groups.slice'
import {
  selectWorkspaceDataviewInstances,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import {
  selectIsAnyVesselLocation,
  selectIsPortReportLocation,
  selectIsRouteWithWorkspace,
  selectIsVesselGroupReportLocation,
  selectIsVesselLocation,
  selectReportPortId,
  selectReportVesselGroupId,
  selectUrlDataviewInstances,
  selectUrlDataviewInstancesOrder,
  selectVesselId,
} from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { formatInfoField } from 'utils/info'
import { createDeepEqualSelector } from 'utils/selectors'

const EMPTY_ARRAY: [] = []
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

// Inject dataviews on the fly for reports and vessel profile
// Also for the vessel profile encounter events to see encountered vessel track
export const selectDataviewInstancesInjected = createSelector(
  [
    selectWorkspaceDataviewInstancesMerged,
    selectVesselTemplateDataviews,
    selectIsAnyVesselLocation,
    selectIsVesselLocation,
    selectCurrentVesselEvent,
    selectIsPortReportLocation,
    selectIsVesselGroupReportLocation,
    selectReportCategorySelector,
    selectReportVesselGroupId,
    selectReportEventsGraph,
    selectReportPortId,
    selectVesselId,
    selectVesselInfoData,
  ],
  (
    workspaceDataviewInstancesMerged,
    vesselTemplateDataviews,
    isAnyVesselLocation,
    isVesselLocation,
    currentVesselEvent,
    isPortReportLocation,
    isVesselGroupReportLocation,
    reportCategory,
    reportVesselGroupId,
    reportEventsGraph,
    reportPortId,
    vesselId,
    vesselInfoData
  ): UrlDataviewInstance[] | undefined => {
    const dataviewInstancesInjected = [] as UrlDataviewInstance[]
    const hasCurrentEvent = isAnyVesselLocation && currentVesselEvent
    const eventStartDateTime = hasCurrentEvent
      ? getUTCDateTime(currentVesselEvent.start)
      : undefined
    const eventEndDateTime = hasCurrentEvent ? getUTCDateTime(currentVesselEvent.end) : undefined
    if (isAnyVesselLocation) {
      const existingDataviewInstance = dataviewInstancesInjected?.find(
        ({ id }) => vesselId && id.includes(vesselId)
      )
      if (!existingDataviewInstance && vesselInfoData?.identities) {
        const vesselDatasets = {
          info: vesselInfoData.info,
          track: vesselInfoData.track,
          ...(vesselInfoData?.events?.length && {
            events: vesselInfoData?.events,
          }),
          relatedVesselIds: getRelatedIdentityVesselIds(vesselInfoData),
        }

        const dataviewInstance = getVesselDataviewInstance({
          vessel: { id: vesselId },
          datasets: vesselDatasets,
          highlightEventStartTime: eventStartDateTime?.toMillis(),
          highlightEventEndTime: eventEndDateTime?.toMillis(),
          vesselTemplateDataviews,
        })
        if (dataviewInstance) {
          const datasetsConfig: DataviewDatasetConfig[] = getVesselDataviewInstanceDatasetConfig(
            vesselId,
            vesselDatasets
          )
          dataviewInstancesInjected.push({ ...dataviewInstance, datasetsConfig })
        }
      }

      if (hasCurrentEvent && currentVesselEvent.type === EventTypes.Encounter) {
        const encounterVesselId = currentVesselEvent.encounter?.vessel.id
        const isEncounterInstanceInWorkspace = workspaceDataviewInstancesMerged?.some(
          (dataview) => dataview.id === `${VESSEL_DATAVIEW_INSTANCE_PREFIX}${encounterVesselId}`
        )
        if (encounterVesselId && vesselInfoData?.track && !isEncounterInstanceInWorkspace) {
          const encounterTrackDataviewInstance = getVesselEncounterTrackDataviewInstance({
            vesselId: encounterVesselId,
            track: vesselInfoData.track,
            start: eventStartDateTime!.minus({ month: 1 }).toMillis(),
            end: eventEndDateTime!.plus({ month: 1 }).toMillis(),
            highlightEventStartTime: eventStartDateTime!.toMillis(),
            highlightEventEndTime: eventEndDateTime!.toMillis(),
          })
          dataviewInstancesInjected.push(encounterTrackDataviewInstance)
        }
      }

      if (isVesselLocation) {
        VESSEL_PROFILE_DATAVIEWS_INSTANCES.forEach((dataviewInstance) => {
          if (!dataviewInstancesInjected.find(({ id }) => id === dataviewInstance.id)) {
            dataviewInstancesInjected.push({ ...dataviewInstance })
          }
        })
      }
    }
    if (isVesselGroupReportLocation) {
      let vesselGroupDataviewInstance = workspaceDataviewInstancesMerged?.find((dataview) =>
        dataviewHasVesselGroupId(dataview, reportVesselGroupId)
      )
      if (!vesselGroupDataviewInstance) {
        vesselGroupDataviewInstance = getVesselGroupDataviewInstance(reportVesselGroupId)
        if (vesselGroupDataviewInstance) {
          dataviewInstancesInjected.push(vesselGroupDataviewInstance)
        }
      }
      if (reportCategory === 'activity') {
        const activityReportSubCategories: ReportActivitySubCategory[] = ['fishing', 'presence']
        activityReportSubCategories.forEach((category) => {
          const activitySubcategoryInstance = getVesselGroupActivityDataviewInstance({
            vesselGroupId: reportVesselGroupId,
            color: vesselGroupDataviewInstance?.config?.color,
            colorRamp: vesselGroupDataviewInstance?.config?.colorRamp as ColorRampId,
            activityType: category,
          })
          if (activitySubcategoryInstance) {
            dataviewInstancesInjected.push(activitySubcategoryInstance)
          }
        })
      }
      if (reportCategory === 'events') {
        const eventsReportSubCategories: ReportEventsSubCategory[] = [
          'encounter',
          'loitering',
          'gap',
          'port_visit',
        ]
        eventsReportSubCategories.forEach((category) => {
          dataviewInstancesInjected.push(
            ...getVesselGroupEventsDataviewInstances(reportVesselGroupId, category)
          )
        })
      }
    }
    if (isPortReportLocation) {
      let footprintDataviewInstance = dataviewInstancesInjected?.find(
        (dataview) => dataview.id === PORTS_FOOTPRINT_DATAVIEW_SLUG
      )
      if (footprintDataviewInstance) {
        footprintDataviewInstance.config = {
          ...footprintDataviewInstance.config,
          filters: {
            ...footprintDataviewInstance.config?.filters,
            gfw_id: [reportPortId],
          },
        }
      } else {
        footprintDataviewInstance = {
          id: `${PORTS_FOOTPRINT_DATAVIEW_SLUG}-${Date.now()}`,
          dataviewId: PORTS_FOOTPRINT_DATAVIEW_SLUG,
          config: {
            pickable: false,
            visible: true,
            filters: {
              gfw_id: [reportPortId],
            },
          },
        }
      }
      dataviewInstancesInjected.push(footprintDataviewInstance)
    }
    // Inject the dataview instance for the events graph report by area
    const reportAreaDataviewId =
      REPORT_EVENTS_GRAPH_DATAVIEW_AREA_SLUGS[
        reportEventsGraph as keyof typeof REPORT_EVENTS_GRAPH_DATAVIEW_AREA_SLUGS
      ]
    if (reportCategory === 'events' && reportAreaDataviewId) {
      const contextDataviewInstance: UrlDataviewInstance = {
        id: `report-event-graph-area`,
        dataviewId: reportAreaDataviewId,
        config: {
          visible: true,
        },
      }
      dataviewInstancesInjected.push(contextDataviewInstance)
    }
    return dataviewInstancesInjected
  }
)

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
  ],
  (
    dataviewInstances,
    dataviews,
    datasets,
    vesselGroups,
    loggedUser,
    trackThinningZoomConfig,
    guestUser
  ): UrlDataviewInstance[] | undefined => {
    if (!dataviews?.length || !datasets?.length || !dataviewInstances?.length) {
      return EMPTY_ARRAY
    }
    const dataviewInstancesWithDatasetConfig = dataviewInstances.map((dataviewInstance) => {
      if (
        dataviewInstance &&
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
      datasets,
      vesselGroups
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
export const selectDataviewInstancesResolved = createDeepEqualSelector(
  [selectDataviewsResources, selectResources, selectIsAnyVesselLocation, selectCurrentVesselEvent],
  (dataviewsResources, resources, isAnyVesselLocation, currentVesselEvent) => {
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
          name: formatInfoField(
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
    return dataviews
  }
)
