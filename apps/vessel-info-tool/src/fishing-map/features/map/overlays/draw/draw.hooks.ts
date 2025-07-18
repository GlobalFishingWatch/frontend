import { useEffect } from 'react'
import { atom, useAtom } from 'jotai'

import type { DrawFeatureType } from '@globalfishingwatch/deck-layers'
import { DrawLayer } from '@globalfishingwatch/deck-layers'

import { useMapDrawConnect } from 'features/map/map-draw.hooks'

// Using timestamp as workaround to force the CoordinateEditOverlay to re-render when the selected point changes
const drawLayerInstanceAtom = atom<{ instance: DrawLayer; timestamp: number } | null>(null)

export const useDrawLayerInstance = () => {
  const { isMapDrawing, mapDrawingMode } = useMapDrawConnect()
  const [layerInstance, setLayerInstance] = useAtom(drawLayerInstanceAtom)

  useEffect(() => {
    if (isMapDrawing) {
      const instance = new DrawLayer({
        featureType: mapDrawingMode as DrawFeatureType,
        onStateChange: (instance: DrawLayer) => {
          setLayerInstance({ instance, timestamp: Date.now() })
        },
      })
      setLayerInstance({ instance, timestamp: Date.now() })
    } else {
      setLayerInstance(null)
    }
  }, [isMapDrawing, mapDrawingMode, setLayerInstance])

  return layerInstance?.instance
}
