import kebabCase from 'lodash/kebabCase'

import type {
  ColorCyclingType,
  Dataset,
  Dataview,
  DataviewDatasetConfig,
  DataviewInstance,
  DataviewType,
} from '@globalfishingwatch/api-types'
import { DataviewCategory, EndpointId } from '@globalfishingwatch/api-types'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { FourwingsAggregationOperation } from '@globalfishingwatch/deck-layers'

import {
  TEMPLATE_ACTIVITY_DATAVIEW_SLUG,
  TEMPLATE_CLUSTERS_DATAVIEW_SLUG,
  TEMPLATE_CONTEXT_DATAVIEW_SLUG,
  TEMPLATE_POINTS_DATAVIEW_SLUG,
  TEMPLATE_USER_TRACK_SLUG,
  TEMPLATE_VESSEL_DATAVIEW_SLUG,
} from 'data/workspaces'
import type { VesselInstanceDatasets } from 'features/datasets/datasets.utils'
import { getActiveDatasetsInDataview, isPrivateDataset } from 'features/datasets/datasets.utils'
import { INCLUDES_RELATED_SELF_REPORTED_INFO_ID } from 'features/vessel/vessel.config'

// used in workspaces with encounter events layers
export const ENCOUNTER_EVENTS_SOURCE_ID = 'encounters'
const ENCOUNTER_EVENTS_30MIN_SOURCE_ID = 'proto-global-encounters-events-30min'
export const PORT_VISITS_EVENTS_SOURCE_ID = 'port-visits'
export const LOITERING_EVENTS_SOURCE_ID = 'loitering'
export const VESSEL_GROUP_DATAVIEW_PREFIX = `vessel-group-`
export const BIG_QUERY_PREFIX = 'bq-'
const BIG_QUERY_4WINGS_PREFIX = `${BIG_QUERY_PREFIX}4wings-`
const BIG_QUERY_EVENTS_PREFIX = `${BIG_QUERY_PREFIX}events-`
export const VESSEL_LAYER_PREFIX = 'vessel-'
const CONTEXT_LAYER_PREFIX = 'context-'
export const VESSEL_DATAVIEW_INSTANCE_PREFIX = 'vessel-'
export const ENCOUNTER_EVENTS_SOURCES = [
  ENCOUNTER_EVENTS_SOURCE_ID,
  ENCOUNTER_EVENTS_30MIN_SOURCE_ID,
]
export function dataviewHasVesselGroupId(dataview: UrlDataviewInstance, vesselGroupId: string) {
  return dataview.config?.filters?.['vessel-groups']?.includes(vesselGroupId)
}

export const getVesselInfoDataviewInstanceDatasetConfig = (
  vesselId: string,
  { info }: VesselInstanceDatasets
) => {
  return {
    datasetId: info,
    params: [{ id: 'vesselId', value: vesselId }],
    query: [
      { id: 'dataset', value: info },
      {
        id: 'includes',
        value: [INCLUDES_RELATED_SELF_REPORTED_INFO_ID],
      },
    ],
    endpoint: EndpointId.Vessel,
  } as DataviewDatasetConfig
}

export const getVesselDataviewInstanceDatasetConfig = (
  vesselId: string,
  { track, info, events, relatedVesselIds = [] }: VesselInstanceDatasets
) => {
  const datasetsConfig: DataviewDatasetConfig[] = []
  if (info) {
    datasetsConfig.push(
      getVesselInfoDataviewInstanceDatasetConfig(vesselId, { info: info as string })
    )
  }
  if (track) {
    const vesselIds = relatedVesselIds ? [vesselId, ...relatedVesselIds].join(',') : vesselId
    datasetsConfig.push({
      datasetId: track,
      params: [{ id: 'vesselId', value: vesselIds }],
      endpoint: EndpointId.Tracks,
    })
  }
  if (events) {
    events.forEach((eventDatasetId) => {
      datasetsConfig.push({
        datasetId: eventDatasetId,
        query: [{ id: 'vessels', value: [vesselId, ...relatedVesselIds] }],
        params: [],
        endpoint: EndpointId.Events,
      })
    })
  }
  return datasetsConfig
}

const vesselDataviewInstanceTemplate = (
  dataviewSlug: Dataview['slug'],
  datasets: VesselInstanceDatasets
) => {
  return {
    // TODO find the way to use different vessel dataviews, for example
    // panama and peru doesn't show events and needed a workaround to work with this
    dataviewId: dataviewSlug,
    config: {
      colorCyclingType: 'line' as ColorCyclingType,
      ...datasets,
    },
  }
}
const getVesselDataviewInstanceId = (vesselId: string) =>
  `${VESSEL_DATAVIEW_INSTANCE_PREFIX}${vesselId}`

export const getVesselDataviewInstance = (
  vessel: { id: string },
  datasets: VesselInstanceDatasets
): DataviewInstance => {
  const vesselDataviewInstance = {
    id: getVesselDataviewInstanceId(vessel.id),
    ...vesselDataviewInstanceTemplate(TEMPLATE_VESSEL_DATAVIEW_SLUG, datasets),
    deleted: false,
  }
  return vesselDataviewInstance
}

