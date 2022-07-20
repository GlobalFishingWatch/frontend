import { EXCLUDE_FILTER_ID, FilterOperator } from '@globalfishingwatch/api-types'
import { MultiSelectOption } from '@globalfishingwatch/ui-components'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import i18n, { t } from './i18n'

export const getPlaceholderBySelections = (
  selections?: MultiSelectOption[],
  filterOperator?: FilterOperator
): string => {
  if (!selections?.length) {
    return filterOperator === EXCLUDE_FILTER_ID
      ? t('selects.noneSelected', 'None')
      : t('selects.allSelected', 'All')
  }
  const placeholder =
    selections.length > 1
      ? `${selections.length} ${t('selects.selected', 'selected')}`
      : selections[0].label
  if (typeof placeholder === 'string') {
    return placeholder
  }
  // Otherwise we are using the DatasetLabelComponent
  return getDatasetLabel(placeholder.props.dataset)
}

export const removeDatasetVersion = (datasetId: string) => {
  return datasetId ? datasetId?.split(':')[0] : ''
}

export const getDatasetNameTranslated = (dataset: { id: string; name?: string }): string => {
  return t(`datasets:${removeDatasetVersion(dataset?.id)}.name`, dataset?.name)
}

export const getDatasetDescriptionTranslated = (dataset: {
  id: string
  description?: string
}): string => {
  return t(`datasets:${removeDatasetVersion(dataset?.id)}.description`, dataset?.description)
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

export const joinTranslatedList = (list: string[], condition: 'or' | 'and' = 'or') => {
  return list.reduce(function (acc, el, i) {
    return acc + (i === list.length - 1 ? ` ${t(`common.${condition}`, condition)} ` : ', ') + el
  })
}
