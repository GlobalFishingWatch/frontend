import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import type { FilterState, FilterType } from '@/types/vessel.types'

export type Vessel = {
  IMO: string
}

export const fetchVessels = createServerFn().handler(async () => {
  console.info('Fetching posts...')

  const res = await fetch('/api/vessels/scraped')
  if (!res.ok) {
    if (res.status === 404) {
      throw notFound()
    }

    throw new Error('Failed to fetch post')
  }

  const vessels = (await res.json()) as Vessel[]

  return vessels
})

export const generateFilterConfigs = (data: any[]): FilterState[] => {
  if (!data.length) return []

  const valuesMap: Record<string, Set<string>> = {}

  data.forEach((row) => {
    Object.entries(row).forEach(([key, value]) => {
      if (!valuesMap[key]) {
        valuesMap[key] = new Set()
      }
      valuesMap[key].add(String(value))
    })
  })

  return Object.entries(valuesMap).map(([key, valueSet]) => {
    const valuesArray = Array.from(valueSet)
    let isDateValues = true
    let isNumberValues = true
    let isLink = true
    const linkPattern = /^(https?:\/\/|www\.)/i

    for (const value of valuesArray) {
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        isDateValues = false
      }

      if (isNaN(Number(value)) || value.trim() === '') {
        isNumberValues = false
      }

      if (!linkPattern.test(value.trim())) {
        isLink = false
      }

      if (!isDateValues && !isNumberValues && !isLink) {
        break
      }
    }

    let type: FilterType
    switch (true) {
      case valueSet.size <= 1:
        type = ''
        break
      case isDateValues:
        type = 'date'
        break
      case isNumberValues:
        type = 'number'
        break
      case isLink:
        type = ''
        break
      case valueSet.size > 15:
        type = 'text'
        break
      default:
        type = 'select'
    }

    return {
      id: key,
      label: key,
      type,
      ...(type === 'select' && {
        options: Array.from(valueSet)
          .sort()
          .map((value) => ({
            id: value,
            label: value,
          })),
      }),
    }
  })
}
