import {
  useBasemapLayer,
  useContextsLayer,
  useVesselLayers,
  zIndexSortedArray,
} from '@globalfishingwatch/deck-layers'
import {
  AnyGeneratorConfig,
  DeckLayersGeneratorDictionary,
  GeneratorType,
  GlobalGeneratorConfig,
  VesselDeckLayersGenerator,
} from '@globalfishingwatch/layer-composer'

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
  const basemap = generatorsConfig.find((generator) => generator.type === 'BASEMAP')?.basemap
  const visible = generatorsConfig.find((generator) => generator.type === 'BASEMAP')?.visible
  const basemapLayer = useBasemapLayer({
    visible,
    basemap,
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

  const vesselLayers = useVesselLayers(
    generatorsDictionary[GeneratorType.Vessels] as VesselDeckLayersGenerator,
    globalGeneratorConfig,
    highlightedTime
  )

  return { layers: zIndexSortedArray([basemapLayer, contextLayer, ...vesselLayers]) }
}
