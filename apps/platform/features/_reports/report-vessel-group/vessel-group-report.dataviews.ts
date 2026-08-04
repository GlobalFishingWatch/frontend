import type {
  ColorCyclingType,
  Dataset,
  Dataview,
  DataviewInstance,
  DataviewType,
} from '@globalfishingwatch/api-types'
import { DatasetTypes, DataviewCategory, EventTypes } from '@globalfishingwatch/api-types'
import {
  DATASET_PRIVATE_PREFIX,
  getRelatedDatasetByType,
  removeDatasetVersion,
  replaceDatasetPrivateToPublic,
} from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
// Leaf subpath: this module is reached from five dataview selector modules that are always loaded.
import { type ColorRampId, HEATMAP_COLORS_BY_ID } from '@globalfishingwatch/deck-layers/constants'

import { REPORT_ONLY_VISIBLE_LAYERS } from 'data/map/config'
import {
  CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
  CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG,
  CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
  DEFAULT_PRESENCE_DATASET_ID,
  FISHING_DATAVIEW_SLUG_ALL,
  PRESENCE_DATAVIEW_SLUG,
} from 'data/map/workspaces'
import { GAPS_EVENTS_SOURCE_ID } from 'features/_map/dataviews/dataviews.utils'

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

const normalizeVesselGroupDatasetId = (datasetId: string) =>
  replaceDatasetPrivateToPublic(removeDatasetVersion(datasetId))

type VesselGroupActivityDatasetsParams = {
  vesselGroupDatasets: string[]
  activityDatasetIds: string[]
  allDatasets: Dataset[]
}

export function getVesselGroupActivityDatasets({
  vesselGroupDatasets = [],
  activityDatasetIds = [],
  allDatasets = [],
}: VesselGroupActivityDatasetsParams): string[] {
  if (!vesselGroupDatasets.length || !activityDatasetIds.length || !allDatasets.length) {
    return activityDatasetIds
  }
  const vesselGroupDatasetIds = vesselGroupDatasets.map(normalizeVesselGroupDatasetId)
  return activityDatasetIds.filter((datasetId) => {
    const dataset = allDatasets.find((d) => d.id === datasetId)
    const identityDatasetId = getRelatedDatasetByType(dataset, DatasetTypes.Vessels)?.id
    return identityDatasetId
      ? vesselGroupDatasetIds.includes(normalizeVesselGroupDatasetId(identityDatasetId))
      : false
  })
}

export type VesselGroupActivityDataview = {
  dataviewSlug: string
  datasets: string[]
}

type VesselGroupActivityDataviewParams = {
  vesselGroupDatasets: string[]
  activityDataviews: Dataview[]
  allDatasets: Dataset[]
  fallbackDataviewSlug: string
}

const getIsPrivateDataset = (datasetId: string) => datasetId.startsWith(DATASET_PRIVATE_PREFIX)

export function getVesselGroupActivityDataview({
  vesselGroupDatasets = [],
  activityDataviews = [],
  allDatasets = [],
  fallbackDataviewSlug,
}: VesselGroupActivityDataviewParams): VesselGroupActivityDataview {
  const activityDataviewsDatasets = activityDataviews.map((dataview) => ({
    dataviewSlug: dataview.slug,
    datasetIds: dataview.datasetsConfig?.map((datasetConfig) => datasetConfig.datasetId) || [],
  }))
  const fallback = {
    dataviewSlug: fallbackDataviewSlug,
    datasets:
      activityDataviewsDatasets.find(({ dataviewSlug }) => dataviewSlug === fallbackDataviewSlug)
        ?.datasetIds || [],
  }
  if (!vesselGroupDatasets.length || !allDatasets.length) {
    return fallback
  }
  const matches = activityDataviewsDatasets.flatMap(({ dataviewSlug, datasetIds }) => {
    const datasets = getVesselGroupActivityDatasets({
      vesselGroupDatasets,
      activityDatasetIds: datasetIds,
      allDatasets,
    })
    return datasets.length ? { dataviewSlug, datasets } : []
  })
  if (!matches.length) {
    return fallback
  }
  // match needed as the normalized identity dataset for vessel groups dont have public/private distinction
  const isPrivateVesselGroup = vesselGroupDatasets.some(getIsPrivateDataset)
  const preferredMatch = matches.find(({ datasets }) =>
    isPrivateVesselGroup ? datasets.some(getIsPrivateDataset) : !datasets.some(getIsPrivateDataset)
  )
  return preferredMatch || matches[0]
}

