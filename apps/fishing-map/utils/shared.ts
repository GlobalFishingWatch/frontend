import type { JSX } from 'react'

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

type Field = { id: string | number; label: string | number | JSX.Element }

export const sortStrings = (a: string, b: string) => a.localeCompare(b)

export const sortFields = (a: Field, b: Field) => {
  const aLabel = (a.label && typeof a.label === 'string') || a.id
  const bLabel = (b.label && typeof b.label === 'string') || b.id

  if (!aLabel && !bLabel) return 0
  if (!aLabel) return -1
  if (!bLabel) return 1

  if (typeof aLabel === 'number' || typeof bLabel === 'number') {
    return (aLabel as number) - (bLabel as number)
  }

  if (typeof aLabel === 'boolean' || typeof bLabel === 'boolean') {
    return 0
  }
  return aLabel.localeCompare(bLabel)
}

export const listAsSentence = (list: string[]) => {
  if (!list) return
  if (list.length === 1) return list[0]
  if (list.length === 2) return list.join(` ${t('common.and', 'and')} `)
  return `${list.slice(0, -1).join(', ')} ${t('common.and', 'and')} ${list.slice(-1)}`
}
