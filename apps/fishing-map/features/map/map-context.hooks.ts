import { useContext } from 'react'
import { MapContext, _useMapControl } from 'react-map-gl'
import type { ExtraState, ViewportProps, WebMercatorViewport } from 'react-map-gl'
import type { Map } from '@globalfishingwatch/mapbox-gl'

export type ViewportChangeHandler = (viewState: ViewportProps) => void

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
  return context as any
}

export default function useMapInstance() {
  const { map } = useMapContext()
  return map
}

const CaptureControlProps = {
  captureScroll: true,
  captureDrag: true,
  captureClick: true,
  capturePointerMove: true,
}
export function useMapControl(props = CaptureControlProps) {
  return _useMapControl(props)
}
