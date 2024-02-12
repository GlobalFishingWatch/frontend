import { groupBy } from 'lodash'
import { DatasetTypes, EventTypes, Resource } from '@globalfishingwatch/api-types'
import {
  isHeatmapAnimatedDataview,
  isTrackDataview,
  resolveDataviewDatasetResource,
  resolveDataviewDatasetResources,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { API_GATEWAY } from '@globalfishingwatch/layer-composer'
import {
  DeckLayersGeneratorDictionary,
  DeckLayersGeneratorType,
  VesselDeckLayersGenerator,
} from '../layer-composer/types'
import { FourwingsDeckSublayer } from '../layers/fourwings/fourwings.types'
import { FourwingsDataviewCategory, FourwingsDeckLayerGenerator } from './types/fourwings'

type DataviewsGeneratorResource = Record<string, Resource>

const getVesselDataviewGenerator = (
  dataviews: UrlDataviewInstance[],
  resources: DataviewsGeneratorResource
): VesselDeckLayersGenerator[] => {
  return dataviews.map((dataview): VesselDeckLayersGenerator => {
    const { url: infoUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
    const vesselInfo = (resources[infoUrl] as any)?.data
    return {
      id: dataview.id,
      type: DeckLayersGeneratorType.Vessels,
      name: vesselInfo?.shipname,
      visible: dataview.config?.visible ?? true,
      color: dataview.config?.color as string,
      trackUrl: `${API_GATEWAY}${resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)
        ?.url}`,
      events: resolveDataviewDatasetResources(dataview, DatasetTypes.Events).map((resource) => {
        const eventType = resource.dataset?.subcategory as EventTypes
        return {
          type: eventType,
          url: `${API_GATEWAY}${resource.url}`,
        }
      }),
    }
  })
}

const getFourwingsDataviewGenerator = (
  dataviews: UrlDataviewInstance[]
): FourwingsDeckLayerGenerator[] => {
  const dataviewByGroup = groupBy(dataviews, (dataview) => dataview.category)
  return Object.entries(dataviewByGroup).map(
    ([category, dataviews]): FourwingsDeckLayerGenerator => {
      // const category = dataview.category as FourwingsDataviewCategory | undefined
      const sublayers: FourwingsDeckSublayer[] = dataviews.map((dataview) => ({
        id: dataview.id,
        visible: dataview.config?.visible ?? true,
        datasets: dataview.config?.datasets,
        config: {
          color: dataview.config?.color as string,
          colorRamp: dataview.config?.colorRamp,
          visible: dataview.config?.visible,
        },
      }))
      return {
        id: category as FourwingsDataviewCategory,
        type: DeckLayersGeneratorType.Fourwings,
        sublayers,
      }
    }
  )
}

export function getDataviewsGeneratorsDictionary(
  dataviews: UrlDataviewInstance[],
  resources: DataviewsGeneratorResource
): DeckLayersGeneratorDictionary {
  const vesselDataviews = dataviews.filter((dataview) => isTrackDataview(dataview))
  const fourwingsDataviews = dataviews.filter((dataview) => isHeatmapAnimatedDataview(dataview))

  return {
    [DeckLayersGeneratorType.Vessels]: getVesselDataviewGenerator(vesselDataviews, resources),
    [DeckLayersGeneratorType.Fourwings]: getFourwingsDataviewGenerator(fourwingsDataviews),
  }
}