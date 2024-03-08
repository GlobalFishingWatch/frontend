import { atom, useAtom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { getDataviewsMerged } from '@globalfishingwatch/dataviews-client'
import { AnyDeckLayer } from '@globalfishingwatch/deck-layers'
import { DataviewInstance } from '@globalfishingwatch/api-types'
import { dataviewToDeckLayer, ResolverGlobalConfig } from '../resolvers'
import { useDeckLayerInteraction } from './deck-layers-interaction.hooks'

// Atom used to have all deck instances available
export const deckLayerInstancesAtom = atom<AnyDeckLayer[]>([])

export function useDeckLayerComposer({
  dataviews,
  globalConfig,
}: {
  dataviews: DataviewInstance[]
  globalConfig: ResolverGlobalConfig
}) {
  // const memoDataviews = useMemoCompare(dataviews)
  // const deckLayersAtom = useMemo(
  //   () =>
  //     atom(
  //       dataviews?.map((dataview) => {
  //         // TODO research if we can use atoms here
  //         return dataviewToDeckLayer(dataview)
  //       })
  //     ),
  //   [dataviews]
  // )
  const [deckLayers, setDeckLayers] = useAtom(deckLayerInstancesAtom)
  const deckInteractions = useDeckLayerInteraction()

  useEffect(() => {
    const dataviewsMerged = getDataviewsMerged(dataviews, globalConfig) as DataviewInstance[]
    const layers = dataviewsMerged?.flatMap((dataview) => {
      // TODO research if we can use atoms here
      try {
        return dataviewToDeckLayer(dataview, globalConfig, deckInteractions)
      } catch (e) {
        console.warn(e)
        return []
      }
    })
    // console.log('setting layers', layers)
    setDeckLayers(layers)
  }, [dataviews, setDeckLayers, globalConfig, deckInteractions])

  return {
    layers: deckLayers,
  }
}

export function useSetDeckLayerComposer() {
  return useSetAtom(deckLayerInstancesAtom)
}
