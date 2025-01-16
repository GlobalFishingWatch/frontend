import type {
  DatasetConfiguration,
  Dataview,
  DataviewCategory,
  DataviewInstance,
} from '@globalfishingwatch/api-types'

import type libraryTranslations from '../../public/locales/source/layer-library.json'

// Browser config for equal screenshots
// map at latitude=30&longitude=4&zoom=2
// browser zoom at 80%

export type LibraryLayerConfig = Omit<DataviewInstance, 'id'> & {
  id: keyof typeof libraryTranslations
  previewImageUrl: string
  moreInfoLink?: string
  onlyGFWUser?: boolean
}

export type LibraryLayer = LibraryLayerConfig & {
  category: DataviewCategory
  dataview: Dataview
  previewImageUrl: string
  datasetsConfig?: DatasetConfiguration[]
}
