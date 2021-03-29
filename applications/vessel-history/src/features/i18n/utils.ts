import { MultiSelectOption } from '@globalfishingwatch/ui-components/dist/multi-select'
import i18n from './i18n'

export const getPlaceholderBySelections = (selections?: MultiSelectOption[]): string => {
  if (!selections?.length) return i18n.t('selects.allSelected', 'All')
  return selections.length > 1
    ? `${selections.length} ${i18n.t('selects.selected', 'selected')}`
    : selections[0].label
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
