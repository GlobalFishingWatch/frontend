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

  useEffect(() => {
    if (map) {
      map.on('sourcedataloading', onLoad)
      map.on('idle', onIdle)
    }
    return () => {
      if (map) {
        map.off('sourcedataloading', onLoad)
        map.off('idle', onIdle)
      }
    }
  }, [map, onIdle, onLoad])

  return loading
}

export default useTilesLoading
