import { Dataset, DataviewInstance } from '@globalfishingwatch/api-types'
import { TrackColorBarOptions } from '@globalfishingwatch/ui-components/dist/color-bar'

export const getVesselDataviewInstance = (
  vessel: { id: string },
  trackDatasets: Dataset[],
  infoDatasets: Dataset[]
): DataviewInstance => {
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
  const vesselDataviewInstance: DataviewInstance = {
    id: `vessel-${vessel.id}`,
    dataviewId: 4,
    config: {
      color: TrackColorBarOptions[Math.floor(Math.random() * TrackColorBarOptions.length)].value,
    },
    datasetsConfig,
  }
  return vesselDataviewInstance
}
