import { kebabCase } from 'lodash'
import {
  ColorCyclingType,
  Dataset,
  Dataview,
  DataviewCategory,
  DataviewDatasetConfig,
  DataviewInstance,
  EndpointId,
} from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import {
  TEMPLATE_ENVIRONMENT_DATAVIEW_ID,
  TEMPLATE_CONTEXT_DATAVIEW_ID,
  FISHING_DATAVIEW_ID,
  TEMPLATE_VESSEL_DATAVIEW_ID,
  TEMPLATE_USER_TRACK_ID,
  VESSEL_PRESENCE_DATAVIEW_ID,
  TEMPLATE_POINTS_DATAVIEW_ID,
} from 'data/workspaces'
import { isPrivateDataset } from 'features/datasets/datasets.utils'

// used in workspaces with encounter events layers
export const ENCOUNTER_EVENTS_SOURCE_ID = 'encounter-events'
export const FISHING_LAYER_PREFIX = 'fishing-'
export const VESSEL_LAYER_PREFIX = 'vessel-'
export const ENVIRONMENTAL_LAYER_PREFIX = 'environment-'
export const CONTEXT_LAYER_PREFIX = 'context-'
export const VESSEL_DATAVIEW_INSTANCE_PREFIX = 'vessel-'

type VesselInstanceDatasets = {
  trackDatasetId?: string
  infoDatasetId?: string
  eventsDatasetsId?: string[]
}

const getVesselDataviewInstanceDatasetConfig = (
  vesselId: string,
  { trackDatasetId, infoDatasetId, eventsDatasetsId }: VesselInstanceDatasets
) => {
  const datasetsConfig: DataviewDatasetConfig[] = []
  if (infoDatasetId) {
    datasetsConfig.push({
      datasetId: infoDatasetId,
      params: [{ id: 'vesselId', value: vesselId }],
      endpoint: EndpointId.Vessel,
    })
  }
  if (trackDatasetId) {
    datasetsConfig.push({
      datasetId: trackDatasetId,
      params: [{ id: 'vesselId', value: vesselId }],
      endpoint: EndpointId.Tracks,
    })
  }
  if (eventsDatasetsId) {
    eventsDatasetsId.forEach((eventDatasetId) => {
      datasetsConfig.push({
        datasetId: eventDatasetId,
        query: [{ id: 'vessels', value: vesselId }],
        params: [],
        endpoint: EndpointId.Events,
      })
    })
  }
  return datasetsConfig
}

const vesselDataviewInstanceTemplate = (dataviewId: number) => {
  return {
    // TODO find the way to use different vessel dataviews, for example
    // panama and peru doesn't show events and needed a workaround to work with this
    dataviewId,
    config: {
      colorCyclingType: 'line' as ColorCyclingType,
    },
  }
}

export const getVesselDataviewInstance = (
  vessel: { id: string },
  datasets: VesselInstanceDatasets
): DataviewInstance<GeneratorType> => {
  const vesselDataviewInstance = {
    id: `${VESSEL_DATAVIEW_INSTANCE_PREFIX}${vessel.id}`,
    ...vesselDataviewInstanceTemplate(TEMPLATE_VESSEL_DATAVIEW_ID),
    datasetsConfig: getVesselDataviewInstanceDatasetConfig(vessel.id, datasets),
  }
  return vesselDataviewInstance
}

export const getPresenceVesselDataviewInstance = (
  vessel: { id: string },
  datasets: VesselInstanceDatasets
): DataviewInstance<GeneratorType> => {
  const vesselDataviewInstance = {
    id: `${VESSEL_DATAVIEW_INSTANCE_PREFIX}${vessel.id}`,
    ...vesselDataviewInstanceTemplate(VESSEL_PRESENCE_DATAVIEW_ID),
    datasetsConfig: getVesselDataviewInstanceDatasetConfig(vessel.id, datasets),
  }
  return vesselDataviewInstance
}

export const getFishingDataviewInstance = (): DataviewInstance<GeneratorType> => {
  return {
    id: `${FISHING_LAYER_PREFIX}${Date.now()}`,
    config: {
      colorCyclingType: 'fill' as ColorCyclingType,
    },
    dataviewId: FISHING_DATAVIEW_ID,
  }
}

export const getBaseEnvironmentDataviewInstance = ({
  dataviewId,
  datasetId,
}: {
  dataviewId: number
  datasetId: string
}): DataviewInstance<GeneratorType> => {
  return {
    id: `${ENVIRONMENTAL_LAYER_PREFIX}${Date.now()}`,
    category: DataviewCategory.Environment,
    config: {
      colorCyclingType: 'fill' as ColorCyclingType,
    },
    dataviewId,
    datasetsConfig: [
      {
        datasetId,
        params: [],
        endpoint: EndpointId.UserContextTiles,
      },
    ],
  }
}

export const getEnvironmentDataviewInstance = (
  datasetId: string
): DataviewInstance<GeneratorType> => {
  const environmentalDataviewInstance = getBaseEnvironmentDataviewInstance({
    dataviewId: TEMPLATE_ENVIRONMENT_DATAVIEW_ID,
    datasetId,
  })
  return environmentalDataviewInstance
}

export const getUserPointsDataviewInstance = (
  datasetId: string
): DataviewInstance<GeneratorType> => {
  const userPointDataviewInstance = getBaseEnvironmentDataviewInstance({
    dataviewId: TEMPLATE_POINTS_DATAVIEW_ID,
    datasetId,
  })
  return userPointDataviewInstance
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
    dataviewId: TEMPLATE_USER_TRACK_ID,
    config: {
      colorCyclingType: 'line' as ColorCyclingType,
    },
    datasetsConfig,
  }
  return dataviewInstance
}

export const getContextDataviewInstance = (datasetId: string): DataviewInstance<GeneratorType> => {
  const contextDataviewInstance = {
    id: `${CONTEXT_LAYER_PREFIX}${Date.now()}`,
    category: DataviewCategory.Context,
    config: {
      colorCyclingType: 'line' as ColorCyclingType,
    },
    dataviewId: TEMPLATE_CONTEXT_DATAVIEW_ID,
    datasetsConfig: [
      {
        datasetId,
        params: [],
        endpoint: 'user-context-tiles',
      },
    ],
  }
  return contextDataviewInstance
}

export const getDataviewInstanceFromDataview = (dataview: Dataview) => {
  return {
    id: `${kebabCase(dataview.name)}-${Date.now()}`,
    dataviewId: dataview.id,
  }
}

export const getActivityDataviewInstanceFromDataview = (
  dataview?: Dataview
): DataviewInstance<GeneratorType> | undefined => {
  if (!dataview) return
  const instance = getDataviewInstanceFromDataview(dataview)
  return {
    ...instance,
    config: {
      colorCyclingType: 'fill' as ColorCyclingType,
    },
  }
}

export const dataviewWithPrivateDatasets = (dataview: UrlDataviewInstance) => {
  const datasets = dataview.datasets || []
  return datasets.some(isPrivateDataset)
}
