import { DatasetTypes, Resource } from '@globalfishingwatch/api-types'
import {
  isHeatmapAnimatedDataview,
  isTrackDataview,
  resolveDataviewDatasetResource,
  resolveDataviewDatasetResources,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import {
  API_GATEWAY,
  DeckLayersGeneratorDictionary,
  DeckLayersGeneratorType,
  VesselDeckLayersGenerator,
} from '@globalfishingwatch/deck-layers'
import { parseEvents } from '../loaders/vessels/eventsLoader'

type DataviewsGeneratorResource = Record<string, Resource>

export function getDataviewsGeneratorsDictionary(
  dataviews: UrlDataviewInstance[],
  resources: DataviewsGeneratorResource
): DeckLayersGeneratorDictionary {
  const vesselsDataviews = dataviews.filter((dataview) => isTrackDataview(dataview))
  return {
    [DeckLayersGeneratorType.Vessels]: vesselsDataviews.map(
      (dataview): VesselDeckLayersGenerator => {
        return {
          id: dataview.id,
          color: dataview.config?.color as string,
          trackUrl: `${API_GATEWAY}${
            resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)?.url
          }`,
          events: resolveDataviewDatasetResources(dataview, DatasetTypes.Events).map((resource) => {
            const data = resources?.[resource.url]?.data
            return {
              url: `${API_GATEWAY}${resource.url}`,
              // TODO: should we parse events just once?
              data: data ? parseEvents(data) : [],
            }
          }),
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
