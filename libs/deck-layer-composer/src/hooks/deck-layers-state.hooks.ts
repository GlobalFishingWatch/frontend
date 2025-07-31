import { useCallback } from 'react'
import { atom, useAtomValue, useSetAtom } from 'jotai'

import type { AnyDeckLayer } from '@globalfishingwatch/deck-layers'

// Atom used to have all the layer instances loading state available
type DeckLayerLoaded = {
  loaded: boolean
  /**
   * `get cacheHash()` needs to be defined internally into the layer instance and is used
   * to detect if the layer has a change that needs to be reflected in react lifecycle
   */
  cacheHash: string
}
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
        setDeckLayerLoadedState((loadedState) => {
          const newLoadedState = {} as DeckLayerState
          layers.forEach((layer) => {
            newLoadedState[layer.id] = {
              loaded: layer.isLoaded,
              cacheHash: 'cacheHash' in layer && layer.cacheHash ? (layer.cacheHash as string) : '',
            }
          })
          if (
            Object.keys(newLoadedState).length !== Object.keys(loadedState).length ||
            Object.keys(newLoadedState).some(
              (key) =>
                newLoadedState[key]?.loaded !== loadedState[key]?.loaded ||
                newLoadedState[key]?.cacheHash !== loadedState[key]?.cacheHash
            )
          ) {
            return newLoadedState
          }
          return loadedState
        })
      }
    },
    [setDeckLayerLoadedState]
  )
}

const isDeckLayersLoadingAtom = atom((get) => {
  const layersState = get(deckLayersStateAtom)
  return layersState && Object.values(layersState).some((layer) => !layer.loaded)
})

export const useIsDeckLayersLoading = () => {
  return useAtomValue(isDeckLayersLoadingAtom)
}
