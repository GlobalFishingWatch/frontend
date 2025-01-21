import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Point from '@mapbox/point-geometry'
import { fitBounds } from '@math.gl/web-mercator'
import type { PortPosition } from 'types'

import { segmentsToBbox } from '@globalfishingwatch/data-transforms'
import type { LngLat, MapLayerMouseEvent } from '@globalfishingwatch/maplibre-gl'

import {
  selectSelectedPoints,
  setHoverPoint,
  setSelectedPoints,
} from 'features/labeler/labeler.slice'

import useMapInstance from './map-context.hooks'
import { useViewport } from './map-viewport.hooks'

interface BoxSelection {
  startPosition?: Point
  endPosition?: Point
  startCoords?: LngLat
  endCoords?: LngLat
}

type UseSelector = {
  box?: BoxSelection
  boxTransform?: string
  boxWidth?: string
  boxHeight?: string
  onMouseDown: (evt: MapLayerMouseEvent) => void
  onMouseMove: (evt: MapLayerMouseEvent) => void
  onMouseUp: (evt: MapLayerMouseEvent) => void
  onHover: (evt: MapLayerMouseEvent) => void
  onMapclick: (evt: MapLayerMouseEvent) => void
}

// The selector connect is mainly to manage the selection of points on the map
export function useSelectorConnect(): UseSelector {
  const dispatch = useDispatch()
  const [box, setBox] = useState(null)
  const [boxTransform, setBoxTransform] = useState(null)
  const [boxHeight, setBoxHeight] = useState(null)
  const [boxWidth, setBoxWidth] = useState(null)
  const [hoveredStateId, setHoveredStateId] = useState(null)
  const selected = useSelector(selectSelectedPoints)
  const map = useMapInstance()
  const canvas = map?.getCanvasContainer()

  const mousePos = useCallback((e) => {
    return new Point(e.point.x, e.point.y)
  }, [])

  const onMouseDown = useCallback(
    (e: MapLayerMouseEvent) => {
      if (!(e.originalEvent.shiftKey && e.originalEvent.button === 0)) return;
      // Disable default drag zooming when the shift key is held down.
      if (map) {
        map.dragPan?.disable()
      }

      // Capture the first xy coordinates
      setBox({
        startCoords: e.lngLat,
        startPosition: mousePos(e)
      })
    },
    [map, mousePos]
  )

  // control the selection box movement
  const onMouseMove = useCallback(
    (e: MapLayerMouseEvent) => {
      if (box) {
        const actualPosition = mousePos(e)
        // Append the box element if it doesnt exist
        const newBox = box

        const minX = Math.min(box.startPosition.x, actualPosition.x),
          maxX = Math.max(box.startPosition.x, actualPosition.x),
          minY = Math.min(box.startPosition.y, actualPosition.y),
          maxY = Math.max(box.startPosition.y, actualPosition.y)

        // Adjust width and xy position of the box element ongoing
        const pos = `translate(${minX}px, ${minY}px)`

        newBox.endCoords = e.lngLat
        newBox.endPosition = actualPosition
        setBox(newBox)
        setBoxTransform(pos)
        setBoxWidth(maxX - minX + 'px')
        setBoxHeight(maxY - minY + 'px')
      } else {
        if (map) {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ['portPoints'],
          })
          if (features && features.length > 0) {
            if (hoveredStateId !== null) {
              map.setFeatureState({ source: 'pointsLayer', id: hoveredStateId }, { hover: false })
            }
            setHoveredStateId(features[0].id)
            map.setFeatureState({ source: 'pointsLayer', id: features[0].id }, { hover: true })
            dispatch(setHoverPoint(features[0].properties.id))
          } else if (hoveredStateId !== null) {
            map.setFeatureState({ source: 'pointsLayer', id: hoveredStateId }, { hover: false })
          }
        }
      }
    },
    [dispatch, box, mousePos, hoveredStateId, map]
  )

  const onMouseUp = useCallback(
    (e: MapLayerMouseEvent) => {
      if (box && box.endPosition && box.startPosition) {
        const features = map.queryRenderedFeatures([box.startPosition, box.endPosition], {
          layers: ['portPoints'],
        })
        dispatch(setSelectedPoints(selected.concat(features.map((point) => point.properties.id))))
      }
      if (map) {
        map.dragPan?.enable()
      }
      setBox(null)
      setBoxHeight(null)
      setBoxTransform(null)
      setBoxWidth(null)
    },
    [box, dispatch, map]
  )

  // here starts the feature to select points in mass
  const onMapclick = useCallback(
    (e: MapLayerMouseEvent) => {
      if (e && map) {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['portPoints'],
        })
        const newSelected = [...selected]
        const pointsOnClick = features?.filter((point) => (point as any).source === 'pointsLayer')
        if (pointsOnClick && pointsOnClick.length) {
          pointsOnClick
            .map((point) => point.properties.id)
            .forEach((point) => {
              const i = newSelected.indexOf(point)
              if (i === -1) {
                newSelected.push(point)
              } else {
                newSelected.splice(i, 1)
              }
            })
          dispatch(setSelectedPoints(newSelected))
        } else {
          dispatch(setSelectedPoints([]))
        }
      } else {
        dispatch(setSelectedPoints([]))
      }
    },
    [selected]
  )

  // here we use the mapbox feature to hightlight points on hover
  const onHover = useCallback(
    (e: MapLayerMouseEvent) => {
      //const feature = e?.features?.[0] as any
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['portPoints'],
      })
      if (features && features.length > 0) {
        if (hoveredStateId !== null) {
          map.setFeatureState({ source: 'pointsLayer', id: hoveredStateId }, { hover: false })
        }
        setHoveredStateId(e.features[0].id)
        map.setFeatureState({ source: 'pointsLayer', id: e.features[0].id }, { hover: true })
        dispatch(setHoverPoint(e.features[0].properties.id))
      } else if (hoveredStateId !== null) {
        map.setFeatureState({ source: 'pointsLayer', id: hoveredStateId }, { hover: false })
      }
    },
    [dispatch, hoveredStateId, map]
  )

  return {
    box,
    boxTransform,
    boxHeight,
    boxWidth,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onHover,
    onMapclick,
  }
}

type UseMap = {
  centerPoints: (points: PortPosition[]) => void
}

export function useMapConnect(): UseMap {
  const map = useMapInstance()
  const { setMapCoordinates } = useViewport()

  // this is to center the positions (points) on the map when the user change the country
  const centerPoints = useCallback(
    (points) => {
      if (points) {
        const bbox = points?.length
          ? segmentsToBbox([
            points.map((point) => ({
              latitude: point.lon,
              longitude: point.lat,
            })),
          ])
          : undefined
        const { width, height } = map?.transform || {}
        if (width && height && bbox) {
          const [minLng, minLat, maxLng, maxLat] = bbox
          const { latitude, longitude, zoom } = fitBounds({
            bounds: [
              [minLat, minLng],
              [maxLat, maxLng],
            ],
            width,
            height,
            padding: 60,
          })
          setMapCoordinates({ latitude, longitude, zoom })
        }
      }
    },
    [map, setMapCoordinates]
  )
  return { centerPoints }
}
