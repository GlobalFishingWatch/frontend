import { useContext } from 'react'
import { MapContext, ViewportProps, WebMercatorViewport } from 'react-map-gl'
import type { Map } from '@globalfishingwatch/mapbox-gl'

export type ViewportChangeHandler = (viewState: ViewportProps) => void
export interface ExtraState {
  inTransition?: boolean | undefined
  isDragging?: boolean | undefined
  isHovering?: boolean | undefined
  isPanning?: boolean | undefined
  isRotating?: boolean | undefined
  isZooming?: boolean | undefined
}
export type ContextViewportChangeHandler = (
  viewState: ViewportProps,
  interactionState: ExtraState,
  oldViewState: ViewportProps
) => void

export interface ViewStateChangeInfo {
  viewState: ViewportProps
}

export type ViewStateChangeHandler = (info: ViewStateChangeInfo) => void

export type ForkedContext = {
  viewport?: WebMercatorViewport
  map?: Map // need to overwrite types here to use '@globalfishingwatch/mapbox-gl' Map type
  container: HTMLElement | null
  mapContainer: HTMLElement | null
  onViewStateChange?: ViewStateChangeHandler
  onViewportChange?: ContextViewportChangeHandler
  isDragging: boolean
  eventManager?: any
}

// const MapContext = _MapContext as React.Context<ForkedContext>
export { MapContext }

export function useMapContext() {
  const context = useContext(MapContext)
  return context as ForkedContext
}

export default function useMapInstance() {
  const { map } = useMapContext()
  return map
}
