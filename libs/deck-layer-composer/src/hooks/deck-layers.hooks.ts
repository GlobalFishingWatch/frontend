import { useMemo } from 'react'
import type { Atom } from 'jotai'
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

export type DeckLayerAtom<L = AnyDeckLayer> = {
  id: string
  instance: L
  loaded: boolean
  ready: boolean
}

export const deckLayersAtom: Atom<DeckLayerAtom<AnyDeckLayer>[]> = atom<DeckLayerAtom[]>((get) => {
  const layerInstances = get(deckLayerInstancesAtom)
  const layerStatus = get(deckLayersStateAtom)
  return layerInstances.map((layer) => ({
    id: layer.id,
    instance: layer,
    loaded: layerStatus[layer.id]?.loaded ?? false,
    ready: isDeckLayerReady(layer),
  }))
})

export const useDeckLayers = () => {
  return useAtomValue(deckLayersAtom)
}

export const useGetDeckLayer = <L = AnyDeckLayer>(id: string) => {
  const deckLayers = useDeckLayers()
  const layer = deckLayers.find((layer) => layer.id === id)
  return (layer?.ready ? layer : undefined) as DeckLayerAtom<L>
}

export const useGetDeckLayers = <L = AnyDeckLayer>(ids: string[]) => {
  const deckLayers = useDeckLayers()
  const uniqIds = Array.from(new Set(ids))
  const uniqIdsHash = (uniqIds || []).join(',')
  return useMemo(
    () =>
      uniqIds.flatMap(
        (id) => deckLayers.find((layer) => id === layer.id) || []
      ) as DeckLayerAtom<L>[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deckLayers, uniqIdsHash]
  )
}
