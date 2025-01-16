import type { MultiSelectOption } from '@globalfishingwatch/ui-components'

import { t } from './i18n'

export const getPlaceholderBySelections = (selections?: MultiSelectOption[]): string => {
  if (!selections?.length) return t('selects.allSelected', 'All')
  return selections.length > 1
    ? `${selections.length} ${t('selects.selected', 'selected')}`
    : selections[0].label.toString()
}

export const removeDatasetVersion = (datasetId: string) => {
  return datasetId ? datasetId?.split(':')[0] : ''
}

export const getDatasetNameTranslated = (dataset: { id: string; name?: string }): string => {
  return t(`datasets:${removeDatasetVersion(dataset.id)}.name`, dataset.name)
}
export const getDatasetDescriptionTranslated = (dataset: {
  id: string
  description?: string
}): string => {
  return t(`datasets:${removeDatasetVersion(dataset.id)}.description`, dataset.description)
}
