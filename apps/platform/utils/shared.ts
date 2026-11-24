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

const RANGE_LABEL_REGEX =
  /^\s*(?:([<>])=?\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*-\s*\d+(?:\.\d+)?)\s*$/

// [lower bound, tiebreak]: "<2" sorts just before "2-4", ">25" just after anything starting at 25
const getRangeSortKey = (label: string): [number, number] | undefined => {
  const match = RANGE_LABEL_REGEX.exec(label)
  if (!match) return
  const [, comparator, boundary, start] = match
  if (comparator) return [Number(boundary), comparator === '<' ? -1 : 1]
  return [Number(start), 0]
}

export const sortFields = (a: Field, b: Field) => {
  const aLabel = typeof a.label === 'string' && a.label ? a.label : a.id
  const bLabel = typeof b.label === 'string' && b.label ? b.label : b.id

  if (!aLabel && !bLabel) return 0
  if (!aLabel) return -1
  if (!bLabel) return 1

  if (typeof aLabel === 'number' || typeof bLabel === 'number') {
    return (aLabel as number) - (bLabel as number)
  }

  if (typeof aLabel === 'boolean' || typeof bLabel === 'boolean') {
    return 0
  }

  const aRange = getRangeSortKey(aLabel)
  const bRange = getRangeSortKey(bLabel)
  if (aRange && bRange) {
    return aRange[0] - bRange[0] || aRange[1] - bRange[1]
  }
  // numeric: digit runs compare by value, so "1.9" < "1.10" and "2" < "10"
  return aLabel.localeCompare(bLabel, undefined, { numeric: true })
}

export const listAsSentence = (list: string[], andOr: 'and' | 'or' = 'and') => {
  if (!list) return
  if (list.length === 1) return list[0]
  if (list.length === 2) return list.join(` ${t((t) => t.common[andOr])} `)
  return `${list.slice(0, -1).join(', ')} ${t((t) => t.common[andOr])} ${list.slice(-1)}`
}
