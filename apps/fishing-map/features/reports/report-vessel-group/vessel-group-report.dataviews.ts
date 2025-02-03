import type {
  ColorCyclingType,
  DataviewInstance,
  DataviewType,
} from '@globalfishingwatch/api-types'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { ColorRampId } from '@globalfishingwatch/deck-layers'

import { REPORT_ONLY_VISIBLE_LAYERS } from 'data/config'
import {
  CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
  CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG,
  CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
  DEFAULT_PRESENCE_VESSEL_GROUP_DATASETS,
  FISHING_DATAVIEW_SLUG,
  PRESENCE_DATAVIEW_SLUG,
} from 'data/workspaces'

import type {
  AnyReportSubCategory,
  ReportActivitySubCategory,
  ReportCategory,
  ReportEventsSubCategory,
} from '../reports.types'

export const VESSEL_GROUP_DATAVIEW_PREFIX = `vessel-group-`

export type VesselGroupActivityDataviewId =
  `${typeof VESSEL_GROUP_DATAVIEW_PREFIX}${ReportActivitySubCategory}`

export const VESSEL_GROUP_FISHING_ACTIVITY_ID = `${VESSEL_GROUP_DATAVIEW_PREFIX}fishing`
export const VESSEL_GROUP_PRESENCE_ACTIVITY_ID = `${VESSEL_GROUP_DATAVIEW_PREFIX}presence`

export const VESSEL_GROUP_ACTIVITY_DATAVIEW_IDS: VesselGroupActivityDataviewId[] = [
  VESSEL_GROUP_FISHING_ACTIVITY_ID,
  VESSEL_GROUP_PRESENCE_ACTIVITY_ID,
]

export function isVesselGroupActivityDataview(dataviewId: string) {
  return VESSEL_GROUP_ACTIVITY_DATAVIEW_IDS.includes(dataviewId as VesselGroupActivityDataviewId)
}

export type VesselGroupEventsDataviewId =
  `${typeof VESSEL_GROUP_DATAVIEW_PREFIX}${ReportEventsSubCategory}`

export const VESSEL_GROUP_ENCOUNTER_EVENTS_ID = `${VESSEL_GROUP_DATAVIEW_PREFIX}encounter`
export const VESSEL_GROUP_LOITERING_EVENTS_ID = `${VESSEL_GROUP_DATAVIEW_PREFIX}loitering`
export const VESSEL_GROUP_PORT_VISITS_EVENTS_ID = `${VESSEL_GROUP_DATAVIEW_PREFIX}port_visit`
export const VESSEL_GROUP_GAPS_EVENTS_ID = `${VESSEL_GROUP_DATAVIEW_PREFIX}gap`

export const VESSEL_GROUP_EVENTS_DATAVIEW_IDS: VesselGroupEventsDataviewId[] = [
  VESSEL_GROUP_ENCOUNTER_EVENTS_ID,
  VESSEL_GROUP_LOITERING_EVENTS_ID,
  VESSEL_GROUP_PORT_VISITS_EVENTS_ID,
  VESSEL_GROUP_GAPS_EVENTS_ID,
]

type VGReportEventsSubCategory = Exclude<ReportEventsSubCategory, 'fishing'>
export const DATAVIEW_ID_BY_VESSEL_GROUP_EVENTS: Record<
  VGReportEventsSubCategory,
  VesselGroupEventsDataviewId
> = {
  encounter: VESSEL_GROUP_ENCOUNTER_EVENTS_ID,
  loitering: VESSEL_GROUP_LOITERING_EVENTS_ID,
  port_visit: VESSEL_GROUP_PORT_VISITS_EVENTS_ID,
  gap: VESSEL_GROUP_GAPS_EVENTS_ID,
}

type GetReportVesselGroupVisibleDataviewsParams = {
  dataviews: UrlDataviewInstance[]
  reportVesselGroupId: string
  vesselGroupReportSection: ReportCategory
  vesselGroupReportSubSection?: AnyReportSubCategory
}
export function getReportVesselGroupVisibleDataviews({
  dataviews,
  reportVesselGroupId,
  vesselGroupReportSection,
  vesselGroupReportSubSection,
}: GetReportVesselGroupVisibleDataviewsParams) {
  return dataviews.filter(({ id, category, config }) => {
    if (REPORT_ONLY_VISIBLE_LAYERS.includes(config?.type as DataviewType)) {
      return config?.visible
    }
    if (vesselGroupReportSection === 'events') {
      const dataviewIdBySubSection =
        DATAVIEW_ID_BY_VESSEL_GROUP_EVENTS[vesselGroupReportSubSection as VGReportEventsSubCategory]
      return id.toString() === dataviewIdBySubSection
    }
    if (vesselGroupReportSection === 'activity') {
      return isVesselGroupActivityDataview(id.toString())
    }
    return (
      category === DataviewCategory.VesselGroups &&
      config?.filters?.['vessel-groups'].includes(reportVesselGroupId)
    )
  })
}

