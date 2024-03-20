import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { PickingInfo } from '@deck.gl/core'

// Atom used to have all the layer instances loading state available
type DeckLayerState = PickingInfo[]
export const deckLayersInteractionAtom = atom<DeckLayerState>([])

export const useDeckLayerInteraction = () => {
  return useAtomValue(deckLayersInteractionAtom)
}

export const useSetDeckLayerInteraction = () => {
  const setDeckLayerLoadedState = useSetAtom(deckLayersInteractionAtom)
  return useCallback(
    (interactions: PickingInfo[]) => {
      setDeckLayerLoadedState(interactions)
    },
    [setDeckLayerLoadedState]
  )
}
