import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import type { PickingInfo } from '@deck.gl/core'
import { DateTime } from 'luxon'
import type { MapMouseEvent } from 'maplibre-gl'

import type { TrackLabelerPoint } from '@globalfishingwatch/deck-layers'
import { hexToDeckColor, TrackLabelerVesselLayer } from '@globalfishingwatch/deck-layers'
import type { MiniglobeBounds } from '@globalfishingwatch/ui-components/miniglobe'

import { selectEditing } from '../../features/rulers/rulers.selectors'
import { editRuler, moveCurrentRuler } from '../../features/rulers/rulers.slice'
import { updateQueryParams } from '../../routes/routes.actions'
import { selectHiddenLabels, selectViewport } from '../../routes/routes.selectors'
import { useAppDispatch } from '../../store.hooks'
import type { CoordinatePosition, Label, MapCoordinates } from '../../types'
import { useSegmentsLabeledConnect } from '../timebar/timebar.hooks'
import { selectedtracks } from '../vessels/selectedTracks.slice'

import type { UpdateGeneratorPayload } from './map.slice'
import { selectGeneratorsConfig, selectGlobalGeneratorsConfig, updateGenerator } from './map.slice'

export const useMapMove = () => {
  const dispatch = useAppDispatch()
  const rulersEditing = useSelector(selectEditing)
  const [hoverCenter, setHoverCenter] = useState<LatLon | null>(null)
  const onMapMove = useCallback(
    (event: any) => {
      const center = {
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
      }
      setHoverCenter(center)
      if (rulersEditing === true) {
        dispatch(moveCurrentRuler(center))
      }
    },
    [dispatch, rulersEditing]
  )
  return { onMapMove, hoverCenter }
}

export const useMapClick = () => {
  const dispatch = useAppDispatch()
  const rulersEditing = useSelector(selectEditing)
  const { onEventPointClick } = useSegmentsLabeledConnect()
  const segments = useSelector(selectedtracks)
  const onEventClick = useCallback(
    (feature: TrackLabelerPoint) => {
      onEventPointClick(segments, feature.timestamp, {
        latitude: feature.position[0],
        longitude: feature.position[1],
      })
    },
    [onEventPointClick, segments]
  )
  const onMapClick = useCallback(
    (info: PickingInfo) => {
      if (!rulersEditing && info.object) {
        onEventClick(info.object)
      } else {
        if (rulersEditing === true && info.coordinate) {
          dispatch(
            editRuler({
              longitude: info.coordinate[0],
              latitude: info.coordinate[1],
            })
          )
        }
      }
    },
    [rulersEditing, onEventClick, dispatch]
  )
  return { onMapClick }
}
// This is a convenience hook that returns at the same time the portions of the store we interested in
// as well as the functions we need to update the same portions
export const useGeneratorsConnect = () => {
  const dispatch = useAppDispatch()
  return {
    globalConfig: useSelector(selectGlobalGeneratorsConfig),
    generatorsConfig: useSelector(selectGeneratorsConfig),
    updateGenerator: (payload: UpdateGeneratorPayload) => dispatch(updateGenerator(payload)),
  }
}

type SetMapCoordinatesArgs = Pick<any, 'latitude' | 'longitude' | 'zoom'>
type UseViewport = {
  viewport: MapCoordinates
  onViewportChange: (viewport: any) => void
  setMapCoordinates: (viewport: SetMapCoordinatesArgs) => void
}

export type LatLon = {
  latitude: number
  longitude: number
}
export interface Viewport extends LatLon {
  latitude: number
  longitude: number
  zoom: number
}

export type HighlightedTime = { start: string; end: string }
export const useViewportConnect = () => {
  const dispatch = useAppDispatch()
  const { zoom, latitude, longitude } = useSelector(selectViewport)
  const dispatchViewport = (newViewport: Partial<Viewport>) =>
    dispatch(updateQueryParams(newViewport))
  return { zoom, latitude, longitude, dispatchViewport }
}

export function useDebouncedViewport(
  urlViewport: MapCoordinates,
  callback: (viewport: MapCoordinates) => void
): UseViewport {
  // Keep a local reference of the viewport that we're controlling
  const [viewport, setViewport] = useState<MapCoordinates>(urlViewport)

  // Use a ref to track state without causing re-renders
  const stateRef = useRef({
    isUserInteraction: false,
    lastViewport: { ...urlViewport },
    pendingUpdate: false,
  })

  // Use a more robust debounce approach
  const debouncedViewportRef = useRef<MapCoordinates | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setMapCoordinates = useCallback((newViewport: SetMapCoordinatesArgs) => {
    setViewport({ ...newViewport })
  }, [])

  const onViewportChange = useCallback(
    ({ viewState }: { viewState: Viewport }) => {
      // Mark that this came from user interaction
      stateRef.current.isUserInteraction = true

      const { latitude, longitude, zoom } = viewState

      // Update local state immediately for responsive UI
      setViewport({ latitude, longitude, zoom })

      // Store for debounced update
      debouncedViewportRef.current = { latitude, longitude, zoom }

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set a new timeout
      timeoutRef.current = setTimeout(() => {
        if (debouncedViewportRef.current && callback) {
          callback(debouncedViewportRef.current)
        }
        timeoutRef.current = null
      }, 300) // 300ms debounce
    },
    [callback]
  )

  // Updates local state when url changes, but only if it's not from user interaction
  useEffect(() => {
    // Only sync from URL to local state if it wasn't a user interaction
    if (!stateRef.current.isUserInteraction && urlViewport) {
      // Check if the change is significant enough to warrant an update
      const threshold = 0.0001
      const zoomThreshold = 0.01
      const lastVP = stateRef.current.lastViewport

      const hasSignificantChange =
        Math.abs(urlViewport.longitude - lastVP.longitude) > threshold ||
        Math.abs(urlViewport.latitude - lastVP.latitude) > threshold ||
        Math.abs(urlViewport.zoom - lastVP.zoom) > zoomThreshold

      if (hasSignificantChange) {
        // Update both state and the ref tracker
        setViewport({ ...urlViewport })
        stateRef.current.lastViewport = { ...urlViewport }
      }
    }

    // Reset the flag after we handle the URL update
    stateRef.current.isUserInteraction = false
  }, [urlViewport])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { viewport, onViewportChange, setMapCoordinates }
}

