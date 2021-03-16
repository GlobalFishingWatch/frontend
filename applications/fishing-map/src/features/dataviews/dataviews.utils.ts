import { DataviewCategory, DataviewInstance } from '@globalfishingwatch/api-types'
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
  DEFAULT_VESSEL_EVENTS_DATAVIEW_ID,
} from 'data/workspaces'

export const VESSEL_DATAVIEW_INSTANCE_PREFIX = 'vessel-'

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
      endpoint: 'carriers-tracks',
    },
    {
      datasetId: infoDatasetId,
      params: [{ id: 'vesselId', value: vessel.id }],
      endpoint: 'carriers-vessel',
    },
  ]
  const vesselDataviewInstance = {
    id: `${VESSEL_DATAVIEW_INSTANCE_PREFIX}${vessel.id}`,
    dataviewId: DEFAULT_VESSEL_DATAVIEW_ID,
    config: {
      color: TrackColorBarOptions[Math.floor(Math.random() * TrackColorBarOptions.length)].value,
    },
    datasetsConfig,
  }
  return vesselDataviewInstance
}

export const VESSEL_EVENTS_DATAVIEW_INSTANCE_PREFIX = 'vessel_events-'
export const getVesselEventsDataviewInstance = (
  vessel: { id: string },
  eventsDatasetId: string
): DataviewInstance<Generators.Type> => {
  const datasetsConfig = [
    {
      datasetId: eventsDatasetId,
      query: [{ id: 'vessels', value: vessel.id }],
      params: [],
      endpoint: 'carriers-events',
    },
  ]
  const vesselEventsDataviewInstance = {
    id: `${VESSEL_EVENTS_DATAVIEW_INSTANCE_PREFIX}${vessel.id}`,
    dataviewId: DEFAULT_VESSEL_EVENTS_DATAVIEW_ID,
    config: {},
    datasetsConfig,
  }
  return vesselEventsDataviewInstance
}

export const getHeatmapDataviewInstance = (
  usedRamps: string[] = []
): DataviewInstance<Generators.Type> => {
  const notUsedOptions = HeatmapColorBarOptions.filter((option) => !usedRamps.includes(option.id))
  const colorOption = notUsedOptions?.length > 0 ? notUsedOptions[0] : HeatmapColorBarOptions[0]
  const heatmapDataviewInstance = {
    id: `fishing-${Date.now()}`,
    config: {
      color: colorOption.value,
      colorRamp: colorOption.id,
    },
    dataviewId: DEFAULT_FISHING_DATAVIEW_ID,
  }
  return heatmapDataviewInstance
}

export const getEnvironmentDataviewInstance = (
  datasetId: string,
  usedRamp: string[] = []
): DataviewInstance<Generators.Type> => {
  const notUsedOptions = HeatmapColorBarOptions.filter((option) => !usedRamp.includes(option.id))
  const colorOption = notUsedOptions?.length > 0 ? notUsedOptions[0] : TrackColorBarOptions[0]
  const environmentalDataviewInstance = {
    id: `environmental-${Date.now()}`,
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
        endpoint: 'user-context-tiles',
      },
    ],
  }
  return environmentalDataviewInstance
}

export const getContextDataviewInstance = (
  datasetId: string,
  usedColors: string[] = []
): DataviewInstance<Generators.Type> => {
  const notUsedOptions = TrackColorBarOptions.filter((option) => !usedColors.includes(option.value))
  const colorOption = notUsedOptions?.length > 0 ? notUsedOptions[0] : TrackColorBarOptions[0]
  const contextDataviewInstance = {
    id: `context-${Date.now()}`,
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
