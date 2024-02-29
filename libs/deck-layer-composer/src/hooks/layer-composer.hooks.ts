import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { get } from 'lodash'
import { useCallback, useEffect, useMemo } from 'react'
import { GlobalGeneratorConfig } from '@globalfishingwatch/layer-composer'
import { getDataviewsMerged, isHeatmapAnimatedDataview } from '@globalfishingwatch/dataviews-client'
import {
  AnyDeckLayer,
  BaseMapLayer,
  BaseMapLayerProps,
  FourwingsLayer,
} from '@globalfishingwatch/deck-layers'
import { Dataview, DataviewInstance } from '@globalfishingwatch/api-types'
import { useMemoCompare } from '@globalfishingwatch/react-hooks'
import { zIndexSortedArray } from '../utils/layers'
import {
  AnyDeckLayersGenerator,
  BasemapDeckLayerGenerator,
  ContextDeckLayerGenerator,
  DeckLayersGeneratorType,
  FourwingsDeckLayerGenerator,
  VesselDeckLayersGenerator,
} from '../types'
import { getFourwingsDataviewGenerator, getVesselDataviewGenerator } from '../dataviews-resolver'
import {
  DataviewConfigType,
  GlobalConfig,
  getDeckBasemapLayerPropsFromDataview,
  getDeckFourwingsLayerPropsFromDataview,
} from '../resolvers'
import { VesselDeckLayersParams, useSetVesselLayers } from './vessel.hooks'
import { useBasemapLayer } from './basemap.hooks'
import { useContextsLayer } from './context.hooks'
import { useSetFourwingsLayers } from './fourwings.hooks'

const dataviewToDeckLayer = (
  dataview: DataviewInstance,
  globalConfig: GlobalConfig
): AnyDeckLayer => {
  if (dataview.config?.type === DataviewConfigType.Basemap) {
    const deckLayerProps = getDeckBasemapLayerPropsFromDataview(dataview)
    return new BaseMapLayer(deckLayerProps)
  }
  if (dataview.config?.type === DataviewConfigType.HeatmapAnimated) {
    const deckLayerProps = getDeckFourwingsLayerPropsFromDataview(dataview, globalConfig)
    return new FourwingsLayer(deckLayerProps)
  }
  // if (generator.type === DeckLayersGeneratorType.Context) {
  //   return {
  //     type: 'ContextLayer',
  //     id: generator.id,
  //     visible: generator.visible,
  //     color: generator.color,
  //     datasetId: generator.datasetId,
  //     zIndex: generator.zIndex,
  //   }
  // }
  // if (generator.type === DeckLayersGeneratorType.Vessels) {
  //   return {
  //     type: 'VesselLayer',
  //     visible: generator.visible,
  //     zIndex: generator.zIndex,
  //   }
  // }
  // if (isHeatmapAnimatedDataview(generator)) {
  //   return {
  //     type: 'FourwingsLayer',
  //     id: generator.id,
  //     visible: generator.visible,
  //     zIndex: generator.zIndex,
  //   }
  // }

  throw new Error(`Unknown deck layer generator type: ${dataview.config?.type}`)
}

export const deckLayerInstancesAtom = atom<AnyDeckLayer[]>([])

type DeckLayerLoaded = { loaded: boolean }
type DeckLayerState = Record<string, DeckLayerLoaded>
export const deckLayersStateAtom = atom<DeckLayerState>({})

export const useSetDeckLayerLoadedState = () => {
  const setDeckLayerLoadedState = useSetAtom(deckLayersStateAtom)
  return useCallback(
    (layers: AnyDeckLayer[]) => {
      if (layers?.length) {
        setDeckLayerLoadedState((prev) => {
          const newLoadedState = {} as DeckLayerState
          layers.forEach((layer) => {
            newLoadedState[layer.id] = { loaded: layer.state?.loaded }
          })
          return newLoadedState
        })
      }
    },
    [setDeckLayerLoadedState]
  )
}

export const deckLayersAtom = atom<any[]>((get) => {
  const layerInstances = get(deckLayerInstancesAtom)
  const layerStatus = get(deckLayersStateAtom)
  return layerInstances.map((layer) => {
    const status = layerStatus[layer.id]
    return { id: layer.id, instance: layer, loaded: status?.loaded }
  })
})

export const useGetDeckLayer = (id: string) => {
  return useAtomValue(deckLayersAtom).find((layer) => layer.id === id)
}

export type DeckLayerComposerParams = VesselDeckLayersParams
export function useDeckLayerComposer({
  dataviews,
  globalConfig,
}: {
  dataviews: DataviewInstance[]
  globalConfig: GlobalConfig
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
  // console.log('🚀 ~ deckLayers:', deckLayers)

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
    console.log('🚀 ~ useEffect ~ layers:', layers)
    setDeckLayers(layers)
  }, [dataviews, setDeckLayers, globalConfig])

  // const basemapGenerator = generatorsConfig.find(
  //   (generator: any) => generator.type === 'BASEMAP'
  // ) as BasemapDeckLayerGenerator

  // const basemapLayer = useBasemapLayer({
  //   visible: basemapGenerator?.visible ?? true,
  //   basemap: basemapGenerator?.basemap ?? 'default',
  // })

  // const contextLayersGenerators = generatorsConfig.filter(
  //   (generator: any) => generator.type === 'CONTEXT'
  // ) as ContextDeckLayerGenerator[]

  // const contextLayer = useContextsLayer({
  //   visible: contextLayersGenerators.length ? true : false,
  //   id: contextLayersGenerators.length ? contextLayersGenerators[0].id : '',
  //   color: contextLayersGenerators.length ? contextLayersGenerators[0].color : 'red',
  //   datasetId: contextLayersGenerators.length ? contextLayersGenerators[0].datasetId : 'eez',
  // } as any)

  // const vesselLayersConfig = getVesselDataviewGenerator(
  //   generatorsConfig.filter((config) => config.type === DeckLayersGeneratorType.Vessels)
  // )

  // const vesselLayers = useSetVesselLayers(
  //   vesselLayersConfig as VesselDeckLayersGenerator[],
  //   globalGeneratorConfig,
  //   params
  // )

  // console.log('🚀 ~ generatorsConfig:', generatorsConfig)
  // const fourwingsLayersConfig = getFourwingsDataviewGenerator(
  //   generatorsConfig.filter((config) => config.type === 'HEATMAP_ANIMATED')
  // )
  // console.log('🚀 ~ fourwingsLayersConfig:', fourwingsLayersConfig)

  // const fourwingsLayers = useSetFourwingsLayers(
  //   fourwingsLayersConfig as FourwingsDeckLayerGenerator[],
  //   globalGeneratorConfig
  // )
  // console.log('🚀 ~ fourwingsLayers:', fourwingsLayers)

  return {
    // layers: zIndexSortedArray([basemapLayer, contextLayer, ...vesselLayers, ...fourwingsLayers]),
    // layers: zIndexSortedArray([basemapLayer, contextLayer, ...fourwingsLayers]),
    layers: deckLayers,
  }
}
