import { useCallback } from 'react'
import { atom, useAtomValue, useSetAtom } from 'jotai'

import type { AnyDeckLayer } from '@globalfishingwatch/deck-layers'

// Type extension for internal deck.gl layer properties not exposed in public types
type LayerWithInternals = AnyDeckLayer & {
  internalState: unknown | null
  isComposite: boolean
  getSubLayers?: () => unknown[]
}

export function isDeckLayerReady(layer: AnyDeckLayer) {
  if (!layer) {
    return false
  }
  // A layer is ready when it has been initialized (internalState is set during _initialize())
  // This is more reliable than checking lifecycle string values because:
  // - lifecycle can be 'INITIALIZED' (after first init) OR 'MATCHED' (after state transfer)
  // - internalState is null until _initialize() runs
  // - internalState is transferred when a layer is matched with an existing one
  // See: node_modules/@deck.gl/core/src/lib/layer-manager.ts lines 360-378
  const layerInternal = layer as LayerWithInternals
  if (layerInternal.internalState === null) {
    return false
  }
  // For CompositeLayer (like FourwingsLayer), sublayers are only populated in _postUpdate()
  // which runs AFTER initialization. We need to wait for sublayers to be rendered
  // before the layer's methods (getColorScale, getZoomOffset, etc.) are safe to call.
  // See: node_modules/@deck.gl/core/src/lib/composite-layer.ts lines 252-264
  if (layerInternal.isComposite && typeof layerInternal.getSubLayers === 'function') {
    const subLayers = layerInternal.getSubLayers()
    return Array.isArray(subLayers) && subLayers.length > 0
  }
  return true
}

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

// Derived atom to track layer state changes for specific layers
export const getLayersStateHashAtom = (layerIds: string[]) =>
  atom((get) => {
    const layersState = get(deckLayersStateAtom)
    return layerIds
      .map((id) => {
        const state = layersState[id]
        return state ? `${id}:${state.loaded}:${state.cacheHash || ''}` : ''
      })
      .filter(Boolean)
      .join('|')
  })
