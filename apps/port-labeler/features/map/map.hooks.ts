import { useCallback, useState } from 'react'
import { atom, useRecoilState } from 'recoil'
import type { MapEvent, ViewportProps } from 'react-map-gl'
import Point from '@mapbox/point-geometry';
//import { MapEvent } from '@globalfishingwatch/maplibre-gl';
import { useDispatch } from 'react-redux';
import { MapCoordinates } from 'types'
import { setSelectedPoints } from 'features/labeler/labeler.slice';
import useMapInstance from './map-context.hooks';

type UseSelector = {
  box: any
  onKeyDown: (evt: any) => void
  onKeyUp: (evt: any) => void
  onMouseDown: (evt: MapEvent) => void
  onMouseMove: (evt: MapEvent) => void
  onMouseUp: (evt: MapEvent) => void
  onHover: (evt: MapEvent) => void
}

export function useSelectorConnect(): UseSelector {
  const dispatch = useDispatch()
  const [start, setStart] = useState<Point | null>(null)
  const [box, setBox] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [hoveredStateId, setHoveredStateId] = useState(null)

  const map = useMapInstance()
  const canvas = map?.getCanvasContainer();

  const mousePos = useCallback((e) => {
    const rect = canvas.getBoundingClientRect();
    console.log(rect, e)
    return new Point(
      e.offsetCenter.x,
      e.offsetCenter.y
    );
  }, [canvas])

  const onKeyDown = useCallback((e: any) => {
    // Continue the rest of the function if the shiftkey is pressed.
    if (!(e.shiftKey && e.keyCode === 16)) return;
    setDragging(true)
    console.log('onKeyDown')
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
    if(dragging && start) {
      const bbox = box
      if (box) {
        setBox(null)
        
        const features = map.queryRenderedFeatures([start, bbox.endPosition], {
          layers: ['portPoints']
        });
        dispatch(setSelectedPoints(features.map(point => point.properties.id)))
      }
      
    } else {
      dispatch(setSelectedPoints([]))
    }
    map.dragPan.enable();
    setStart(null)
  }, [box, dispatch, dragging, map, start])

  const onMouseMove = useCallback((e: MapEvent) => {
    if(dragging && start){
      const actualPosition = mousePos(e)
      
      // Append the box element if it doesnt exist
      const newBox = box
 
      const minX = Math.min(start.x, actualPosition.x),
      maxX = Math.max(start.x, actualPosition.x),
      minY = Math.min(start.y, actualPosition.y),
      maxY = Math.max(start.y, actualPosition.y);
      
      // Adjust width and xy position of the box element ongoing
      const pos = `translate(${minX}px, ${minY}px)`;
      //newBox.style.transform = pos;
      //newBox.style.width = maxX - minX + 'px';
      //newBox.style.height = maxY - minY + 'px';
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
    if (e.features && e.features.length > 0) {
        console.log(typeof e.features[0].id)
        console.log(e.features)
        console.log(hoveredStateId)
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
        console.log(map.getFeatureState({ source: 'pointsLayer', id: e.features[0].id }))
      }
    
  }, [hoveredStateId, map])

  return { box, onKeyDown, onKeyUp, onMouseDown, onMouseMove, onMouseUp, onHover }
}
