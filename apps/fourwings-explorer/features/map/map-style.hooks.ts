import { useMemo } from 'react'
import { AnyGeneratorConfig } from '@globalfishingwatch/layer-composer'
import { useLayerComposer } from '@globalfishingwatch/react-hooks'
import { useLayersConfig } from 'features/layers/layers.hooks'

export const useMapStyle = () => {
  const { layersConfig } = useLayersConfig()
  console.log(layersConfig)
  const generators = useMemo(() => {
    return layersConfig.flatMap(({ id, config }) => {
      if (!config.type) {
        return []
      }
      return { id, ...config } as AnyGeneratorConfig
    })
  }, [layersConfig])
  return useLayerComposer(generators)
}
