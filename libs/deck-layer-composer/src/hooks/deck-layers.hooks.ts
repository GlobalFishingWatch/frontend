import { atom, useAtomValue } from 'jotai'
import { AnyDeckLayer } from '@globalfishingwatch/deck-layers'
import { deckLayerInstancesAtom } from './deck-layers-composer.hooks'
import { deckLayersStateAtom } from './deck-layers-state.hooks'

export type DeckLayerAtom<L = AnyDeckLayer> = { id: string; instance: L; loaded: boolean }
export const deckLayersAtom = atom<DeckLayerAtom[]>((get) => {
  const layerInstances = get(deckLayerInstancesAtom)
  const layerStatus = get(deckLayersStateAtom)
  return layerInstances.map((layer) => {
    const status = layerStatus[layer.id]
    return { id: layer.id, instance: layer, loaded: status?.loaded }
  })
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
  return deckLayers.filter((layer) => ids.includes(layer.id)) as DeckLayerAtom<L>[]
}
