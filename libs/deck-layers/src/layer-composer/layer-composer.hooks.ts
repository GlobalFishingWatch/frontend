import {
  useBasemapLayer,
  useContextsLayer,
  useSetFourwingsLayers,
  zIndexSortedArray,
  DeckLayersGeneratorDictionary,
  BasemapDeckLayerGenerator,
  DeckLayersGeneratorType,
  VesselDeckLayersGenerator,
  FourwingsDeckLayerGenerator,
  useSetVesselLayers,
  VesselDeckLayersParams,
} from '@globalfishingwatch/deck-layers'
import { AnyGeneratorConfig, GlobalGeneratorConfig } from '@globalfishingwatch/layer-composer'

export type DeckLayerComposerParams = VesselDeckLayersParams
export function useDeckLayerComposer({
  generatorsDictionary,
  generatorsConfig,
  globalGeneratorConfig,
  params,
}: {
  generatorsDictionary: DeckLayersGeneratorDictionary
  generatorsConfig: AnyGeneratorConfig[]
  globalGeneratorConfig: GlobalGeneratorConfig
  params: DeckLayerComposerParams
}) {
  const basemapGenerator = generatorsConfig.find(
    (generator) => generator.type === 'BASEMAP'
  ) as BasemapDeckLayerGenerator
  const basemapLayer = useBasemapLayer({
    visible: basemapGenerator?.visible ?? true,
    basemap: basemapGenerator?.basemap ?? 'default',
  })

  const contextLayersGenerators = generatorsConfig.filter(
    (generator) => generator.type === 'CONTEXT'
  )

  const contextLayer = useContextsLayer({
    visible: contextLayersGenerators.length ? true : false,
    id: contextLayersGenerators.length ? contextLayersGenerators[0].id : '',
    color: contextLayersGenerators.length ? contextLayersGenerators[0].color : 'red',
    datasetId: contextLayersGenerators.length ? contextLayersGenerators[0].datasetId : 'eez',
  })

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
