import { useContext } from 'react'
import type { Map } from '@globalfishingwatch/mapbox-gl'
import type {
  EventManager,
  ContextViewportChangeHandler,
  ContextViewStateChangeHandler,
  WebMercatorViewport,
} from '@globalfishingwatch/react-map-gl'
import { _MapContext } from '@globalfishingwatch/react-map-gl'

export type ForkedContext = {
  viewport?: WebMercatorViewport
  map?: Map // need to overwrite types here to use '@globalfishingwatch/mapbox-gl' Map type
  mapContainer: HTMLElement | null
  onViewStateChange?: ContextViewStateChangeHandler
  onViewportChange?: ContextViewportChangeHandler
  isDragging: boolean
  eventManager?: EventManager
}

const MapContext = _MapContext as React.Context<ForkedContext>
export { MapContext }

export function useMapContext() {
  const context = useContext(MapContext)
  return context as ForkedContext
}

export default function useMapInstance() {
  const { map } = useMapContext()
  return map
}