export type VesselGroupEventsDataviewId =
  `${typeof VESSEL_GROUP_DATAVIEW_PREFIX}${ReportEventsSubCategory}`

export const VESSEL_GROUP_ENCOUNTER_EVENTS_ID = `${VESSEL_GROUP_DATAVIEW_PREFIX}encounter`
export const VESSEL_GROUP_LOITERING_EVENTS_ID = `${VESSEL_GROUP_DATAVIEW_PREFIX}loitering`
export const VESSEL_GROUP_PORT_VISITS_EVENTS_ID = `${VESSEL_GROUP_DATAVIEW_PREFIX}port_visit`
export const VESSEL_GROUP_GAPS_EVENTS_ID = `${VESSEL_GROUP_DATAVIEW_PREFIX}${GAPS_EVENTS_SOURCE_ID}`

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
  [EventTypes.Encounter]: VESSEL_GROUP_ENCOUNTER_EVENTS_ID,
  [EventTypes.Loitering]: VESSEL_GROUP_LOITERING_EVENTS_ID,
  [EventTypes.Port]: VESSEL_GROUP_PORT_VISITS_EVENTS_ID,
  [EventTypes.Gap]: VESSEL_GROUP_GAPS_EVENTS_ID,
  [EventTypes.Gaps]: VESSEL_GROUP_GAPS_EVENTS_ID,
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
      config?.filters?.['vessel-groups']?.includes(reportVesselGroupId)
    )
  })
}

export const getVesselGroupDataviewInstance = (
  vesselGroupId: string,
  datasets: string[] = [DEFAULT_PRESENCE_DATASET_ID],
  dataviewId: string = PRESENCE_DATAVIEW_SLUG
): DataviewInstance<DataviewType> | undefined => {
  if (vesselGroupId) {
    return {
      id: `${VESSEL_GROUP_DATAVIEW_PREFIX}${Date.now()}`,
      category: DataviewCategory.VesselGroups,
      config: {
        colorCyclingType: 'fill' as ColorCyclingType,
        color: HEATMAP_COLORS_BY_ID.salmon,
        visible: true,
        filters: {
          'vessel-groups': [vesselGroupId],
        },
        datasets,
      },
      dataviewId,
    }
  }
}

export const getVesselGroupActivityDataviewInstance = ({
  vesselGroupId,
  color,
  colorRamp,
  activityType,
  datasets,
  presenceDataviewId = PRESENCE_DATAVIEW_SLUG,
  fishingDataviewId = FISHING_DATAVIEW_SLUG_ALL,
}: {
  vesselGroupId: string
  color?: string
  colorRamp?: ColorRampId
  activityType: ReportActivitySubCategory
  datasets?: string[]
  presenceDataviewId?: string
  fishingDataviewId?: string
}): DataviewInstance<DataviewType> | undefined => {
  if (vesselGroupId) {
    return {
      id: `${VESSEL_GROUP_DATAVIEW_PREFIX}${activityType}`,
      category: DataviewCategory.VesselGroups,
      config: {
        visible: true,
        ...(color && { color }),
        ...(colorRamp && { colorRamp }),
        ...(datasets?.length && { datasets }),
        filters: {
          'vessel-groups': [vesselGroupId],
        },
      },
      dataviewId: activityType === 'presence' ? presenceDataviewId : fishingDataviewId,
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

export const getVesselGroupEventsDataviewInstance = (
  vesselGroupId: string,
  subsection: ReportEventsSubCategory
) => {
  if (subsection === 'encounter') {
    return getVesselGroupEncountersDataviewInstance(vesselGroupId)
  }
  if (subsection === 'loitering') {
    return getVesselGroupLoiteringDataviewInstance(vesselGroupId)
  }
  if (subsection === 'port_visit') {
    return getVesselGroupPortVisitsDataviewInstance(vesselGroupId)
  }
}
