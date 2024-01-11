import { LibraryLayerConfig } from 'data/layer-library/layers.types'
import { CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG } from 'data/workspaces'

export const LAYERS_LIBRARY_EVENTS: LibraryLayerConfig[] = [
  {
    id: 'encounters',
    dataviewId: CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-encounters.jpg',
  },
]
