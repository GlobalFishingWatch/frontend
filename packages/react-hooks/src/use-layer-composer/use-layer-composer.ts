import { useEffect, useState } from 'react'
import LayerComposer, {
  sort,
  Generators,
  ExtendedStyle,
  StyleTransformation,
  getInteractiveLayerIds,
} from '@globalfishingwatch/layer-composer'

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

let styleSpec: any

const defaultLayerComposerInstance = new LayerComposer()
function useLayerComposer(
  generatorConfigs: Generators.AnyGeneratorConfig[],
  globalGeneratorConfig?: Generators.GlobalGeneratorConfig,
  styleTransformations: StyleTransformation[] = defaultTransformations,
  layerComposer: LayerComposer = defaultLayerComposerInstance
) {
  const [style, setStyle] = useState<ExtendedStyle>()
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
        if (process.env.NODE_ENV === 'development') {
          if (!styleSpec) {
            styleSpec = await import('@globalfishingwatch/mapbox-gl/dist/style-spec')
          }
          if (styleSpec && styleSpec.validate) {
            const styleErrors = styleSpec.validate(afterTransformations)
            if (styleErrors && styleErrors.length) {
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

  return { style, loading, error }
}

export default useLayerComposer
