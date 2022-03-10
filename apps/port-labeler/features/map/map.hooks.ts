import { useCallback, useState } from 'react'
import type { MapEvent } from 'react-map-gl'
import Point from '@mapbox/point-geometry';
import { useDispatch, useSelector } from 'react-redux';
import { fitBounds } from 'viewport-mercator-project';
import { segmentsToBbox } from '@globalfishingwatch/data-transforms'
import { selectSelectedPoints, setHoverPoint, setSelectedPoints } from 'features/labeler/labeler.slice';
import { selectPortPointsByCountry } from 'features/labeler/labeler.selectors';
import { PortPosition } from 'types';
import useMapInstance from './map-context.hooks';
import { useViewport } from './map-viewport.hooks';


type UseSelector = {
  box: any
  onKeyDown: (evt: any) => void
  onKeyUp: (evt: any) => void
  onMouseDown: (evt: MapEvent) => void
  onMouseMove: (evt: MapEvent) => void
  onMouseUp: (evt: MapEvent) => void
  onHover: (evt: MapEvent) => void
  onMapclick: (evt: MapEvent) => void
}

export function useSelectorConnect(): UseSelector {
  const dispatch = useDispatch()
  const [start, setStart] = useState<Point | null>(null)
  const [box, setBox] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [hoveredStateId, setHoveredStateId] = useState(null)
  const selected = useSelector(selectSelectedPoints)
  const map = useMapInstance()
  const canvas = map?.getCanvasContainer();

  const mousePos = useCallback((e) => {
    return new Point(
      e.offsetCenter.x,
      e.offsetCenter.y
    );
  }, [])

  const onKeyDown = useCallback((e: any) => {
    // Continue the rest of the function if the shiftkey is pressed.
    if (!(e.shiftKey && e.keyCode === 16)) return;
    setDragging(true)
  }, [])

  const onKeyUp = useCallback((e: any) => {
    // Continue the rest of the function if the shiftkey is pressed.
    if (!(e.keyCode === 16)) return;
    setDragging(false)
    setStart(null)
    setBox(null)
  }, [])

  const onMouseDown = useCallback((e: MapEvent) => {
    // Disable default drag zooming when the shift key is held down.
    map.dragPan.disable();

    // Capture the first xy coordinates
    setStart(mousePos(e))
    setBox({
      startLat: e.lngLat[1],
      startLng: e.lngLat[0],
    })
  }, [map, mousePos])

  const onMouseUp = useCallback((e: MapEvent) => {
    if (dragging && start) {
      const bbox = box
      if (box) {
        setBox(null)

        const features = map.queryRenderedFeatures([start, bbox.endPosition], {
          layers: ['portPoints']
        });
        dispatch(setSelectedPoints(selected.concat(features.map(point => point.properties.id))))
      }

    }/* else {
      dispatch(setSelectedPoints([]))
    }*/
    map.dragPan.enable();
    setStart(null)
  }, [box, dispatch, dragging, map, start])

  const onMapclick = useCallback((e: MapEvent) => {
    if (e) {
      const newSelected = [...selected]
      const pointsOnClick = e.features?.filter(point => point.source === 'pointsLayer')
      if (pointsOnClick.length) {

        pointsOnClick.map(point => point.properties.id).forEach(point => {
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
  }, [selected])

  const onMouseMove = useCallback((e: MapEvent) => {
    if (dragging && start) {
      const actualPosition = mousePos(e)

      // Append the box element if it doesnt exist
      const newBox = box

      const minX = Math.min(start.x, actualPosition.x),
        maxX = Math.max(start.x, actualPosition.x),
        minY = Math.min(start.y, actualPosition.y),
        maxY = Math.max(start.y, actualPosition.y);

      // Adjust width and xy position of the box element ongoing
      const pos = `translate(${minX}px, ${minY}px)`;
      newBox.transform = pos;
      newBox.width = maxX - minX + 'px';
      newBox.height = maxY - minY + 'px';
      newBox.endLat = e.lngLat[1]
      newBox.endLng = e.lngLat[0]
      newBox.endPosition = actualPosition
      setBox(newBox)
    }
  }, [box, dragging, mousePos, start])

  const onHover = useCallback((e: MapEvent) => {
    if (e.features && e.features.length > 0 && e.features[0].source === "pointsLayer") {
      if (hoveredStateId !== null) {
        map.setFeatureState(
          { source: 'pointsLayer', id: hoveredStateId },
          { hover: false }
        );
      }
      setHoveredStateId(e.features[0].id);
      map.setFeatureState(
        { source: 'pointsLayer', id: e.features[0].id },
        { hover: true }
      );
      dispatch(setHoverPoint(e.features[0].properties.id))
    } else if (hoveredStateId !== null) {
      map.setFeatureState(
        { source: 'pointsLayer', id: hoveredStateId },
        { hover: false }
      );
    }

  }, [dispatch, hoveredStateId, map])

  return { box, onKeyDown, onKeyUp, onMouseDown, onMouseMove, onMouseUp, onHover, onMapclick }
}


type UseMap = {
  centerPoints: (points: PortPosition[]) => void
}

export function useMapConnect(): UseMap {
  const map = useMapInstance()
  const { setMapCoordinates } = useViewport()

  const centerPoints = useCallback(
    (points) => {
      if (points) {
        const bbox = points?.length ? segmentsToBbox([points.map(point => ({
          latitude: point.lon,
          longitude: point.lat
        }))]) : undefined
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