import { DatasetTypes, EventType, Resource } from '@globalfishingwatch/api-types'
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
import { FourwingsDataviewCategory, FourwingsDeckLayerGenerator } from './types/fourwings'

type DataviewsGeneratorResource = Record<string, Resource>

export function getDataviewsGeneratorsDictionary(
  dataviews: UrlDataviewInstance[],
  resources: DataviewsGeneratorResource
): DeckLayersGeneratorDictionary {
  return {
    [DeckLayersGeneratorType.Vessels]: dataviews
      .filter((dataview) => isTrackDataview(dataview))
      .map((dataview): VesselDeckLayersGenerator => {
        const { url: infoUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
        const vesselInfo = (resources[infoUrl] as any)?.data
        return {
          id: dataview.id,
          type: DeckLayersGeneratorType.Vessels,
          name: vesselInfo?.shipname,
          visible: dataview.config?.visible ?? true,
          color: dataview.config?.color as string,
          trackUrl: `${API_GATEWAY}${
            resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)?.url
          }`,
          events: resolveDataviewDatasetResources(dataview, DatasetTypes.Events).map((resource) => {
            const data = resources?.[resource.url]?.data
            const eventType = resource.dataset?.subcategory as EventType
            return {
              type: eventType,
              url: `${API_GATEWAY}${resource.url}`,
              // TODO: should we parse events just once?
              ...(data && { data: parseEvents(data) }),
            }
          }),
        }
      }),
    [DeckLayersGeneratorType.Fourwings]: dataviews
      .filter((dataview) => isHeatmapAnimatedDataview(dataview))
      .reduce(
        (acc, dataview): { [key in FourwingsDataviewCategory]: FourwingsDeckLayerGenerator[] } => {
          const category = dataview.category as FourwingsDataviewCategory | undefined
          const generator: FourwingsDeckLayerGenerator = {
            id: dataview.id,
            category: category!,
            visible: dataview.config?.visible ?? true,
            type: DeckLayersGeneratorType.Fourwings,
            sublayers: [
              {
                id: dataview.id,
                datasets: dataview.config?.datasets,
                config: {
                  color: dataview.config?.color as string,
                  colorRamp: dataview.config?.colorRamp,
                  visible: dataview.config?.visible,
                },
              },
            ],
          }
          if (acc[category!]) {
            return {
              ...acc,
              [category!]: [...acc[category!], generator],
            }
          } else {
            return {
              ...acc,
              [category!]: [generator],
            }
          }
          // }
        },
        {} as { [key in FourwingsDataviewCategory]: FourwingsDeckLayerGenerator[] }
      ),
  }
}
