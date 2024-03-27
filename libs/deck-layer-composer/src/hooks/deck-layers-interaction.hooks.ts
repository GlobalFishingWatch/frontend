import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { ContextPickingInfo, FourwingsPickingInfo } from '@globalfishingwatch/deck-layers'

// Atom used to have all the layer instances loading state available
export type DeckLayerInteraction = {
  latitude: number
  longitude: number
  features: (FourwingsPickingInfo | ContextPickingInfo)[]
}

export const deckHoverInteractionAtom = atom<DeckLayerInteraction>({} as DeckLayerInteraction)
export const deckClickInteractionAtom = atom<DeckLayerInteraction>({} as DeckLayerInteraction)

export const useMapHoverInteraction = () => {
  return useAtomValue(deckHoverInteractionAtom)
}
export const useMapClickInteraction = () => {
  return useAtomValue(deckClickInteractionAtom)
}

export const useSetMapHoverInteraction = () => {
  const setDeckInteraction = useSetAtom(deckHoverInteractionAtom)
  return useCallback(setDeckInteraction, [setDeckInteraction])
}

export const useSetMapClickInteraction = () => {
  const setDeckInteraction = useSetAtom(deckClickInteractionAtom)
  return useCallback(setDeckInteraction, [setDeckInteraction])
}
