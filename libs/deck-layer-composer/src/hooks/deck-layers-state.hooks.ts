import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import type {
  AnyDeckLayer,
  LayerWithIndependentSublayersLoadState,
} from '@globalfishingwatch/deck-layers'

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
        setDeckLayerLoadedState(() => {
          const newLoadedState = {} as DeckLayerState
          layers.forEach((layer) => {
            if ((layer as LayerWithIndependentSublayersLoadState).getAllSublayersLoaded) {
              newLoadedState[layer.id] = {
                loaded: (layer as LayerWithIndependentSublayersLoadState).getAllSublayersLoaded(),
              }
            } else {
              newLoadedState[layer.id] = { loaded: layer.state?.loaded as boolean }
            }
          })
          return newLoadedState
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
