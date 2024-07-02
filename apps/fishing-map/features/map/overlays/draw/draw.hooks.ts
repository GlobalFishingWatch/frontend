import { useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { DrawFeatureType, DrawLayer } from '@globalfishingwatch/deck-layers'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'

const layerInstanceAtom = atom<DrawLayer | null>(null)

export const useDrawLayerInstance = () => {
  const { isMapDrawing, mapDrawingMode } = useMapDrawConnect()
  const [layerInstance, setLayerInstance] = useAtom(layerInstanceAtom)
  useEffect(() => {
    if (isMapDrawing) {
      setLayerInstance(
        new DrawLayer({
          featureType: mapDrawingMode as DrawFeatureType,
          onStateChange: (instance: DrawLayer) => {
            setLayerInstance(instance)
          },
        })
      )
    } else {
      setLayerInstance(null)
    }
  }, [isMapDrawing, mapDrawingMode, setLayerInstance])

  return layerInstance
}