export const getVesselGroupDataviewInstance = (
  vesselGroupId: string
): DataviewInstance<DataviewType> | undefined => {
  if (vesselGroupId) {
    return {
      id: `${VESSEL_GROUP_DATAVIEW_PREFIX}${Date.now()}`,
      category: DataviewCategory.VesselGroups,
      config: {
        colorCyclingType: 'fill' as ColorCyclingType,
        visible: true,
        filters: {
          'vessel-groups': [vesselGroupId],
        },
        datasets: DEFAULT_PRESENCE_VESSEL_GROUP_DATASETS,
      },
      dataviewId: PRESENCE_DATAVIEW_SLUG,
    }
  }
}

export const getVesselGroupActivityDataviewInstance = ({
  vesselGroupId,
  color,
  colorRamp,
  activityType,
}: {
  vesselGroupId: string
  color?: string
  colorRamp?: ColorRampId
  activityType: ReportActivitySubCategory
}): DataviewInstance<DataviewType> | undefined => {
  if (vesselGroupId) {
    return {
      id: `${VESSEL_GROUP_DATAVIEW_PREFIX}${activityType}`,
      category: DataviewCategory.VesselGroups,
      config: {
        visible: true,
        ...(color && { color }),
        ...(colorRamp && { colorRamp }),
        filters: {
          'vessel-groups': [vesselGroupId],
        },
      },
      dataviewId: activityType === 'presence' ? PRESENCE_DATAVIEW_SLUG : FISHING_DATAVIEW_SLUG,
    }
  }
}

export const getVesselGroupEventDataviewInstance = ({
  vesselGroupId,
  instanceId,
  dataviewId,
  color,
}: {
  vesselGroupId: string
  instanceId: string
  dataviewId: string
  color?: string
}): DataviewInstance<DataviewType> | undefined => {
  if (vesselGroupId && dataviewId && instanceId && dataviewId) {
    return {
      id: instanceId,
      category: DataviewCategory.Events,
      config: {
        visible: true,
        ...(color && { color }),
        filters: {
          'vessel-groups': [vesselGroupId],
        },
      },
      dataviewId: dataviewId,
    }
  }
}

export const getVesselGroupEncountersDataviewInstance = (vesselGroupId: string) =>
  getVesselGroupEventDataviewInstance({
    vesselGroupId,
    instanceId: VESSEL_GROUP_ENCOUNTER_EVENTS_ID,
    dataviewId: CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
  })

export const getVesselGroupLoiteringDataviewInstance = (vesselGroupId: string) =>
  getVesselGroupEventDataviewInstance({
    vesselGroupId,
    instanceId: VESSEL_GROUP_LOITERING_EVENTS_ID,
    dataviewId: CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG,
  })

export const getVesselGroupPortVisitsDataviewInstance = (vesselGroupId: string) =>
  getVesselGroupEventDataviewInstance({
    vesselGroupId,
    instanceId: VESSEL_GROUP_PORT_VISITS_EVENTS_ID,
    dataviewId: CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
  })

export const getVesselGroupEventsDataviewInstances = (
  vesselGroupId: string,
  subsection: ReportEventsSubCategory
) => {
  const dataviewInstances: (DataviewInstance | undefined)[] = []
  if (subsection === 'encounter') {
    dataviewInstances.push(getVesselGroupEncountersDataviewInstance(vesselGroupId))
  }
  if (subsection === 'loitering') {
    dataviewInstances.push(getVesselGroupLoiteringDataviewInstance(vesselGroupId))
  }
  if (subsection === 'port_visit') {
    dataviewInstances.push(getVesselGroupPortVisitsDataviewInstance(vesselGroupId))
  }
  return dataviewInstances.filter(Boolean) as DataviewInstance<DataviewType>[]
}
