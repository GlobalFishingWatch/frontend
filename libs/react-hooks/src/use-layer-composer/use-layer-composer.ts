import { useEffect, useState } from 'react'
import {
  sort,
  LayerComposer,
  ExtendedStyle,
  StyleTransformation,
  getInteractiveLayerIds,
  AnyGeneratorConfig,
  GlobalGeneratorConfig,
} from '@globalfishingwatch/layer-composer'
import {
  useBasemapLayer,
  useContextsLayer,
  useVesselLayer,
  zIndexSortedArray,
} from '@globalfishingwatch/deck-layers'
import { useDebounce } from '../use-debounce'

const applyStyleTransformations = (
  style: ExtendedStyle,
  styleTransformations?: StyleTransformation[]
) => {
  if (!styleTransformations) return style
  let newStyle = style
  styleTransformations.forEach((t) => {
    newStyle = t(newStyle)
  })
  return newStyle
}

export const defaultStyleTransformations: StyleTransformation[] = [sort, getInteractiveLayerIds]

let styleSpecValidate: any

const defaultLayerComposerInstance = new LayerComposer()
export function useLayerComposer(
  generatorConfigs: AnyGeneratorConfig[],
  globalGeneratorConfig?: GlobalGeneratorConfig,
  styleTransformations: StyleTransformation[] = defaultStyleTransformations,
  layerComposer: LayerComposer = defaultLayerComposerInstance
) {
  const [style, setStyle] = useState<ExtendedStyle>()
  const debouncedStyle = useDebounce(style, 1)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const getGlStyles = async () => {
      try {
        const { style, promises } = layerComposer.getGLStyle(
          generatorConfigs,
          globalGeneratorConfig
        )
        const afterTransformations = applyStyleTransformations(style, styleTransformations)
        if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
          if (!styleSpecValidate) {
            styleSpecValidate = await import(
              '@globalfishingwatch/maplibre-gl/dist/style-spec'
            ).then((m) => {
              return m.validate
            })
          }
          if (styleSpecValidate) {
            const styleErrors = styleSpecValidate(afterTransformations)
            if (styleErrors && styleErrors.length) {
              console.warn(style)
              throw new Error(styleErrors.map((e: any) => e.message).join('\n'))
            }
          }
        }
        setStyle(afterTransformations)
        if (promises && promises.length) {
          setLoading(true)
          await Promise.all(
            promises.map((p: Promise<{ style: ExtendedStyle }>) => {
              return p.then(({ style }) => {
                setStyle(applyStyleTransformations(style, styleTransformations))
              })
            })
          )
          setLoading(false)
        }
        setError(null)
      } catch (e: any) {
        console.warn(e)
        setError(e)
      }
    }
    getGlStyles()
  }, [generatorConfigs, globalGeneratorConfig, layerComposer, styleTransformations])

  return { style: debouncedStyle, loading, error }
}

export function useDeckLayerComposer({
  generatorsConfig,
  globalGeneratorConfig,
}: {
  generatorsConfig: AnyGeneratorConfig[]
  globalGeneratorConfig?: GlobalGeneratorConfig
}) {
  // console.log(
  //   '🚀 ~ file: use-layer-composer.ts:105 ~ globalGeneratorConfig:',
  //   globalGeneratorConfig
  // )
  const basemap = generatorsConfig.find((generator) => generator.type === 'BASEMAP')?.basemap
  const visible = generatorsConfig.find((generator) => generator.type === 'BASEMAP')?.visible
  const basemapLayer = useBasemapLayer({
    visible,
    basemap,
  })

  const contextLayersGenerators = generatorsConfig.filter(
    (generator) => generator.type === 'CONTEXT'
  )

  const vesselLayersGenerators = generatorsConfig.filter(
    (generator) => generator.type === 'VESSEL_EVENTS_SHAPES'
  )
  // console.log(
  //   '🚀 ~ file: use-layer-composer.ts:120 ~ vesselLayersGenerators:',
  //   vesselLayersGenerators
  // )

  const contextLayer = useContextsLayer({
    visible: contextLayersGenerators.length ? true : false,
    id: contextLayersGenerators.length ? contextLayersGenerators[0].id : '',
    color: contextLayersGenerators.length ? contextLayersGenerators[0].color : 'red',
    datasetId: contextLayersGenerators.length ? contextLayersGenerators[0].datasetId : 'eez',
  })

  const vesselLayer = useVesselLayer({
    visible: vesselLayersGenerators.length ? true : false,
    id: vesselLayersGenerators.length ? vesselLayersGenerators[0].vesselId : '',
    color: vesselLayersGenerators.length ? vesselLayersGenerators[0].color : 'red',
    endDate: vesselLayersGenerators.length && globalGeneratorConfig.end,
    startDate: vesselLayersGenerators.length && globalGeneratorConfig.start,
  })
  console.log('🚀 ~ file: use-layer-composer.ts:139 ~ vesselLayer:', vesselLayer)

  return { layers: zIndexSortedArray([basemapLayer, contextLayer, vesselLayer]) }
}
