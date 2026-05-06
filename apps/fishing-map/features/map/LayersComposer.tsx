import {
  useMapDataviewsLayers,
  useSyncMapHoverHighlightedFeatures,
} from 'features/map/map-layers.hooks'

// Runs layer composition and hover-only layer updates outside DeckGLWrapper
// so pointer movement does not rebuild DeckGL props.
export default function LayersComposer() {
  useMapDataviewsLayers()
  useSyncMapHoverHighlightedFeatures()
  return null
}
