import { useState, useEffect } from 'react'
import { Map } from '@globalfishingwatch/mapbox-gl'

export function useMapImage(map: Map) {
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    if (map) {
      map.once('render', () => {
        const canvas = map.getCanvas()
        setImage(canvas.toDataURL())
      })
      // trigger render
      map.setBearing(map.getBearing())
    } else {
      setImage(null)
    }
  }, [map])

  return image
}
