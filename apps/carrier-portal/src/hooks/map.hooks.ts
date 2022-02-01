import { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ViewportProps } from '@globalfishingwatch/react-map-gl'
import { Map } from '@globalfishingwatch/mapbox-gl'
import { trunc } from 'utils'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import { getMapViewport } from 'redux-modules/router/route.selectors'
import useDebounce from './debounce.hooks'

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

export type Viewport = {
  latitude: number
  longitude: number
  zoom: number
}

export type LocalMapViewport = Viewport & {
  transitionDuration?: number | 'auto'
}

export const getViewportTrunc = (viewport: Viewport) => {
  return {
    latitude: trunc(viewport.latitude),
    longitude: trunc(viewport.longitude),
    zoom: viewport.zoom,
  }
}

const DEFAULT_TRANSITION_DURATION = 400
export function useDebouncedViewport(
  urlViewport: Viewport,
  callback: (viewport: Viewport) => void
) {
  const [viewport, setViewport] = useState<LocalMapViewport>(urlViewport)
  const debouncedViewport = useDebounce<LocalMapViewport>(viewport, 400)

  const setMapCoordinates = useCallback((viewport: LocalMapViewport) => {
    const transitionDuration = viewport.transitionDuration || DEFAULT_TRANSITION_DURATION
    setViewport({ ...viewport, transitionDuration })
  }, [])

  const onViewportChange = useCallback((viewport: ViewportProps) => {
    const { latitude, longitude, zoom, transitionDuration } = viewport
    setViewport({ latitude, longitude, zoom, transitionDuration })
  }, [])

  // Updates local state when url changes
  useEffect(() => {
    const { latitude, longitude, zoom } = getViewportTrunc(viewport)
    if (
      urlViewport &&
      (urlViewport?.latitude !== latitude ||
        urlViewport?.longitude !== longitude ||
        urlViewport?.zoom !== zoom)
    ) {
      const transitionDuration = viewport.transitionDuration || DEFAULT_TRANSITION_DURATION
      setViewport({ ...urlViewport, transitionDuration })
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

export function useViewport() {
  const dispatch = useDispatch()
  const urlViewport = useSelector(getMapViewport)
  const callback = useCallback(
    (viewport) => dispatch(updateQueryParams(getViewportTrunc(viewport))),
    [dispatch]
  )
  return useDebouncedViewport(urlViewport, callback)
}
