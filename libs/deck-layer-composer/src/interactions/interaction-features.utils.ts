import {
  ContextLayer,
  ContextPickingObject,
  FourwingsLayer,
  FourwingsPickingObject,
} from '@globalfishingwatch/deck-layers'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { VALUE_MULTIPLIER } from '@globalfishingwatch/fourwings-aggregate'
import { DeckLayerInteractionFeature } from '../types'
import { ExtendedFeature } from './types'

export const filterUniqueFeatureInteraction = (features: ExtendedFeature[]) => {
  const uniqueLayerIdFeatures: Record<string, string> = {}
  const filtered = features?.filter(({ layerId, id, uniqueFeatureInteraction }) => {
    if (!uniqueFeatureInteraction) {
      return true
    }
    if (uniqueLayerIdFeatures[layerId] === undefined) {
      uniqueLayerIdFeatures[layerId] = id
      return true
    }
    return uniqueLayerIdFeatures[layerId] === id
  })
  return filtered
}

const getExtendedFeature = (feature: DeckLayerInteractionFeature): ExtendedFeature[] => {
  // const generatorType = feature.layer.metadata?.generatorType ?? null
  // const generatorId = feature.layer.metadata?.generatorId ?? null

  // TODO: if no generatorMetadata is found, fallback to feature.layer.metadata, but the former should be prefered
  // let generatorMetadata: any
  // if (generatorId && metadata?.generatorsMetadata && metadata?.generatorsMetadata[generatorId]) {
  //   generatorMetadata = metadata?.generatorsMetadata[generatorId]
  // } else {
  //   generatorMetadata = feature.layer.metadata
  // }

  // TODO:deck implement the uniqueFeatureInteraction feature inside the getPickingInfo
  // const uniqueFeatureInteraction = feature?.metadata?.uniqueFeatureInteraction ?? false
  // TODO:deck implement the stopPropagation feature
  // const stopPropagation = feature.layer?.metadata?.stopPropagation ?? false

  const extendedFeature: ExtendedFeature = {
    ...feature.object,
    layerId: feature.layer.id,
    // uniqueFeatureInteraction,
    // stopPropagation,
  }

  if (feature.layer instanceof FourwingsLayer) {
    const object = feature.object as FourwingsPickingObject
    if (feature.layer?.props.static) {
      return [
        {
          ...extendedFeature,
          value: extendedFeature.value / VALUE_MULTIPLIER,
          unit: object.sublayers[0].unit,
        },
      ]
    } else {
      // const values = object.sublayers.map((sublayer) => sublayer.value!)

      // This is used when querying the interaction endpoint, so that start begins at the start of the frame (ie start of a 10days interval)
      // This avoids querying a cell visible on the map, when its actual timerange is not included in the app-overall time range
      // const getDate = CONFIG_BY_INTERVAL[timeChunks.interval as Interval].getDate
      const layer = feature.layer as FourwingsLayer
      const visibleStartDate = getUTCDate(layer?.props?.startTime).toISOString()
      const visibleEndDate = getUTCDate(layer?.props?.endTime).toISOString()
      return object.sublayers.flatMap((sublayer, i) => {
        if (sublayer.value === 0) return []
        const temporalGridExtendedFeature: ExtendedFeature = {
          ...extendedFeature,
          temporalgrid: {
            sublayerIndex: i,
            sublayerId: sublayer.id,
            sublayerInteractionType: object.category,
            sublayerCombinationMode: layer.props.comparisonMode,
            visible: true,
            col: object.properties.col as number,
            row: object.properties.row as number,
            interval: layer.getInterval(),
            visibleStartDate,
            visibleEndDate,
            unit: sublayer.unit,
          },
          value: sublayer.value,
        }
        return [temporalGridExtendedFeature]
      })
    }
  } else if (feature.layer instanceof ContextLayer) {
    // TODO: deck add support for these layers
    // case DataviewType.Context:
    // case DataviewType.UserPoints:
    // case DataviewType.UserContext:
    const object = feature.object as ContextPickingObject
    return [
      {
        ...extendedFeature,
        datasetId: object.datasetId,
        promoteId: object.promoteId,
        generatorContextLayer: object?.layerId,
        geometry: object.geometry,
      },
    ]
  }

  return [extendedFeature]
}

export const getExtendedFeatures = (features: DeckLayerInteractionFeature[]): ExtendedFeature[] => {
  // TODO: deck implement the stopPropagation feature
  // const stopPropagationFeature = features.find((f) => f.layer.metadata?.stopPropagation)
  // if (stopPropagationFeature) {
  //   return getExtendedFeature(stopPropagationFeature, metadata, debug)
  // }
  const extendedFeatures: ExtendedFeature[] = features.flatMap((feature) => {
    return getExtendedFeature(feature) || []
  })
  return extendedFeatures
}
