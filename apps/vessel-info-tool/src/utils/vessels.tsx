import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { fieldMap, type Vessel } from '@/types/vessel.types'

export const parseVessels = (data: Vessel[], targetSystem: 'iccat' | 'sprfmo' | 'gr'): Vessel[] => {
  if (!data.length) return []

  const sampleKeys = Object.keys(data[0])

  const matchConfig = Object.entries(fieldMap).map(([internalKey, config]) => {
    const possibleNames = [config[targetSystem], config.gr, ...(config.variants || [])].filter(
      Boolean
    )

    return { internalKey, possibleNames, config }
  })

  return data.map((row) => {
    const normalized: Vessel = { id: '', name: '' }

    matchConfig.forEach(({ internalKey, possibleNames, config }) => {
      let bestMatchKey: string | undefined

      bestMatchKey = sampleKeys.find((k) =>
        possibleNames.some((name) => k.toLowerCase() === name.toLowerCase())
      )

      if (!bestMatchKey) {
        bestMatchKey = sampleKeys.find((k) =>
          possibleNames.some((name) => k.toLowerCase().includes(name.toLowerCase()))
        )
      }

      const outputKey = config[targetSystem]
      normalized[outputKey] = bestMatchKey ? row[bestMatchKey] : null
    })

    return normalized
  })
}

export const fetchVessels = createServerFn().handler(async () => {
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
