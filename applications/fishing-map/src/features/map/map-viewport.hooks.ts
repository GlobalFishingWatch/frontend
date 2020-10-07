import { useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import { ViewportProps } from 'react-map-gl'
import { MapCoordinates } from 'types'
import useDebounce from '@globalfishingwatch/react-hooks/dist/use-debounce'
import { selectViewport } from 'features/map/map.selectors'
import { useLocationConnect } from 'routes/routes.hook'

type SetMapCoordinatesArgs = Pick<ViewportProps, 'latitude' | 'longitude' | 'zoom'>
type UseViewport = {
  viewport: MapCoordinates
  onViewportChange: (viewport: ViewportProps) => void
  setMapCoordinates: (viewport: SetMapCoordinatesArgs) => void
}
export function useDebouncedViewport(
  urlViewport: MapCoordinates,
  callback: (viewport: MapCoordinates) => void
): UseViewport {
  const [viewport, setViewport] = useState<MapCoordinates>(urlViewport)
  const debouncedViewport = useDebounce<MapCoordinates>(viewport, 400)

  const setMapCoordinates = useCallback((viewport: SetMapCoordinatesArgs) => {
    setViewport({ ...viewport })
  }, [])

  const onViewportChange = useCallback((viewport: ViewportProps) => {
    const { latitude, longitude, zoom } = viewport
    setViewport({ latitude, longitude, zoom })
  }, [])

  // Updates local state when url changes
  useEffect(() => {
    const { latitude, longitude, zoom } = viewport
    if (
      urlViewport &&
      (urlViewport?.latitude !== latitude ||
        urlViewport?.longitude !== longitude ||
        urlViewport?.zoom !== zoom)
    ) {
      setViewport({ ...urlViewport })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlViewport])

  // Sync the url with the local state debounced
  useEffect(() => {
    if (debouncedViewport && callback) {
      callback(debouncedViewport)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedViewport])

  return { viewport, onViewportChange, setMapCoordinates }
}

export default function useViewport(): UseViewport {
  const { dispatchQueryParams } = useLocationConnect()
  const urlViewport = useSelector(selectViewport)
  const callback = useCallback((viewport) => dispatchQueryParams(viewport), [dispatchQueryParams])
  return useDebouncedViewport(urlViewport, callback)
}
