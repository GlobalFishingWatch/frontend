import {
  useBasemapLayer,
  useContextsLayer,
  useFourwingsLayers,
  zIndexSortedArray,
  DeckLayersGeneratorDictionary,
  BasemapDeckLayerGenerator,
  DeckLayersGeneratorType,
  VesselDeckLayersGenerator,
  FourwingsDeckLayerGenerator,
  useSetVesselLayers,
} from '@globalfishingwatch/deck-layers'
import { AnyGeneratorConfig, GlobalGeneratorConfig } from '@globalfishingwatch/layer-composer'

export function useDeckLayerComposer({
  generatorsDictionary,
  generatorsConfig,
  globalGeneratorConfig,
  highlightedTime,
}: {
  generatorsDictionary: DeckLayersGeneratorDictionary
  generatorsConfig: AnyGeneratorConfig[]
  globalGeneratorConfig: GlobalGeneratorConfig
  highlightedTime?: { start: string; end: string }
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
    highlightedTime
  )

  const fourwingsLayers = useFourwingsLayers(
    generatorsDictionary[DeckLayersGeneratorType.Fourwings] as FourwingsDeckLayerGenerator[],
    globalGeneratorConfig
  )

  return {
    layers: zIndexSortedArray([basemapLayer, contextLayer, ...vesselLayers, ...fourwingsLayers]),
  }
}
