import type { LibraryLayerConfig } from 'data/map/layer-library/layers.types'
import { LAYERS_LIBRARY_ACTIVITY } from 'data/map/layer-library/layers-activity'
import { LAYERS_LIBRARY_CONTEXT } from 'data/map/layer-library/layers-context'
import { LAYERS_LIBRARY_DETECTIONS } from 'data/map/layer-library/layers-detections'
import { LAYERS_LIBRARY_ENVIRONMENT } from 'data/map/layer-library/layers-environment'
import { LAYERS_LIBRARY_EVENTS } from 'data/map/layer-library/layers-events'

export const LIBRARY_LAYERS: LibraryLayerConfig[] = [
  ...LAYERS_LIBRARY_ACTIVITY,
  ...LAYERS_LIBRARY_DETECTIONS,
  ...LAYERS_LIBRARY_EVENTS,
  ...LAYERS_LIBRARY_ENVIRONMENT,
  ...LAYERS_LIBRARY_CONTEXT,
]

export * from 'data/map/layer-library/layers.types'
export * from 'data/map/layer-library/layers-environment'
