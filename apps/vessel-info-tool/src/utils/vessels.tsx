import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

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
