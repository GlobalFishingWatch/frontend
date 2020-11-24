import { DataviewInstance } from '@globalfishingwatch/api-types'
import { TrackColorBarOptions } from '@globalfishingwatch/ui-components/dist/color-bar'
import { Generators } from '@globalfishingwatch/layer-composer'
import { DEFAULT_FISHING_DATAVIEW_ID, DEFAULT_VESSEL_DATAVIEW_ID } from 'data/datasets'

export const DATAVIEW_INSTANCE_PREFIX = 'vessel-'

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
    id: `${DATAVIEW_INSTANCE_PREFIX}${vessel.id}`,
    dataviewId: DEFAULT_VESSEL_DATAVIEW_ID,
    config: {
      color: TrackColorBarOptions[Math.floor(Math.random() * TrackColorBarOptions.length)].value,
    },
    datasetsConfig,
  }
  return vesselDataviewInstance
}

export const getHeatmapDataviewInstance = (): DataviewInstance<Generators.Type> => {
  const vesselDataviewInstance = {
    id: `fishing-${Date.now()}`,
    // TODO choose next heatmap color available different from existing dataviews
    config: {},
    dataviewId: DEFAULT_FISHING_DATAVIEW_ID,
  }
  return vesselDataviewInstance
}
