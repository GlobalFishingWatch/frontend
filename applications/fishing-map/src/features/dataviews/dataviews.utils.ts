import {
  ColorCyclingType,
  Dataset,
  DataviewCategory,
  DataviewDatasetConfig,
  DataviewInstance,
  EndpointId,
} from '@globalfishingwatch/api-types'
import { Generators } from '@globalfishingwatch/layer-composer'
import {
  DEFAULT_ENVIRONMENT_DATAVIEW_ID,
  DEFAULT_CONTEXT_DATAVIEW_ID,
  DEFAULT_FISHING_DATAVIEW_ID,
  DEFAULT_VESSEL_DATAVIEW_ID,
  DEFAULT_PRESENCE_DATAVIEW_ID,
  DEFAULT_USER_TRACK_ID,
} from 'data/workspaces'

// used in workspaces with encounter events layers
export const ENCOUNTER_EVENTS_SOURCE_ID = 'encounter-events'
export const FISHING_LAYER_PREFIX = 'fishing-'
export const VESSEL_LAYER_PREFIX = 'vessel-'
export const ENVIRONMENTAL_LAYER_PREFIX = 'environment-'
export const CONTEXT_LAYER_PREFIX = 'context-'
export const PRESENCE_LAYER_ID = 'presence'
export const VESSEL_DATAVIEW_INSTANCE_PREFIX = 'vessel-'

type VesselInstanceDatasets = {
  trackDatasetId: string
  infoDatasetId: string
  eventsDatasetId?: string
}
export const getVesselDataviewInstance = (
  vessel: { id: string },
  { trackDatasetId, infoDatasetId, eventsDatasetId }: VesselInstanceDatasets
): DataviewInstance<Generators.Type> => {
  const datasetsConfig: DataviewDatasetConfig[] = [
    {
      datasetId: trackDatasetId,
      params: [{ id: 'vesselId', value: vessel.id }],
      endpoint: EndpointId.Tracks,
    },
    {
      datasetId: infoDatasetId,
      params: [{ id: 'vesselId', value: vessel.id }],
      endpoint: EndpointId.Vessel,
    },
  ]
  if (eventsDatasetId) {
    datasetsConfig.push({
      datasetId: eventsDatasetId,
      query: [{ id: 'vessels', value: vessel.id }],
      params: [],
      endpoint: EndpointId.Events,
    })
  }
  const vesselDataviewInstance = {
    id: `${VESSEL_DATAVIEW_INSTANCE_PREFIX}${vessel.id}`,
    dataviewId: DEFAULT_VESSEL_DATAVIEW_ID,
    config: {
      colorCyclingType: 'line' as ColorCyclingType,
    },
    datasetsConfig,
  }
  return vesselDataviewInstance
}

export const getFishingDataviewInstance = (): DataviewInstance<Generators.Type> => {
  return {
    id: `${FISHING_LAYER_PREFIX}${Date.now()}`,
    config: {
      colorCyclingType: 'fill' as ColorCyclingType,
    },
    dataviewId: DEFAULT_FISHING_DATAVIEW_ID,
  }
}

export const getPresenceDataviewInstance = (): DataviewInstance<Generators.Type> => {
  return {
    id: `${PRESENCE_LAYER_ID}-${Date.now()}`,
    config: {
      colorCyclingType: 'fill' as ColorCyclingType,
    },
    dataviewId: DEFAULT_PRESENCE_DATAVIEW_ID,
  }
}

export const getEnvironmentDataviewInstance = (
  datasetId: string
): DataviewInstance<Generators.Type> => {
  const environmentalDataviewInstance = {
    id: `${ENVIRONMENTAL_LAYER_PREFIX}${Date.now()}`,
    category: DataviewCategory.Environment,
    config: {
      colorCyclingType: 'fill' as ColorCyclingType,
    },
    dataviewId: DEFAULT_ENVIRONMENT_DATAVIEW_ID,
    datasetsConfig: [
      {
        datasetId,
        params: [],
        endpoint: EndpointId.UserContextTiles,
      },
    ],
  }
  return environmentalDataviewInstance
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
    dataviewId: DEFAULT_USER_TRACK_ID,
    config: {
      colorCyclingType: 'line' as ColorCyclingType,
    },
    datasetsConfig,
  }
  return dataviewInstance
}

export const getContextDataviewInstance = (
  datasetId: string
): DataviewInstance<Generators.Type> => {
  const contextDataviewInstance = {
    id: `${CONTEXT_LAYER_PREFIX}${Date.now()}`,
    category: DataviewCategory.Context,
    config: {
      colorCyclingType: 'line' as ColorCyclingType,
    },
    dataviewId: DEFAULT_CONTEXT_DATAVIEW_ID,
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
