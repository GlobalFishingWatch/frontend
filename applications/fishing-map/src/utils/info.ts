import flags from 'data/flags'
import { formatDate } from './dates'

export const formatInfoField = (fieldValue: string, type: string) => {
  if (type === 'date') return formatDate(fieldValue)
  if (type === 'flag') return flags.find((flag) => flag.id === fieldValue)?.label
  return fieldValue
}

export const formatInfoLabel = (fieldLabel: string) => {
  return fieldLabel.replaceAll('_', ' ')
}
