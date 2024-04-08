import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { DeckLayerInteractionFeature } from '../types'

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