export const getUserPolygonsDataviewInstance = (
  datasetId: string
): DataviewInstance<DataviewType> => {
  return {
    id: `user-polygons-${Date.now()}`,
    config: {
      colorCyclingType: 'line' as ColorCyclingType,
    },
    dataviewId: TEMPLATE_CONTEXT_DATAVIEW_SLUG,
    datasetsConfig: [
      {
        datasetId,
        params: [],
        endpoint: EndpointId.ContextTiles,
      },
    ],
  }
}

export const getUserPointsDataviewInstance = (dataset: Dataset): DataviewInstance<DataviewType> => {
  const circleRadiusProperty = getDatasetConfigurationProperty({ dataset, property: 'pointSize' })
  const startTimeFilterProperty = getDatasetConfigurationProperty({
    dataset,
    property: 'startTime',
  })
  const endTimeFilterProperty = getDatasetConfigurationProperty({
    dataset,
    property: 'endTime',
  })
  const properties = [circleRadiusProperty, startTimeFilterProperty, endTimeFilterProperty]
    .filter(Boolean)
    .map((p) => p.toString().toLowerCase())
  return {
    id: `user-points-${dataset?.id}`,
    dataviewId: TEMPLATE_POINTS_DATAVIEW_SLUG,
    config: {
      colorCyclingType: 'line' as ColorCyclingType,
    },
    datasetsConfig: [
      {
        datasetId: dataset?.id,
        endpoint: EndpointId.ContextTiles,
        params: [{ id: 'id', value: dataset?.id }],

        ...(properties.length && {
          query: [
            {
              id: 'properties',
              value: properties,
            },
          ],
        }),
      },
    ],
  }
}

export const getUserTrackDataviewInstance = (dataset: Dataset) => {
  const datasetsConfig = [
    {
      datasetId: dataset.id,
      endpoint: EndpointId.UserTracks,
      params: [{ id: 'id', value: dataset.id }],
    },
  ]
  const dataviewInstance = {
    id: `user-track-${dataset.id}`,
    dataviewId: TEMPLATE_USER_TRACK_SLUG,
    config: {
      colorCyclingType: 'line' as ColorCyclingType,
    },
    datasetsConfig,
  }
  return dataviewInstance
}

export const getContextDataviewInstance = (datasetId: string): DataviewInstance<DataviewType> => {
  const contextDataviewInstance = {
    id: `${CONTEXT_LAYER_PREFIX}${Date.now()}`,
    category: DataviewCategory.Context,
    config: {
      colorCyclingType: 'line' as ColorCyclingType,
    },
    dataviewId: TEMPLATE_CONTEXT_DATAVIEW_SLUG,
    datasetsConfig: [
      {
        datasetId,
        params: [],
        endpoint: EndpointId.ContextTiles,
      },
    ],
  }
  return contextDataviewInstance
}

export const getDataviewInstanceFromDataview = (dataview: Dataview) => {
  return {
    id: `${kebabCase(dataview.name)}-${Date.now()}`,
    dataviewId: dataview.slug,
  }
}

export const getBigQuery4WingsDataviewInstance = (
  datasetId: string,
  { aggregationOperation = FourwingsAggregationOperation.Sum } = {}
): DataviewInstance<DataviewType> => {
  const contextDataviewInstance = {
    id: `${BIG_QUERY_4WINGS_PREFIX}${Date.now()}`,
    config: {
      colorCyclingType: 'fill' as ColorCyclingType,
      aggregationOperation,
    },
    dataviewId: TEMPLATE_ACTIVITY_DATAVIEW_SLUG,
    datasetsConfig: [
      {
        datasetId,
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: EndpointId.FourwingsTiles,
      },
    ],
  }
  return contextDataviewInstance
}

export const getBigQueryEventsDataviewInstance = (
  datasetId: string
): DataviewInstance<DataviewType> => {
  const contextDataviewInstance = {
    id: `${BIG_QUERY_EVENTS_PREFIX}${Date.now()}`,
    dataviewId: TEMPLATE_CLUSTERS_DATAVIEW_SLUG,
    datasetsConfig: [
      {
        datasetId,
        params: [],
        endpoint: EndpointId.ClusterTiles,
      },
    ],
  }
  return contextDataviewInstance
}

export const dataviewWithPrivateDatasets = (dataview: UrlDataviewInstance) => {
  const datasets = dataview.datasets || []
  return datasets.some(isPrivateDataset)
}

export const getVesselInWorkspace = (vesselInstances: UrlDataviewInstance[], vesselId: string) => {
  if (!vesselId) return null
  const vesselInWorkspace = vesselInstances.find((v) => {
    const vesselDatasetConfig = v.datasetsConfig?.find(
      (datasetConfig) => datasetConfig.endpoint === EndpointId.Vessel
    )
    const isVesselInEndpointParams = vesselDatasetConfig?.params?.find(
      (p) => p.id === 'vesselId' && p.value === vesselId
    )
    const isInVesselRelatedIds = v.config?.relatedVesselIds?.includes(vesselId)
    return isVesselInEndpointParams || isInVesselRelatedIds ? v : undefined
  })
  return vesselInWorkspace
}

export const isBathymetryDataview = (dataview: UrlDataviewInstance) => {
  return dataview.id.includes('bathymetry')
}

export const getIsPositionSupportedInDataview = (dataview: UrlDataviewInstance) => {
  const datasets = getActiveDatasetsInDataview(dataview)
  return datasets?.some(({ schema }) => {
    return schema?.['bearing'] !== undefined
  })
}
