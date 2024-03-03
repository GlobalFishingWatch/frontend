import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { getDataviewsMerged } from '@globalfishingwatch/dataviews-client'
import { AnyDeckLayer } from '@globalfishingwatch/deck-layers'
import { DataviewInstance } from '@globalfishingwatch/api-types'
import { ResolverGlobalConfig } from '../resolvers'
import { dataviewToDeckLayer } from '../deck-layer-composer'

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

  useEffect(() => {
    const dataviewsMerged = getDataviewsMerged(dataviews, globalConfig) as DataviewInstance[]
    const layers = dataviewsMerged?.flatMap((dataview) => {
      // TODO research if we can use atoms here
      try {
        return dataviewToDeckLayer(dataview, globalConfig)
      } catch (e) {
        console.warn(e)
        return []
      }
    })
    // console.log('setting layers', layers)
    setDeckLayers(layers)
  }, [dataviews, setDeckLayers, globalConfig])

  return {
    // layers: zIndexSortedArray([basemapLayer, contextLayer, ...vesselLayers, ...fourwingsLayers]),
    // layers: zIndexSortedArray([basemapLayer, contextLayer, ...fourwingsLayers]),
    layers: deckLayers,
  }
}
