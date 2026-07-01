import { useMapDataviewsLayers } from 'features/map/map-layers.hooks'
import { useSyncMapHighlights } from 'features/map/map-layers.sync.hooks'

// Runs layer composition and hover-only layer updates outside DeckGLWrapper
// so pointer movement does not rebuild DeckGL props.
export default function LayersComposer() {
  useMapDataviewsLayers()
  useSyncMapHighlights()
  return null
}
