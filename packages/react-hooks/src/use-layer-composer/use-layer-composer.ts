import { useEffect, useState } from 'react'
import LayerComposer, {
  Generators,
  sort,
  getInteractiveLayerIds,
} from '@globalfishingwatch/layer-composer'
import { ExtendedStyle, StyleTransformation } from '@globalfishingwatch/layer-composer/dist/types'

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

const defaultTransformations: StyleTransformation[] = [sort, getInteractiveLayerIds]

const defaultLayerComposerInstance = new LayerComposer()
function useLayerComposer(
  generatorConfigs: Generators.AnyGeneratorConfig[],
  globalGeneratorConfig?: Generators.GlobalGeneratorConfig,
  styleTransformations: StyleTransformation[] = defaultTransformations,
  layerComposer: LayerComposer = defaultLayerComposerInstance
) {
  const [style, setStyle] = useState<ExtendedStyle>({} as ExtendedStyle)
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
        // if (process.env.NODE_ENV === 'development') {
        //   const styleSpec = await import('@globalfishingwatch/mapbox-gl/dist/style-spec')
        //   if (styleSpec && styleSpec.validate) {
        //     const styleErrors = styleSpec.validate(afterTransformations)
        //     if (styleErrors && styleErrors.length) {
        //       throw new Error(styleErrors.map((e: any) => e.message).join('\n'))
        //     }
        //   }
        // }
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
      } catch (e) {
        console.log(e)
        setError(e)
      }
    }
    getGlStyles()
  }, [generatorConfigs, globalGeneratorConfig, layerComposer, styleTransformations])

  return { style, loading, error }
}

export default useLayerComposer
