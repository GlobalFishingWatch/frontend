import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { AnyDeckLayer } from '@globalfishingwatch/deck-layers'

// Atom used to have all the layer instances loading state available
type DeckLayerLoaded = { loaded: boolean }
type DeckLayerState = Record<string, DeckLayerLoaded>
export const deckLayersStateAtom = atom<DeckLayerState>({})

export const useDeckLayerLoadedState = () => {
  return useAtomValue(deckLayersStateAtom)
}

export const useSetDeckLayerLoadedState = () => {
  const setDeckLayerLoadedState = useSetAtom(deckLayersStateAtom)
  return useCallback(
    (layers: AnyDeckLayer[]) => {
      if (layers?.length) {
        setDeckLayerLoadedState((prev) => {
          const newLoadedState = {} as DeckLayerState
          layers.forEach((layer) => {
            newLoadedState[layer.id] = { loaded: layer.state?.loaded }
          })
          return newLoadedState
        })
      }
    },
    [setDeckLayerLoadedState]
  )
}