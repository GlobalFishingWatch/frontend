import { Dataset, DataviewInstance } from '@globalfishingwatch/dataviews-client'

export const getVesselDataviewInstance = (
  vessel: any, // TODO: use vessel api-types here
  trackDatasets: Dataset[],
  infoDatasets: Dataset[]
) => {
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
    datasetsConfig,
  }
  return vesselDataviewInstance
}
