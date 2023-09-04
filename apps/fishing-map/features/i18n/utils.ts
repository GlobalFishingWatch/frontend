import { EXCLUDE_FILTER_ID, FilterOperator } from '@globalfishingwatch/api-types'
import { MultiSelectOption } from '@globalfishingwatch/ui-components'
import { GetDatasetLabelParams, getDatasetLabel } from 'features/datasets/datasets.utils'
import i18n, { t } from './i18n'

type PlaceholderBySelectionParams = {
  selection?: string | string[]
  options?: MultiSelectOption[]
  filterOperator?: FilterOperator
}
export const getPlaceholderBySelections = ({
  selection,
  options,
  filterOperator,
}: PlaceholderBySelectionParams): string => {
  if (!selection?.length) {
    return filterOperator === EXCLUDE_FILTER_ID
      ? t('selects.noneSelected', 'None')
      : t('selects.allSelected', 'All')
  }
  const isSelectionArray = Array.isArray(selection)
  const optionSelected = options?.filter((o) =>
    isSelectionArray ? selection.includes(o.id) : o.id === selection
  )
  const placeholder =
    isSelectionArray && selection.length > 1
      ? `${selection.length} ${t('selects.selected', 'selected')}`
      : optionSelected?.[0]?.label

  if (typeof placeholder === 'string') {
    return placeholder
  }
  // Otherwise we are using the DatasetLabelComponent
  return getDatasetLabel(placeholder?.props.dataset)
}

export const removeDatasetVersion = (datasetId: string) => {
  return datasetId ? datasetId?.split(':')[0] : ''
}

export const getDatasetNameTranslated = (dataset = {} as GetDatasetLabelParams): string => {
  return t(`datasets:${removeDatasetVersion(dataset?.id)}.name`, dataset?.name || dataset?.id)
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
