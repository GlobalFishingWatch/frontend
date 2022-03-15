import { DatasetTypes, DataviewDatasetConfig, EndpointId, Resource } from "@globalfishingwatch/api-types";
import { GeneratorType } from "@globalfishingwatch/layer-composer";
import { getDatasetConfigByDatasetType, getDatasetConfigsByDatasetType, UrlDataviewInstance } from "../resolve-dataviews";
import { resolveEndpoint } from "../resolve-endpoint";

export const getResources = (
  dataviews: UrlDataviewInstance[],
  trackDatasetConfigsCallback?: (datasetConfigs: DataviewDatasetConfig[]) => DataviewDatasetConfig[]
): { resources: Resource[], dataviews: UrlDataviewInstance[] } => {
  // We are only interested in tracks for now
  const trackDataviews = dataviews
    .filter((dataview) => dataview.config?.type === GeneratorType.Track)
  const otherDataviews = dataviews
    .filter((dataview) => dataview.config?.type !== GeneratorType.Track)

  // Create dataset configs needed to load all tracks related endpoints
  const trackDataviewsWithDatasetConfigs = trackDataviews.map((dataview) => {
    const info = getDatasetConfigByDatasetType(dataview, DatasetTypes.Vessels)

    const trackDatasetType =
      dataview.datasets && dataview.datasets?.[0]?.type === DatasetTypes.UserTracks
        ? DatasetTypes.UserTracks
        : DatasetTypes.Tracks
    const track = { ...getDatasetConfigByDatasetType(dataview, trackDatasetType) }
  
    const events = getDatasetConfigsByDatasetType(dataview, DatasetTypes.Events).filter(
      (datasetConfig) => datasetConfig.query?.find((q) => q.id === 'vessels')?.value
    ) // Loitering

    let preparedDatasetConfigs = [info, track, ...events]

    if (trackDatasetConfigsCallback) {
      preparedDatasetConfigs = trackDatasetConfigsCallback(preparedDatasetConfigs)
    }

    const preparedDataview = {
      ...dataview,
      datasetsConfig: preparedDatasetConfigs,
    }
    return preparedDataview
  })

  // resolve urls for info, track, events etc endpoints (only resolve info if dv not visible)
  const trackResources = trackDataviewsWithDatasetConfigs
    .flatMap((dataview) => {
      if (!dataview.datasetsConfig) return []
      return dataview.datasetsConfig.flatMap((datasetConfig) => {
        // Only load info endpoint when dataview visibility is set to false
        if (!dataview.config?.visible && datasetConfig.endpoint !== EndpointId.Vessel) return []
        const dataset = dataview.datasets?.find((dataset) => dataset.id === datasetConfig.datasetId)
        if (!dataset) return []
        const url = resolveEndpoint(dataset, datasetConfig)
        if (!url) return []
        return [{ dataset, datasetConfig, url, dataviewId: dataview.dataviewId as number }]
      })
    })
  
  return { 
    resources: trackResources,
    dataviews: [
      ...trackDataviewsWithDatasetConfigs,
      ...otherDataviews
    ]
  }
}
