import { t } from 'features/i18n/i18n'

export const capitalize = (s: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const toFixed = (value: number, decimals = 2) => {
  if (typeof value !== 'number') {
    console.warn('Value not valid be fixed parsed, returning original value', value)
    return value
  }
  return (Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals)
}

export type Field = { id: string | number; label: string | number }

export const sortStrings = (a: string, b: string) => a.localeCompare(b)

export const sortFields = (a: Field, b: Field) => {
  if (typeof a.label === 'number' || typeof b.label === 'number') {
    return (a.label as number) - (b.label as number)
  }

  if (typeof a.label === 'boolean' || typeof b.label === 'boolean') {
    return 0
  }

  return a.label.localeCompare(b.label)
}

export const listAsSentence = (list: string[]) => {
  if (!list) return
  if (list.length === 1) return list[0]
  if (list.length === 2) return list.join(` ${t('common.and', 'and')} `)
  return `${list.slice(0, -1).join(', ')} ${t('common.and', 'and')} ${list.slice(-1)}`
}
