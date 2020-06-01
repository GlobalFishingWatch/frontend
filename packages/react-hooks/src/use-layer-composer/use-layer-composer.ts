import { useEffect, useState } from 'react'
import LayerComposer, { Generators } from '@globalfishingwatch/layer-composer'
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

type LayerComposerConfig = Generators.GlobalGeneratorConfig & {
  styleTransformations?: StyleTransformation[]
}

const defaultConfig: LayerComposerConfig = {
  styleTransformations: [],
}
const defaultLayerComposerInstance = new LayerComposer()
function useLayerComposer(
  generatorConfigs: Generators.AnyGeneratorConfig[],
  layerComposer: LayerComposer = defaultLayerComposerInstance,
  config: LayerComposerConfig = defaultConfig
) {
  const [style, setStyle] = useState<ExtendedStyle | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const { styleTransformations, ...globalGeneratorConfig } = config
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
  }, [config, generatorConfigs, layerComposer])

  return { style, loading }
}

export default useLayerComposer