export const useViewport = (): UseViewport => {
  const dispatch = useAppDispatch()
  const urlViewport = useSelector(selectViewport)

  // Use ref to track state without causing re-renders
  const stateRef = useRef({
    lastViewport: { ...urlViewport },
    pendingUpdate: false,
    updateCount: 0,
  })

  const callback = useCallback(
    (viewportInfo: any) => {
      // Skip Redux updates if we're processing too many updates in quick succession
      if (stateRef.current.updateCount > 5) {
        console.warn('[DEBUG] Throttling viewport updates to prevent update loops')
        // Reset counter after a delay
        setTimeout(() => {
          stateRef.current.updateCount = 0
        }, 1000)
        return
      }

      // Skip redux updates for tiny movements to avoid loops
      const threshold = 0.0001 // Small threshold for lat/lng changes
      const zoomThreshold = 0.01 // Small threshold for zoom changes

      const lastViewport = stateRef.current.lastViewport

      let latitude = viewportInfo.latitude
      let longitude = viewportInfo.longitude
      let zoom = viewportInfo.zoom

      // If coming from viewState (deck.gl format), extract values
      if (viewportInfo.viewState) {
        latitude = viewportInfo.viewState.latitude
        longitude = viewportInfo.viewState.longitude
        zoom = viewportInfo.viewState.zoom
      }

      // Round values to reduce precision-based updates
      latitude = Math.round(latitude * 100000) / 100000
      longitude = Math.round(longitude * 100000) / 100000
      zoom = Math.round(zoom * 100) / 100

      const isLatLngChange =
        Math.abs(latitude - lastViewport.latitude) > threshold ||
        Math.abs(longitude - lastViewport.longitude) > threshold
      const isZoomChange = Math.abs(zoom - lastViewport.zoom) > zoomThreshold

      const isSignificantChange = isLatLngChange || isZoomChange

      if (isSignificantChange && !stateRef.current.pendingUpdate) {
        // Set a temporary flag to prevent multiple updates in quick succession
        stateRef.current.pendingUpdate = true
        stateRef.current.updateCount++

        // Update our reference
        stateRef.current.lastViewport = { latitude, longitude, zoom }

        // Dispatch with slight delay to prevent storm of updates
        setTimeout(() => {
          dispatch(updateQueryParams({ latitude, longitude, zoom }))
          // Clear the flag after a short delay
          setTimeout(() => {
            stateRef.current.pendingUpdate = false
          }, 50)
        }, 10)
      }
    },
    [dispatch]
  )

  return useDebouncedViewport(urlViewport, callback)
}

export const useMapBounds = (mapRef: any) => {
  const { zoom, latitude, longitude } = useViewportConnect()
  const [bounds, setBounds] = useState<MiniglobeBounds | null>(null)
  useEffect(() => {
    const mapboxRef = mapRef?.current?.getMap()
    if (mapboxRef) {
      const rawBounds = mapboxRef.getBounds()
      if (rawBounds) {
        setBounds({
          north: rawBounds.getNorth() as number,
          south: rawBounds.getSouth() as number,
          west: rawBounds.getWest() as number,
          east: rawBounds.getEast() as number,
        })
      }
    }
  }, [zoom, latitude, longitude, mapRef])
  return bounds
}

export const useHiddenLabelsConnect = () => {
  const dispatch = useAppDispatch()
  const hiddenLabels = useSelector(selectHiddenLabels)

  const dispatchHiddenLabels = (labelName: Label['name']) => {
    const newLabels = hiddenLabels.includes(labelName)
      ? hiddenLabels.filter((label: Label['name']) => label !== labelName)
      : [...hiddenLabels, labelName]

    dispatch(
      updateQueryParams({
        hiddenLabels: newLabels.length ? newLabels.join(',') : undefined,
      })
    )
  }

  return { dispatchHiddenLabels, hiddenLabels }
}

export const useDeckGLMap = (
  pointsData: TrackLabelerPoint[],
  highlightedTime: HighlightedTime | undefined,
  onClick: (info: PickingInfo) => void
) => {
  const formattedTime: { start: number; end: number } | null = useMemo(() => {
    if (highlightedTime?.start && highlightedTime?.end) {
      return {
        start: DateTime.fromISO(highlightedTime.start).toMillis(),
        end: DateTime.fromISO(highlightedTime.end).toMillis(),
      }
    }
    return null
  }, [highlightedTime])

  const layers = useMemo(() => {
    if (!pointsData.length) {
      return []
    }

    const vesselLayer = new TrackLabelerVesselLayer({
      id: 'track-points',
      data: pointsData,
      pickable: true,
      iconAtlasUrl: 'src/assets/images/vessel-sprite.png',
      highlightedTime,
      getColor: (d) => hexToDeckColor(d.color, 0.8),
      getHighlightColor: (d) => {
        if (
          formattedTime &&
          d.timestamp >= formattedTime.start &&
          d.timestamp <= formattedTime.end
        ) {
          return [255, 255, 255, 200]
        }
        return [0, 0, 0, 0]
      },
      onClick,
    })

    return [vesselLayer]
  }, [pointsData, highlightedTime, formattedTime, onClick])

  return { layers }
}
