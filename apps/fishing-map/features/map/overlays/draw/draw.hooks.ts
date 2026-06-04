import { useCallback, useEffect, useRef } from 'react'
import { atom, useAtom } from 'jotai'

import type { DrawFeatureType, DrawLayer } from '@globalfishingwatch/deck-layers/draw'

import { useMapDrawConnect } from 'features/map/map-draw.hooks'

// Using timestamp as workaround to force the CoordinateEditOverlay to re-render when the selected point changes
const drawLayerInstanceAtom = atom<{ instance: DrawLayer; timestamp: number } | null>(null)

export const useDrawLayerInstance = () => {
  const { isMapDrawing, mapDrawingMode } = useMapDrawConnect()
  const [layerInstance, setLayerInstance] = useAtom(drawLayerInstanceAtom)
  const DrawLayerRef = useRef<typeof DrawLayer>(undefined)

  const importDrawLayer = useCallback(async () => {
    if (DrawLayerRef.current) {
      return DrawLayerRef.current
    }
    try {
      // Dynamic import keeps @deck.gl-community/editable-layers out of the SSR bundle.
      const { DrawLayer } = await import('@globalfishingwatch/deck-layers/draw')
      DrawLayerRef.current = DrawLayer
      return DrawLayerRef.current
    } catch (e: any) {
      console.warn(e)
    }
  }, [])

  useEffect(() => {
    if (isMapDrawing) {
      importDrawLayer().then((DrawLayer) => {
        if (DrawLayer) {
          const instance = new DrawLayer({
            featureType: mapDrawingMode as DrawFeatureType,
            onStateChange: (instance: DrawLayer) => {
              setLayerInstance({ instance, timestamp: Date.now() })
            },
          })
          setLayerInstance({ instance, timestamp: Date.now() })
        }
      })
    } else {
      setLayerInstance(null)
    }
  }, [importDrawLayer, isMapDrawing, mapDrawingMode, setLayerInstance])

  return layerInstance?.instance
}
