import {
  ContextLayer,
  ContextPickingObject,
  FourwingsLayer,
  FourwingsPickingObject,
} from '@globalfishingwatch/deck-layers'
import { VALUE_MULTIPLIER } from '@globalfishingwatch/fourwings-aggregate'
import { DeckLayerInteractionFeature, DeckLayerInteractionPickingInfo } from '../types'

export const filterUniqueFeatureInteraction = (features: DeckLayerInteractionFeature[]) => {
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

const parseDeckPickingInfoToFeature = (
  pickingInfo: DeckLayerInteractionPickingInfo
): DeckLayerInteractionFeature[] => {
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

  const extendedFeature: DeckLayerInteractionFeature = {
    ...pickingInfo.object,
    layerId: pickingInfo.layer.id,
    // uniqueFeatureInteraction,
    // stopPropagation,
  }

  if (pickingInfo.layer instanceof FourwingsLayer) {
    const object = pickingInfo.object as FourwingsPickingObject
    if (pickingInfo.layer?.props.static) {
      return [
        {
          ...extendedFeature,
          value: extendedFeature.value / VALUE_MULTIPLIER,
          unit: object.sublayers[0].unit,
        },
      ]
    } else {
      return object?.sublayers?.flatMap((sublayer, i) => {
        if (sublayer.value === 0) return []
        const temporalGridExtendedFeature: DeckLayerInteractionFeature = {
          ...extendedFeature,
          value: sublayer.value!,
        }
        return [temporalGridExtendedFeature]
      })
    }
  } else if (pickingInfo.layer instanceof ContextLayer) {
    // TODO: deck add support for these layers
    // case DataviewType.Context:
    // case DataviewType.UserPoints:
    // case DataviewType.UserContext:
    const object = pickingInfo.object as ContextPickingObject
    return [
      {
        ...extendedFeature,
        datasetId: object.datasetId,
        geometry: object.geometry,
      },
    ]
  }

  return [extendedFeature]
}

export const parseDeckPickingInfoToFeatures = (
  features: DeckLayerInteractionPickingInfo[]
): DeckLayerInteractionFeature[] => {
  // TODO: deck implement the stopPropagation feature
  // const stopPropagationFeature = features.find((f) => f.layer.metadata?.stopPropagation)
  // if (stopPropagationFeature) {
  //   return getExtendedFeature(stopPropagationFeature, metadata, debug)
  // }
  const extendedFeatures: DeckLayerInteractionFeature[] = features.flatMap((feature) => {
    return parseDeckPickingInfoToFeature(feature) || []
  })
  return extendedFeatures
}
