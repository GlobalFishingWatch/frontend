import { useEffect, useMemo } from 'react'
import { debounce } from 'es-toolkit'
import { atom, useAtom, useSetAtom } from 'jotai'

import type { DataviewInstance } from '@globalfishingwatch/api-types'
import type { AnyDeckLayer } from '@globalfishingwatch/deck-layers'
import { TilesBoundariesLayer } from '@globalfishingwatch/deck-layers'
import { useMemoCompare } from '@globalfishingwatch/react-hooks'

import type { ResolverGlobalConfig } from '../resolvers'
import { dataviewToDeckLayer, getDataviewsResolved, getDataviewsSorted } from '../resolvers'

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
  const memoDataviews = useMemoCompare(dataviews)
  const memoGlobalConfig = useMemoCompare(globalConfig)

  const debouncedSetDeckLayers = useMemo(() => debounce(setDeckLayers, 1), [setDeckLayers])

  const layerInstances = useMemo(() => {
    const dataviewsMerged = getDataviewsResolved(
      memoDataviews,
      memoGlobalConfig
    ) as DataviewInstance[]
    const dataviewsMergedSorted = getDataviewsSorted(dataviewsMerged)
    const deckLayers = dataviewsMergedSorted?.flatMap((dataview) => {
      // TODO research if we can use atoms here
      try {
        return dataviewToDeckLayer(dataview, memoGlobalConfig)
      } catch (e) {
        console.warn(e)
        return []
      }
    })
    if (memoGlobalConfig.debug) {
      return [...deckLayers, new TilesBoundariesLayer()]
    }
    return deckLayers
  }, [memoDataviews, memoGlobalConfig])

  useEffect(() => {
    debouncedSetDeckLayers(layerInstances)
  }, [layerInstances, debouncedSetDeckLayers])

  return deckLayers
}

export function useSetDeckLayerComposer() {
  return useSetAtom(deckLayerInstancesAtom)
}
