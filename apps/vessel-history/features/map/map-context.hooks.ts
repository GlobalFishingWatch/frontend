import { useContext } from 'react'
import { MapContext } from 'react-map-gl'
import type { ExtraState, ViewportProps, WebMercatorViewport } from 'react-map-gl'
import type { Map } from '@globalfishingwatch/maplibre-gl'

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
  map?: Map // need to overwrite types here to use '@globalfishingwatch/maplibre-gl' Map type
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
  return context
}

export default function useMapInstance() {
  const { map } = useMapContext()
  return map
}
