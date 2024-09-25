import {
  ColorCyclingType,
  DataviewCategory,
  DataviewInstance,
  DataviewType,
} from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { ColorRampId } from '@globalfishingwatch/deck-layers'
import { REPORT_ONLY_VISIBLE_LAYERS } from 'data/config'
import {
  CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
  CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG,
  CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
  DEFAULT_PRESENCE_VESSEL_GROUP_DATASETS,
  FISHING_DATAVIEW_SLUG,
  PRESENCE_DATAVIEW_SLUG,
} from 'data/workspaces'
import {
  VGREventsSubsection,
  VGRSection,
  VGRSubsection,
} from 'features/vessel-groups/vessel-groups.types'

export const VESSEL_GROUP_DATAVIEW_PREFIX = `vessel-group-`

export type VesselGroupEventsDataviewId =
  `${typeof VESSEL_GROUP_DATAVIEW_PREFIX}${VGREventsSubsection}`

export const VESSEL_GROUP_ACTIVITY_ID = `${VESSEL_GROUP_DATAVIEW_PREFIX}activity`

export const VESSEL_GROUP_ENCOUNTER_EVENTS_ID = `${VESSEL_GROUP_DATAVIEW_PREFIX}encounter`
export const VESSEL_GROUP_LOITERING_EVENTS_ID = `${VESSEL_GROUP_DATAVIEW_PREFIX}loitering`
export const VESSEL_GROUP_PORT_VISITS_EVENTS_ID = `${VESSEL_GROUP_DATAVIEW_PREFIX}port_visits`
export const VESSEL_GROUP_GAPS_EVENTS_ID = `${VESSEL_GROUP_DATAVIEW_PREFIX}gaps`

export const VESSEL_GROUP_EVENTS_DATAVIEW_IDS: VesselGroupEventsDataviewId[] = [
  VESSEL_GROUP_ENCOUNTER_EVENTS_ID,
  VESSEL_GROUP_LOITERING_EVENTS_ID,
  VESSEL_GROUP_PORT_VISITS_EVENTS_ID,
  VESSEL_GROUP_GAPS_EVENTS_ID,
]

export const DATAVIEW_ID_BY_VESSEL_GROUP_EVENTS: Record<
  VGREventsSubsection,
  VesselGroupEventsDataviewId
> = {
  encounter: VESSEL_GROUP_ENCOUNTER_EVENTS_ID,
  loitering: VESSEL_GROUP_LOITERING_EVENTS_ID,
  port_visits: VESSEL_GROUP_PORT_VISITS_EVENTS_ID,
  gaps: VESSEL_GROUP_GAPS_EVENTS_ID,
}

type GetReportVesselGroupVisibleDataviewsParams = {
  dataviews: UrlDataviewInstance[]
  reportVesselGroupId: string
  vesselGroupReportSection: VGRSection
  vesselGroupReportSubSection?: VGRSubsection
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
        DATAVIEW_ID_BY_VESSEL_GROUP_EVENTS[vesselGroupReportSubSection as VGREventsSubsection]
      return id.toString() === dataviewIdBySubSection
    }
    if (vesselGroupReportSection === 'activity') {
      return id.toString() === VESSEL_GROUP_ACTIVITY_ID
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
  dataviewId,
}: {
  vesselGroupId: string
  color?: string
  colorRamp?: ColorRampId
  dataviewId: typeof FISHING_DATAVIEW_SLUG | typeof PRESENCE_DATAVIEW_SLUG
}): DataviewInstance<DataviewType> | undefined => {
  if (vesselGroupId) {
    return {
      id: VESSEL_GROUP_ACTIVITY_ID,
      category: DataviewCategory.Activity,
      config: {
        visible: true,
        ...(color && { color }),
        ...(colorRamp && { colorRamp }),
        filters: {
          'vessel-groups': [vesselGroupId],
        },
      },
      dataviewId,
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
  subsection: VGREventsSubsection
) => {
  let dataviewInstances: (DataviewInstance | undefined)[] = []
  if (subsection === 'encounter') {
    dataviewInstances.push(getVesselGroupEncountersDataviewInstance(vesselGroupId))
  }
  if (subsection === 'loitering') {
    dataviewInstances.push(getVesselGroupLoiteringDataviewInstance(vesselGroupId))
  }
  if (subsection === 'port_visits') {
    dataviewInstances.push(getVesselGroupPortVisitsDataviewInstance(vesselGroupId))
  }
  return dataviewInstances.filter(Boolean) as DataviewInstance<DataviewType>[]
}
