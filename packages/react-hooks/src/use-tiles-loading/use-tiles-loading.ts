import { useCallback, useState, useEffect } from 'react'
import type { Map } from '@globalfishingwatch/mapbox-gl'
function useTilesLoading(map?: Map) {
  const [loading, setLoading] = useState<boolean>(false)

  const onIdle = useCallback(() => {
    setLoading(false)
  }, [])

  const onLoad = useCallback(() => {
    setLoading(true)
  }, [])

  const onLoadComplete = useCallback(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    if (map) {
      map.on('sourcedataloading', onLoad)
      map.on('error', onLoadComplete)
      map.on('sourcedata', onLoadComplete)
      map.on('idle', onIdle)
    }
  }, [map, onIdle, onLoad, onLoadComplete])

  return loading
}

export default useTilesLoading
