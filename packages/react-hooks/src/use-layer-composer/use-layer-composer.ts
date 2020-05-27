import { useEffect, useState } from 'react'
import LayerComposer from '@globalfishingwatch/layer-composer'
import {
  AnyGeneratorConfig,
  GlobalGeneratorConfig,
} from '@globalfishingwatch/layer-composer/dist/generators/types'
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

type LayerComposerConfig = GlobalGeneratorConfig & {
  styleTransformations?: StyleTransformation[]
}

const defaultConfig: LayerComposerConfig = {
  styleTransformations: [],
}
const defaultLayerComposerInstance = new LayerComposer()
function useLayerComposer(
  generatorConfigs: AnyGeneratorConfig[],
  layerComposer: LayerComposer = defaultLayerComposerInstance,
  config: LayerComposerConfig = defaultConfig
) {
  const [mapStyle, setMapStyle] = useState<ExtendedStyle | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const { styleTransformations, ...globalGeneratorConfig } = config
    const getGlStyles = async () => {
      const { style, promises } = layerComposer.getGLStyle(generatorConfigs, globalGeneratorConfig)
      setMapStyle(applyStyleTransformations(style, styleTransformations))
      if (promises && promises.length) {
        setLoading(true)
        await Promise.all(
          promises.map((p) => {
            return p.then(({ style }) => {
              setMapStyle(applyStyleTransformations(style, styleTransformations))
            })
          })
        )
        setLoading(false)
      }
    }
    getGlStyles()
  }, [config, generatorConfigs, layerComposer])

  return [mapStyle, loading]
}

export default useLayerComposer
