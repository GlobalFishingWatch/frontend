import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { DeckLayerInteractionFeature } from '../types'
import { ExtendedFeature, InteractionEvent, InteractionEventCallback } from './types'
import { filterUniqueFeatureInteraction, getExtendedFeatures } from './interaction-features.utils'

// Atom used to have all the layer instances loading state available
export type DeckLayerInteraction = {
  latitude: number
  longitude: number
  features: DeckLayerInteractionFeature[]
}

export const deckHoverInteractionAtom = atom<DeckLayerInteraction>({} as DeckLayerInteraction)

export const useMapHoverInteraction = () => {
  return useAtomValue(deckHoverInteractionAtom)
}
export const useSetMapHoverInteraction = () => {
  const setDeckInteraction = useSetAtom(deckHoverInteractionAtom)
  return useCallback(setDeckInteraction, [setDeckInteraction])
}

export const useMapClick = (clickCallback: InteractionEventCallback) => {
  // const { updateFeatureState, cleanFeatureState } = useFeatureState(map)
  const onMapClick = useCallback(
    (event: DeckLayerInteraction) => {
      if (!clickCallback) return

      const interactionEvent: InteractionEvent = {
        type: 'click',
        longitude: event.longitude,
        latitude: event.latitude,
        point: event.point,
      }
      if (event.features?.length) {
        const extendedFeatures: ExtendedFeature[] = getExtendedFeatures(event.features)
        const extendedFeaturesLimit = filterUniqueFeatureInteraction(extendedFeatures)

        if (extendedFeaturesLimit.length) {
          interactionEvent.features = extendedFeaturesLimit
          // updateFeatureState(extendedFeaturesLimit, 'click')
        }
      }
      clickCallback(interactionEvent)
    },
    [clickCallback]
  )

  return onMapClick
}
