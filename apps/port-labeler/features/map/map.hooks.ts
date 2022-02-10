import { useCallback, useState } from 'react'
import { atom, useRecoilState } from 'recoil'
import type { MapEvent, ViewportProps } from 'react-map-gl'
import Point from '@mapbox/point-geometry';
//import { MapEvent } from '@globalfishingwatch/maplibre-gl';
import { MapCoordinates } from 'types'
import useMapInstance from './map-context.hooks';

type UseSelector = {
  box: any
  onKeyDown: (evt: any) => void
  onKeyUp: (evt: any) => void
  onMouseDown: (evt: MapEvent) => void
  onMouseMove: (evt: MapEvent) => void
  onMouseUp: (evt: MapEvent) => void
}

export function useSelectorConnect(): UseSelector {

  const [start, setStart] = useState<Point | null>(null)
  const [current, setCurrent] = useState<Point | null>(null)
  const [box, setBox] = useState(null)
  const [dragging, setDragging] = useState(false)

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
    console.log(e)
    // Continue the rest of the function if the shiftkey is pressed.
    if (!(e.shiftKey && e.keyCode === 16)) return;
    setDragging(true)
    console.log('onKeyDown')
  }, [])

  const onKeyUp = useCallback((e: any) => {
    console.log(e)
    // Continue the rest of the function if the shiftkey is pressed.
    if (!(e.keyCode === 16)) return;
    setDragging(false)
    setStart(null)
    //setBox(null)
    console.log('onKeyUp')
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
    console.log('mouse up')
    console.log([start,box.endPosition])
    if(dragging && start) {
      console.log('mouse up2')
      
      const bbox = box
      if (box) {
        setBox(null)
        
        const features = map.queryRenderedFeatures([start,bbox.endPosition], {
          layers: ['portPoints']
        });
        console.log(features)
      }
      
    }
    map.dragPan.enable();
    setStart(null)
  }, [box, dragging, map, start])

  const onMouseMove = useCallback((e: MapEvent) => {
    if(dragging && start){
      const actualPosition = mousePos(e)
      setCurrent(actualPosition)
      
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
      console.log(start, newBox)
    }
  }, [box, dragging, mousePos, start])

  return { box, onKeyDown, onKeyUp, onMouseDown, onMouseMove, onMouseUp }
}
