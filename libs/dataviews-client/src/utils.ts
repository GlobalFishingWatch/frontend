import {
  ColorCyclingType,
  DataviewDatasetConfig,
  DataviewInstance,
  EndpointId,
  VesselInstanceDatasets,
} from '@globalfishingwatch/api-types'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
export const VESSEL_DATAVIEW_INSTANCE_PREFIX = 'vessel-'

export const getVesselDataviewInstanceDatasetConfig = (
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
  datasets: VesselInstanceDatasets,
  dataviewId: number
): DataviewInstance<GeneratorType> => {
  const vesselDataviewInstance = {
    id: `${VESSEL_DATAVIEW_INSTANCE_PREFIX}${vessel.id}`,
    ...vesselDataviewInstanceTemplate(dataviewId),
    datasetsConfig: getVesselDataviewInstanceDatasetConfig(vessel.id, datasets),
  }
  return vesselDataviewInstance
}
