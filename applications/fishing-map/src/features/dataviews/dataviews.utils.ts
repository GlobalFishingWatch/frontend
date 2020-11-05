import { Dataset, DataviewInstance } from '@globalfishingwatch/api-types'
import { TrackColorBarOptions } from '@globalfishingwatch/ui-components/dist/color-bar'
import { Generators } from '@globalfishingwatch/layer-composer'
import { DEFAULT_VESSEL_DATAVIEW_ID } from 'data/datasets'

export const getVesselDataviewInstance = (
  vessel: { id: string },
  trackDatasets: Dataset[],
  infoDatasets: Dataset[]
): DataviewInstance<Generators.Type> => {
  const datasetsConfig = [
    ...trackDatasets.map((dataset) => ({
      datasetId: dataset?.id as string,
      params: [{ id: 'vesselId', value: vessel.id }],
      endpoint: 'carriers-tracks',
    })),
    ...infoDatasets.map((dataset) => ({
      datasetId: dataset?.id as string,
      params: [{ id: 'vesselId', value: vessel.id }],
      endpoint: 'carriers-vessel',
    })),
  ]
  console.log('datasetsConfig', datasetsConfig)
  const vesselDataviewInstance = {
    id: `vessel-${vessel.id}`,
    dataviewId: DEFAULT_VESSEL_DATAVIEW_ID,
    config: {
      color: TrackColorBarOptions[Math.floor(Math.random() * TrackColorBarOptions.length)].value,
    },
    datasetsConfig,
  }
  return vesselDataviewInstance
}
