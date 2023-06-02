import { DatasetTypes, ApiEvent, Resource } from '@globalfishingwatch/api-types'
import {
  isHeatmapAnimatedDataview,
  isTrackDataview,
  resolveDataviewDatasetResource,
  resolveDataviewDatasetResources,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import {
  DeckLayersGeneratorDictionary,
  DeckLayersGeneratorType,
  VesselDeckLayersGenerator,
} from '@globalfishingwatch/deck-layers'

type DataviewsGeneratorResource = Record<string, Resource>

function getEventsData(
  dataview: UrlDataviewInstance,
  resources: DataviewsGeneratorResource
): ApiEvent[] {
  const eventsResources = resolveDataviewDatasetResources(dataview, DatasetTypes.Events)
  const hasEventData =
    eventsResources?.length && eventsResources.some(({ url }) => resources?.[url]?.data)
  if (!hasEventData) return []
  return eventsResources.flatMap(({ url }) => (url ? resources?.[url]?.data || [] : []))
}

export function getDataviewsGeneratorsDictionary(
  dataviews: UrlDataviewInstance[],
  resources?: DataviewsGeneratorResource
): DeckLayersGeneratorDictionary {
  const vesselsDataviews = dataviews.filter((dataview) => isTrackDataview(dataview))
  debugger
  return {
    [DeckLayersGeneratorType.Vessels]: vesselsDataviews.map(
      (dataview): VesselDeckLayersGenerator => {
        return {
          id: dataview.id,
          color: dataview.config?.color as string,
          trackUrl: resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)?.url,
          eventsData: resources ? getEventsData(dataview, resources) : [],
          eventsUrls: resolveDataviewDatasetResources(dataview, DatasetTypes.Events).map(
            (resources) => resources.url
          ),
        }
      }
    ),
    [DeckLayersGeneratorType.Fourwings]: dataviews
      .filter((dataview) => isHeatmapAnimatedDataview(dataview))
      .map((dataview) => ({
        id: dataview.id,
        dataview,
      })),
  }
}
