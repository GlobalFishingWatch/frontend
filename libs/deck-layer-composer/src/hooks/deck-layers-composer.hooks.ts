import { atom, useAtom, useSetAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { AnyDeckLayer } from '@globalfishingwatch/deck-layers'
import { DataviewInstance } from '@globalfishingwatch/api-types'
import { getDataviewsResolved, getDataviewsSorted } from '../resolvers'
import { dataviewToDeckLayer, ResolverGlobalConfig } from '../resolvers'

// Atom used to have all deck instances available
export const deckLayerInstancesAtom = atom<AnyDeckLayer[]>([])

export function useDeckLayerComposer({
  dataviews,
  globalConfig,
}: {
  dataviews: DataviewInstance[]
  globalConfig: ResolverGlobalConfig
}) {
  const [deckLayers, setDeckLayers] = useAtom(deckLayerInstancesAtom)

  const layerInstances = useMemo(() => {
    const dataviewsMerged = getDataviewsResolved(dataviews, globalConfig) as DataviewInstance[]
    const dataviewsMergedSorted = getDataviewsSorted(dataviewsMerged)
    const deckLayers = dataviewsMergedSorted?.flatMap((dataview) => {
      // TODO research if we can use atoms here
      try {
        return dataviewToDeckLayer(dataview, globalConfig)
      } catch (e) {
        console.warn(e)
        return []
      }
    })
    return deckLayers
  }, [dataviews, globalConfig])

  useEffect(() => {
    setDeckLayers(layerInstances)
  }, [layerInstances, setDeckLayers])

  return {
    layers: deckLayers,
  }
}

export function useSetDeckLayerComposer() {
  return useSetAtom(deckLayerInstancesAtom)
}
