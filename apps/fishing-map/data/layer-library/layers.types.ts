import type {
  Dataview,
  DataviewCategory,
  DataviewDatasetConfig,
  DataviewInstance,
} from '@globalfishingwatch/api-types'

import type AppResources from 'features/i18n/i18n.types'

// Browser config for equal screenshots
// map at latitude=30&longitude=4&zoom=2
// browser zoom at 80%

type LayerLibraryId = keyof AppResources['layer-library']
export type LibraryLayerConfig = Omit<DataviewInstance, 'id'> & {
  id: LayerLibraryId
  previewImageUrl: string
  moreInfoLink?: string
  onlyGFWUser?: boolean
}

export type LibraryLayer = LibraryLayerConfig & {
  category: DataviewCategory
  dataview: Dataview
  previewImageUrl: string
  datasetsConfig?: DataviewDatasetConfig[]
}
