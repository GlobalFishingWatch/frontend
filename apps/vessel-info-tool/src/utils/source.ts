import type { Vessel } from '@/types/vessel.types'

import { brazilToICCAT, panamaToICCAT } from './iccat'

export function normalizeKey(key: string): string {
  return key
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

export function identifySourceSystem(data: Vessel) {
  if (!data) return null

  const normalizedBrazilKeys = Object.keys(brazilToICCAT).map(normalizeKey)
  const normalizedPanamaKeys = Object.keys(panamaToICCAT).map(normalizeKey)

  const inputKeys = Object.keys(data).map(normalizeKey)

  const brazilMatches = inputKeys.filter((k) => normalizedBrazilKeys.includes(k)).length

  const panamaMatches = inputKeys.filter((k) => normalizedPanamaKeys.includes(k)).length

  if (brazilMatches > panamaMatches) return 'brazil'
  if (panamaMatches > brazilMatches) return 'panama'
  return null
}
