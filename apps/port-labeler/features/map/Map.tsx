import React, { useRef, useMemo, useCallback, useEffect } from 'react'
import { InteractiveMap, MapRequest } from 'react-map-gl'
import { useSelector } from 'react-redux'
import Point from '@mapbox/point-geometry';
import { GFWAPI } from '@globalfishingwatch/api-client'
import mapStyle from 'features/map/map-style'
import { useViewport } from './map-viewport.hooks'
import MapControls from './controls/MapControls'
import styles from './Map.module.css'
import { useMapBounds } from './controls/map-controls.hooks'
import { selectPortPositionLayer } from './map.selectors'
import useMapInstance from './map-context.hooks'
import { useSelectorConnect } from './map.hooks';

const transformRequest: (...args: any[]) => MapRequest = (url: string, resourceType: string) => {
  const response: MapRequest = { url }
  if (resourceType === 'Tile' && url.includes('globalfishingwatch')) {
    response.headers = {
      Authorization: 'Bearer ' + GFWAPI.getToken(),
    }
  }
  return response
}

const handleError = ({ error }: any) => {
  if (error?.status === 401 && error?.url.includes('globalfishingwatch')) {
    GFWAPI.refreshAPIToken()
  }
}

const mapOptions = {
  customAttribution: '© Copyright Global Fishing Watch 2020',
}

const Map = (): React.ReactElement => {
  const { viewport, onViewportChange } = useViewport()

  const mapRef = useRef<any>(null)
  const mapBounds = useMapBounds(mapRef ?? null)
  
  const pointsLayer = useSelector(selectPortPositionLayer)
  const style = useMemo(() => {
    return {
      ...mapStyle,
      sources: {
        ...mapStyle.sources,
        pointsLayer
      }
    }
  }, [pointsLayer])
/*  
  const map = useMapInstance()
  useEffect(() => {
    if (!map) return
    const canvas = map.getCanvasContainer();
    
    let start;
    // Variable to hold the current xy coordinates
    // when `mousemove` or `mouseup` occurs.
    let current;
    // Variable for the draw box element.
    let box;
    // Set `true` to dispatch the event before other functions
    // call it. This is necessary for disabling the default map
    // dragging behaviour.
    canvas.addEventListener('mousedown', mouseDown, true);
    console.log(canvas)
    // Return the xy coordinates of the mouse position
    function mousePos(e) {
      const rect = canvas.getBoundingClientRect();
      return new Point(
        e.clientX - rect.left - canvas.clientLeft,
        e.clientY - rect.top - canvas.clientTop
      );
    }
    
    function mouseDown(e) {
      // Continue the rest of the function if the shiftkey is pressed.
      if (!(e.shiftKey && e.button === 0)) return;
      
      // Disable default drag zooming when the shift key is held down.
      map.dragPan.disable();
      
      // Call functions for the following events
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('keydown', onKeyDown);
      console.log(1)
      // Capture the first xy coordinates
      start = mousePos(e);
    }
    
    function onMouseMove(e) {
      // Capture the ongoing xy coordinates
      current = mousePos(e);
      
      // Append the box element if it doesnt exist
      if (!box) {
        box = document.createElement('div');
        box.classList.add(styles.mapSelection);
        canvas.appendChild(box);
      }
      console.log(2)
      const minX = Math.min(start.x, current.x),
      maxX = Math.max(start.x, current.x),
      minY = Math.min(start.y, current.y),
      maxY = Math.max(start.y, current.y);
      
      // Adjust width and xy position of the box element ongoing
      const pos = `translate(${minX}px, ${minY}px)`;
      box.style.transform = pos;
      box.style.width = maxX - minX + 'px';
      box.style.height = maxY - minY + 'px';
    }
    
    function onMouseUp(e) {
      // Capture xy coordinates
      finish([start, mousePos(e)]);
    }
    
    function onKeyDown(e) {
      // If the ESC key is pressed
      if (e.keyCode === 27) finish(null);
    }
    
    function finish(bbox) {
      // Remove these events now that finish has been called.
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mouseup', onMouseUp);
      
      if (box) {
        box.parentNode.removeChild(box);
        box = null;
      }
      
      // If bbox exists. use this value as the argument for `queryRenderedFeatures`
      if (bbox) {
        const features = map.queryRenderedFeatures(bbox, {
          layers: ['counties']
        });
        
        if (features.length >= 1000) {
          return window.alert('Select a smaller number of features');
        }
      
        // Run through the selected features and set a filter
        // to match features with unique FIPS codes to activate
        // the `counties-highlighted` layer.
        const fips = features.map((feature) => feature.properties.FIPS);
        map.setFilter('counties-highlighted', ['in', 'FIPS', ...fips]);
      }
    
      map.dragPan.enable();
    }
  }, [map])
*/
  const { box, onMouseDown, onKeyDown, onKeyUp, onMouseMove, onMouseUp } = useSelectorConnect()
  return (
    <div className={styles.container}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}>
      <InteractiveMap
        width="100%"
        height="100%"
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        mapStyle={style}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onViewportChange={onViewportChange}
        transformRequest={transformRequest}
        onError={handleError}
        mapOptions={mapOptions}
      ></InteractiveMap>
      <MapControls bounds={mapBounds}></MapControls>
      {box && 
        <div 
        style={{
          width: box.width,
          height: box.height,
          transform: box.transform
        }}
        className={styles.mapSelection}></div>
      }
    </div>
  )
}

export default Map
