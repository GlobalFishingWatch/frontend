import { MultiSelectOption } from '@globalfishingwatch/ui-components/src/multi-select'
import { removeDatasetVersion } from 'features/datasets/datasets.utils'
import i18n, { t } from './i18n'

export const getPlaceholderBySelections = (selections?: MultiSelectOption[]): string => {
  if (!selections?.length) return t('selects.allSelected', 'All')
  return selections.length > 1
    ? `${selections.length} ${t('selects.selected', 'selected')}`
    : selections[0].label
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

export const getDateFormatString = ({ locale = i18n.language, upper = false } = {}) => {
  const formatObj = new Intl.DateTimeFormat(locale).formatToParts(new Date())

  return formatObj
    .map((obj) => {
      switch (obj.type) {
        case 'day':
          return upper ? 'DD' : 'dd'
        case 'month':
          return upper ? 'MM' : 'mm'
        case 'year':
          return upper ? 'YYYY' : 'yyyy'
        default:
          return obj.value
      }
    })
    .join('')
}
