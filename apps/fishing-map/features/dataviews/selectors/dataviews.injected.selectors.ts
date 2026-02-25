import { createSelector } from '@reduxjs/toolkit'

import type { DataviewDatasetConfig } from '@globalfishingwatch/api-types'
import { DataviewCategory, EventTypes } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { VMS_DATASET_ID } from '@globalfishingwatch/datasets-client'
import {
  mergeWorkspaceUrlDataviewInstances,
  type UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import type { ColorRampId } from '@globalfishingwatch/deck-layers'

import { LAYER_LIBRARY_ID_SEPARATOR } from 'data/config'
import { VESSEL_PROFILE_DATAVIEWS_INSTANCES } from 'data/default-workspaces/context-layers'
import { LIBRARY_LAYERS } from 'data/layer-library'
import {
  CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
  PORTS_FOOTPRINT_AIS_DATAVIEW_SLUG,
  PORTS_FOOTPRINT_VMS_DATAVIEW_SLUG,
} from 'data/workspaces'
import {
  dataviewHasVesselGroupId,
  getHasVesselProfileInstance,
  getIsVesselDataviewInstanceId,
  getVesselDataviewInstance,
  getVesselDataviewInstanceDatasetConfig,
  getVesselEncounterTrackDataviewInstance,
  PORT_VISITS_REPORT_DATAVIEW_ID,
} from 'features/dataviews/dataviews.utils'
import { selectWorkspaceDataviewInstancesMerged } from 'features/dataviews/selectors/dataviews.merged.selectors'
import { selectVesselTemplateDataviews } from 'features/dataviews/selectors/dataviews.vessels.selectors'
import {
  getVesselGroupActivityDataviewInstance,
  getVesselGroupDataviewInstance,
  getVesselGroupEventsDataviewInstance,
} from 'features/reports/report-vessel-group/vessel-group-report.dataviews'
import { REPORT_EVENTS_GRAPH_DATAVIEW_AREA_SLUGS } from 'features/reports/reports.config'
import {
  selectPortReportDatasetId,
  selectReportCategorySelector,
  selectReportComparisonDataviewIds,
  selectReportEventsGraph,
} from 'features/reports/reports.config.selectors'
import type {
  ReportActivitySubCategory,
  ReportEventsSubCategory,
} from 'features/reports/reports.types'
import {
  selectCurrentVesselEvent,
  selectVesselInfoData,
} from 'features/vessel/selectors/vessel.selectors'
import { getRelatedIdentityVesselIds } from 'features/vessel/vessel.utils'
import { getNextColor } from 'features/workspace/workspace.utils'
import {
  selectIsAnyVesselLocation,
  selectIsPortReportLocation,
  selectIsVesselGroupReportLocation,
  selectIsVesselLocation,
  selectReportPortId,
  selectReportVesselGroupId,
  selectVesselId,
} from 'routes/routes.selectors'

export const selectVesselProfileDataviewInstancesInjected = createSelector(
  [
    selectWorkspaceDataviewInstancesMerged,
    selectVesselTemplateDataviews,
    selectIsAnyVesselLocation,
    selectIsVesselLocation,
    selectCurrentVesselEvent,
    selectVesselId,
    selectVesselInfoData,
  ],
  (
    workspaceDataviewInstancesMerged,
    vesselTemplateDataviews,
    isAnyVesselLocation,
    isVesselLocation,
    currentVesselEvent,
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
      const existingDataviewInstance = workspaceDataviewInstancesMerged?.find(
        ({ id }) => vesselId && id?.includes(vesselId)
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
        const currentColors = (workspaceDataviewInstancesMerged || []).flatMap((dv) =>
          getIsVesselDataviewInstanceId(dv.id) ? dv.config?.color || [] : []
        )
        const nextColor = getNextColor('line', currentColors)
        const dataviewInstance = getVesselDataviewInstance({
          vessel: { id: vesselId },
          datasets: vesselDatasets,
          highlightEventStartTime: eventStartDateTime?.toMillis(),
          highlightEventEndTime: eventEndDateTime?.toMillis(),
          vesselTemplateDataviews,
          color: nextColor?.value,
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
        const isEncounterInstanceInWorkspace = getHasVesselProfileInstance({
          dataviews: workspaceDataviewInstancesMerged!,
          vesselId: encounterVesselId!,
          origin: 'vesselProfile',
        })
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

    return dataviewInstancesInjected
  }
)

export const selectVGRDataviewInstancesInjected = createSelector(
  [
    selectWorkspaceDataviewInstancesMerged,
    selectIsVesselGroupReportLocation,
    selectReportCategorySelector,
    selectReportVesselGroupId,
  ],
  (
    workspaceDataviewInstancesMerged,
    isVesselGroupReportLocation,
    reportCategory,
    reportVesselGroupId
  ): UrlDataviewInstance[] | undefined => {
    const dataviewInstancesInjected = [] as UrlDataviewInstance[]
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
          EventTypes.Encounter,
          EventTypes.Loitering,
          EventTypes.Gap,
          EventTypes.Port,
        ]
        eventsReportSubCategories.forEach((category) => {
          const eventsDataviewInstance = getVesselGroupEventsDataviewInstance(
            reportVesselGroupId,
            category
          )
          if (eventsDataviewInstance) {
            const urlDataviewInstance = workspaceDataviewInstancesMerged?.find(
              (dataview) => dataview.id === eventsDataviewInstance.id
            )
            const mergedDataviewInstance = urlDataviewInstance
              ? (mergeWorkspaceUrlDataviewInstances(
                  [eventsDataviewInstance],
                  [urlDataviewInstance]
                )?.[0] as UrlDataviewInstance)
              : eventsDataviewInstance

            dataviewInstancesInjected.push(mergedDataviewInstance)
          }
        })
      }
    }
    return dataviewInstancesInjected
  }
)

// Inject dataviews on the fly for reports and vessel profile
// Also for the vessel profile encounter events to see encountered vessel track
export const selectPortReportDataviewInstancesInjected = createSelector(
  [
    selectWorkspaceDataviewInstancesMerged,
    selectIsPortReportLocation,
    selectReportPortId,
    selectPortReportDatasetId,
  ],
  (
    workspaceDataviewInstancesMerged,
    isPortReportLocation,
    reportPortId,
    portReportDatasetId
  ): UrlDataviewInstance[] | undefined => {
    const dataviewInstancesInjected = [] as UrlDataviewInstance[]

    if (isPortReportLocation) {
      let footprintDataviewInstance = workspaceDataviewInstancesMerged?.find(
        (dataview) =>
          dataview.id === PORTS_FOOTPRINT_AIS_DATAVIEW_SLUG ||
          dataview.id === PORTS_FOOTPRINT_VMS_DATAVIEW_SLUG
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
        const dataviewId = portReportDatasetId?.includes(VMS_DATASET_ID)
          ? PORTS_FOOTPRINT_VMS_DATAVIEW_SLUG
          : PORTS_FOOTPRINT_AIS_DATAVIEW_SLUG

        footprintDataviewInstance = {
          id: `${PORTS_FOOTPRINT_AIS_DATAVIEW_SLUG}-${Date.now()}`,
          dataviewId,
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

      const hasPortVisitDataviewInstance = workspaceDataviewInstancesMerged?.some(
        (dataview) =>
          !dataview.deleted &&
          dataview.config?.visible &&
          dataview.dataviewId === CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG
      )
      if (!hasPortVisitDataviewInstance) {
        const portVisitDataviewInstance = {
          id: PORT_VISITS_REPORT_DATAVIEW_ID,
          category: DataviewCategory.Events,
          config: {
            visible: true,
            color: '#9AEEFF',
            clusterMaxZoomLevels: { default: 20 },
            filters: {
              port_id: reportPortId,
            },
          },
          dataviewId: CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
        }
        dataviewInstancesInjected.push(portVisitDataviewInstance)
      }
    }
    return dataviewInstancesInjected
  }
)

// Inject the dataview instance for the events graph report by area
export const selectAreaReportDataviewInstancesInjected = createSelector(
  [
    selectWorkspaceDataviewInstancesMerged,
    selectReportCategorySelector,
    selectReportEventsGraph,
    selectReportComparisonDataviewIds,
  ],
  (
    workspaceDataviewInstances,
    reportCategory,
    reportEventsGraph,
    reportComparisonDataviewIds
  ): UrlDataviewInstance[] | undefined => {
    const dataviewInstancesInjected = [] as UrlDataviewInstance[]
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
    if (reportComparisonDataviewIds?.compare) {
      const mainLayer = workspaceDataviewInstances?.find(
        (dataview) => dataview.id === reportComparisonDataviewIds.main
      )
      const compareLayer = LIBRARY_LAYERS?.find(
        (l) => l.id === reportComparisonDataviewIds.compare?.split(LAYER_LIBRARY_ID_SEPARATOR)[0]
      )
      const areLayersSameColor = mainLayer?.config?.color === compareLayer?.config?.color
      const nextColor = getNextColor('fill', [mainLayer?.config?.color as string])
      if (compareLayer) {
        const compareDataviewInstance = {
          id: reportComparisonDataviewIds.compare,
          origin: 'comparison',
          category: compareLayer?.category,
          dataviewId: compareLayer?.dataviewId,
          datasetsConfig: compareLayer?.datasetsConfig,
          config: {
            ...(compareLayer?.config && { ...compareLayer?.config }),
            visible: true,
            color: areLayersSameColor ? nextColor.value : compareLayer?.config?.color,
            colorRamp: areLayersSameColor ? nextColor.id : compareLayer?.config?.colorRamp,
          },
        } as UrlDataviewInstance
        dataviewInstancesInjected.push(compareDataviewInstance)
      }
    }

    return dataviewInstancesInjected
  }
)

// Inject dataviews on the fly for reports and vessel profile
// Also for the vessel profile encounter events to see encountered vessel track
export const selectDataviewInstancesInjected = createSelector(
  [
    selectVesselProfileDataviewInstancesInjected,
    selectVGRDataviewInstancesInjected,
    selectPortReportDataviewInstancesInjected,
    selectAreaReportDataviewInstancesInjected,
  ],
  (
    vesselProfileDataviewInstancesInjected = [],
    vgrDataviewInstancesInjected = [],
    portReportDataviewInstancesInjected = [],
    areaReportDataviewInstancesInjected = []
  ): UrlDataviewInstance[] | undefined => {
    return [
      ...vesselProfileDataviewInstancesInjected,
      ...vgrDataviewInstancesInjected,
      ...portReportDataviewInstancesInjected,
      ...areaReportDataviewInstancesInjected,
    ]
  }
)
