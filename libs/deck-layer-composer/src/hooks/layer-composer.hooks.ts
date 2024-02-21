import { GlobalGeneratorConfig } from '@globalfishingwatch/layer-composer'
import { zIndexSortedArray } from '../utils/layers'
import {
  AnyDeckLayersGenerator,
  BasemapDeckLayerGenerator,
  ContextDeckLayerGenerator,
  DeckLayersGeneratorDictionary,
  DeckLayersGeneratorType,
  FourwingsDeckLayerGenerator,
  VesselDeckLayersGenerator,
} from '../types'
import { VesselDeckLayersParams, useSetVesselLayers } from './vessel.hooks'
import { useBasemapLayer } from './basemap.hooks'
import { useContextsLayer } from './context.hooks'
import { useSetFourwingsLayers } from './fourwings.hooks'

export type DeckLayerComposerParams = VesselDeckLayersParams
export function useDeckLayerComposer({
  generatorsDictionary,
  generatorsConfig,
  globalGeneratorConfig,
  params,
}: {
  generatorsDictionary: DeckLayersGeneratorDictionary
  generatorsConfig: AnyDeckLayersGenerator[]
  globalGeneratorConfig: GlobalGeneratorConfig
  params: DeckLayerComposerParams
}) {
  const basemapGenerator = generatorsConfig.find(
    (generator: any) => generator.type === 'BASEMAP'
  ) as BasemapDeckLayerGenerator
  const basemapLayer = useBasemapLayer({
    visible: basemapGenerator?.visible ?? true,
    basemap: basemapGenerator?.basemap ?? 'default',
  })

  const contextLayersGenerators = generatorsConfig.filter(
    (generator: any) => generator.type === 'CONTEXT'
  ) as ContextDeckLayerGenerator[]

  const contextLayer = useContextsLayer({
    visible: contextLayersGenerators.length ? true : false,
    id: contextLayersGenerators.length ? contextLayersGenerators[0].id : '',
    color: contextLayersGenerators.length ? contextLayersGenerators[0].color : 'red',
    datasetId: contextLayersGenerators.length ? contextLayersGenerators[0].datasetId : 'eez',
  } as any)

  const vesselLayers = useSetVesselLayers(
    generatorsDictionary[DeckLayersGeneratorType.Vessels] as VesselDeckLayersGenerator[],
    globalGeneratorConfig,
    params
  )

  const fourwingsLayers = useSetFourwingsLayers(
    generatorsDictionary[DeckLayersGeneratorType.Fourwings] as FourwingsDeckLayerGenerator[],
    globalGeneratorConfig
  )

  return {
    layers: zIndexSortedArray([basemapLayer, contextLayer, ...vesselLayers, ...fourwingsLayers]),
  }
}
