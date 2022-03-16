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

let styleSpecValidate: any

const defaultLayerComposerInstance = new LayerComposer()
export function useLayerComposer(
  generatorConfigs: AnyGeneratorConfig[],
  globalGeneratorConfig?: GlobalGeneratorConfig,
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
