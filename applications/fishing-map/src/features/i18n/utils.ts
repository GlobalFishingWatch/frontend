import { MultiSelectOption } from '@globalfishingwatch/ui-components/dist/multi-select'
import i18n from './i18n'

export const getPlaceholderBySelections = (selections?: MultiSelectOption[]): string => {
  if (!selections?.length) return i18n.t('selects.placeholder', 'Select an option')
  return selections.length > 1
    ? `${selections.length} ${i18n.t('selects.selection', 'selected')}`
    : selections[0].label
}
