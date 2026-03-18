import { createServerFn } from '@tanstack/react-start'

import type { StrapiResponse, UserGuideSection } from './strapi.types'

function getStrapiURL() {
  return import.meta.env.VITE_STRAPI_BASE_URL ?? 'http://localhost:1337'
}

export function getStrapiMedia(url: string | null) {
  if (url == null) return null
  if (url.startsWith('data:')) return url
  if (url.startsWith('http') || url.startsWith('//')) return url
  return `${getStrapiURL()}${url}`
}

export const fetchUserGuideSections = createServerFn({ method: 'GET' })
  .inputValidator((data: { locale?: string; page?: number; pageSize?: number }) => data)
  .handler(async ({ data }) => {
    const { locale = 'en', page = 1, pageSize = 100 } = data
    const url = new URL(`${getStrapiURL()}/api/user-guide-sections`)
    url.searchParams.set('locale', locale)
    url.searchParams.set('populate', 'contentBlocks')
    url.searchParams.set('pagination[page]', String(page))
    url.searchParams.set('pagination[pageSize]', String(pageSize))

    console.info(`Fetching user guide sections for locale ${locale}...`)

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`Failed to fetch user guide sections: ${response.statusText}`)
    }
    return response.json() as Promise<StrapiResponse<UserGuideSection>>
  })

export const fetchUserGuideSectionById = createServerFn({ method: 'GET' })
  .inputValidator((data: { documentId: string; locale?: string }) => data)
  .handler(async ({ data }) => {
    const { documentId, locale = 'en' } = data
    const url = new URL(`${getStrapiURL()}/api/user-guide-sections/${documentId}`)
    url.searchParams.set('locale', locale)
    url.searchParams.set('populate', 'contentBlocks')

    console.info(`Fetching user guide section ${documentId}...`)

    const response = await fetch(url.toString())
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Failed to fetch user guide section: ${response.statusText}`)
    }
    const result = await response.json()
    return result.data as UserGuideSection
  })
