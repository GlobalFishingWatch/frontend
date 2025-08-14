import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import type { Vessel } from '@/types/vessel.types'

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
