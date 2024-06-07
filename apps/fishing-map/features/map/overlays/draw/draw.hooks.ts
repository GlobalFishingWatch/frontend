import { useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { DrawLayer } from '@globalfishingwatch/deck-layers'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'

const layerInstanceAtom = atom<DrawLayer | null>(null)

export const useDrawLayerInstance = () => {
  const { isMapDrawing } = useMapDrawConnect()
  const [layerInstance, setLayerInstance] = useAtom(layerInstanceAtom)
  useEffect(() => {
    if (isMapDrawing) {
      setLayerInstance(
        new DrawLayer({
          // data: drawFeatures,
          // onEdit: onDrawEdit,
          // selectedFeatureIndexes: drawFeaturesIndexes,
          // mode: 'draw',
        })
      )
    } else {
      setLayerInstance(null)
    }
  }, [isMapDrawing, setLayerInstance])

  return layerInstance
}
