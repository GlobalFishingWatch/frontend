import type { Atom} from 'jotai';
import { atom, useAtomValue } from 'jotai'

import type { AnyDeckLayer } from '@globalfishingwatch/deck-layers'

import { DECK_LAYER_LIFECYCLE } from '../types'

import { deckLayerInstancesAtom } from './deck-layers-composer.hooks'
import { deckLayersStateAtom } from './deck-layers-state.hooks'

function isDeckLayerReady(layer: AnyDeckLayer) {
  return (
    layer.lifecycle !== DECK_LAYER_LIFECYCLE.NO_STATE &&
    layer.lifecycle !== DECK_LAYER_LIFECYCLE.INITIALIZED
  )
}

export type DeckLayerAtom<L = AnyDeckLayer> = { id: string; instance: L; loaded: boolean }

export const deckLayersAtom: Atom<DeckLayerAtom<AnyDeckLayer>[]> = atom<DeckLayerAtom[]>((get) => {
  const layerInstances = get(deckLayerInstancesAtom)
  const layerStatus = get(deckLayersStateAtom)
  if (layerInstances.every(isDeckLayerReady)) {
    const deckLayers = layerInstances.map((layer) => {
      const status = layerStatus[layer.id]
      return { id: layer.id, instance: layer, loaded: status?.loaded }
    })
    return deckLayers
  }
  return deckLayersAtom ? get(deckLayersAtom) : []
})

export const useDeckLayers = () => {
  return useAtomValue(deckLayersAtom)
}

export const useGetDeckLayer = <L = AnyDeckLayer>(id: string) => {
  const deckLayers = useDeckLayers()
  return deckLayers.find((layer) => layer.id === id) as DeckLayerAtom<L>
}

export const useGetDeckLayers = <L = AnyDeckLayer>(ids: string[]) => {
  const deckLayers = useDeckLayers()
  const uniqIds = Array.from(new Set(ids))
  return uniqIds.flatMap(
    (id) => deckLayers.find((layer) => id === layer.id) || []
  ) as DeckLayerAtom<L>[]
}
