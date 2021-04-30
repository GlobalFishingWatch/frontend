import {
  Dataset,
  DataviewCategory,
  DataviewInstance,
  EndpointId,
} from '@globalfishingwatch/api-types'
import {
  TrackColorBarOptions,
  HeatmapColorBarOptions,
} from '@globalfishingwatch/ui-components/dist/color-bar'
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
export const VESSEL_LAYER_PREFIX = 'vessel-'
export const ENVIRONMENTAL_LAYER_PREFIX = 'environment-'
export const CONTEXT_LAYER_PREFIX = 'context-'

type VesselInstanceDatasets = {
  trackDatasetId: string
  infoDatasetId: string
}
export const getVesselDataviewInstance = (
  vessel: { id: string },
  { trackDatasetId, infoDatasetId }: VesselInstanceDatasets
): DataviewInstance<Generators.Type> => {
  const datasetsConfig = [
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
  const vesselDataviewInstance = {
    id: `${VESSEL_LAYER_PREFIX}${vessel.id}`,
    dataviewId: DEFAULT_VESSEL_DATAVIEW_ID,
    config: {
      // TODO pick a not used color
      color: TrackColorBarOptions[Math.floor(Math.random() * TrackColorBarOptions.length)].value,
    },
    datasetsConfig,
  }
  return vesselDataviewInstance
}

export const getActivityDataviewInstance = (
  usedRamps: string[] = []
): DataviewInstance<Generators.Type> => {
  const notUsedOptions = HeatmapColorBarOptions.filter((option) => !usedRamps.includes(option.id))
  const colorOption = notUsedOptions?.length > 0 ? notUsedOptions[0] : HeatmapColorBarOptions[0]
  return {
    id: `fishing-${Date.now()}`,
    config: {
      color: colorOption.value,
      colorRamp: colorOption.id,
    },
    dataviewId: DEFAULT_FISHING_DATAVIEW_ID,
  }
}

export const getPresenceDataviewInstance = (
  usedRamps: string[] = []
): DataviewInstance<Generators.Type> => {
  const notUsedOptions = HeatmapColorBarOptions.filter((option) => !usedRamps.includes(option.id))
  const colorOption = notUsedOptions?.length > 0 ? notUsedOptions[0] : HeatmapColorBarOptions[0]
  return {
    id: `presence-${Date.now()}`,
    config: {
      color: colorOption.value,
      colorRamp: colorOption.id,
    },
    dataviewId: DEFAULT_PRESENCE_DATAVIEW_ID,
  }
}

export const getEnvironmentDataviewInstance = (
  datasetId: string,
  usedRamp: string[] = []
): DataviewInstance<Generators.Type> => {
  const notUsedOptions = HeatmapColorBarOptions.filter((option) => !usedRamp.includes(option.id))
  const colorOption = notUsedOptions?.length > 0 ? notUsedOptions[0] : TrackColorBarOptions[0]
  const environmentalDataviewInstance = {
    id: `${ENVIRONMENTAL_LAYER_PREFIX}${Date.now()}`,
    category: DataviewCategory.Environment,
    config: {
      color: colorOption.value,
      colorRamp: colorOption.id,
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
      // TODO pick a not used color
      color: TrackColorBarOptions[Math.floor(Math.random() * TrackColorBarOptions.length)].value,
    },
    datasetsConfig,
  }
  return dataviewInstance
}

export const getContextDataviewInstance = (
  datasetId: string,
  usedColors: string[] = []
): DataviewInstance<Generators.Type> => {
  const notUsedOptions = TrackColorBarOptions.filter((option) => !usedColors.includes(option.value))
  const colorOption = notUsedOptions?.length > 0 ? notUsedOptions[0] : TrackColorBarOptions[0]
  const contextDataviewInstance = {
    id: `${CONTEXT_LAYER_PREFIX}${Date.now()}`,
    category: DataviewCategory.Context,
    config: {
      color: colorOption.value,
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
