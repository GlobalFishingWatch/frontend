import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { InteractionEvent, InteractionEventCallback } from './types'
import { filterUniqueFeatureInteraction } from './interaction-features.utils'

export const deckHoverInteractionAtom = atom<InteractionEvent>({} as InteractionEvent)

export const useMapHoverInteraction = () => {
  return useAtomValue(deckHoverInteractionAtom)
}
export const useSetMapHoverInteraction = () => {
  const setDeckInteraction = useSetAtom(deckHoverInteractionAtom)
  return useCallback(setDeckInteraction, [setDeckInteraction])
}

// TODO:deck move the stopPropagation and the filterUniqueFeatureInteraction to utils and consume in the app to remove this hook
export const useMapClick = (clickCallback: InteractionEventCallback) => {
  // const { updateFeatureState, cleanFeatureState } = useFeatureState(map)
  const onMapClick = useCallback(
    (event: InteractionEvent) => {
      if (!clickCallback) return

      const interactionEvent: InteractionEvent = { ...event }
      if (event.features?.length) {
        // const stopPropagationFeature = event.features.find((f) => f.layer.metadata?.stopPropagation)
        // if (stopPropagationFeature) {
        //   return getExtendedFeature(stopPropagationFeature, metadata, debug)
        // }
        const extendedFeaturesLimit = filterUniqueFeatureInteraction(event.features)

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
