import {
  ColorCyclingType,
  DataviewCategory,
  DataviewInstance,
  DataviewType,
} from '@globalfishingwatch/api-types'
import {
  CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
  CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG,
  CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
  DEFAULT_PRESENCE_VESSEL_GROUP_DATASETS,
  PRESENCE_DATAVIEW_SLUG,
} from 'data/workspaces'
import { VGREventsSubsection } from 'features/vessel-groups/vessel-groups.types'

export const VESSEL_GROUP_DATAVIEW_PREFIX = `vessel-group-`

export type VesselGroupEventsDataviewId =
  `${typeof VESSEL_GROUP_DATAVIEW_PREFIX}${VGREventsSubsection}`
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

export const getVesselGroupEventsDataviewInstances = (vesselGroupId: string) =>
  [
    getVesselGroupEncountersDataviewInstance(vesselGroupId),
    getVesselGroupLoiteringDataviewInstance(vesselGroupId),
    getVesselGroupPortVisitsDataviewInstance(vesselGroupId),
  ].filter(Boolean) as DataviewInstance<DataviewType>[]
