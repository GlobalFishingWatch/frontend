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
  AnyDeckLayersGenerator,
  ContextDeckLayerGenerator,
} from '@globalfishingwatch/deck-layers'
import { GlobalGeneratorConfig } from '@globalfishingwatch/layer-composer'

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
