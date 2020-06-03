import { useEffect, useState } from 'react'
import LayerComposer, { Generators, sort } from '@globalfishingwatch/layer-composer'
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

const defaultTransformations: StyleTransformation[] = [sort]

const defaultLayerComposerInstance = new LayerComposer()
function useLayerComposer(
  generatorConfigs: Generators.AnyGeneratorConfig[],
  globalGeneratorConfig: Generators.GlobalGeneratorConfig,
  styleTransformations: StyleTransformation[] = defaultTransformations,
  layerComposer: LayerComposer = defaultLayerComposerInstance
) {
  const [style, setStyle] = useState<ExtendedStyle | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const getGlStyles = async () => {
      const { style, promises } = layerComposer.getGLStyle(generatorConfigs, globalGeneratorConfig)
      setStyle(applyStyleTransformations(style, styleTransformations))
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
    }
    getGlStyles()
  }, [generatorConfigs, globalGeneratorConfig, layerComposer, styleTransformations])

  return { style, loading }
}

export default useLayerComposer
