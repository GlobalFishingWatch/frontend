import { createServerFn } from '@tanstack/react-start'

import type { UserGuideSection } from 'features/cms/loaders/user-guide.types'
import { fetchStrapiCollectionCached } from 'features/cms/loaders/utils'
import type { StrapiResponse } from 'features/cms/strapi.types'
import type { Locale } from 'types'

// Titles and slugs only: enough for the section menu and the prev/next links, no bodies.
const INDEX_PARAMS = {
  fields: ['title', 'slug'],
  populate: { subsections: { fields: ['title', 'slug'] } },
}

export const getUserGuideContent = createServerFn({
  method: 'GET',
})
  .validator((params: { locale?: Locale; slug?: string; index?: boolean } = {}) => params)
  .handler(({ data: { locale, slug, index } }): Promise<StrapiResponse<UserGuideSection>> =>
    fetchStrapiCollectionCached<UserGuideSection>({
      collectionName: 'user-guide-sections',
      params: {
        sort: ['createdAt:asc'],
        ...(index ? INDEX_PARAMS : { populate: '*' }),
        ...(slug && { filters: { slug: { $eq: slug } } }),
      },
      locale,
    })
  )
