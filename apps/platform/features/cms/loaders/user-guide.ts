import { createServerFn } from '@tanstack/react-start'

import type { UserGuideSection } from 'features/cms/loaders/user-guide.types'
import { fetchStrapiCollectionCached } from 'features/cms/loaders/utils'
import type { StrapiResponse } from 'features/cms/strapi.types'
import { toCardResponse } from 'features/help/helpHub.utils'
import type { Locale } from 'types'

const VARIANT_PARAMS = {
  // Titles and slugs only: enough for the section menu and the prev/next links, no bodies.
  index: {
    fields: ['title', 'slug'],
    populate: { subsections: { fields: ['title', 'slug'] } },
  },
  card: { fields: ['title', 'slug', 'body'], populate: '*' },
  full: { populate: '*' },
}

export const getUserGuideContent = createServerFn({
  method: 'GET',
})
  .validator(
    (
      params: { locale?: Locale; slug?: string; variant?: 'index' | 'card'; first?: boolean } = {}
    ) => params
  )
  .handler(
    async ({
      data: { locale, slug, variant, first },
    }): Promise<StrapiResponse<UserGuideSection>> => {
      const response = await fetchStrapiCollectionCached<UserGuideSection>({
        collectionName: 'user-guide-sections',
        params: {
          sort: ['createdAt:asc'],
          ...VARIANT_PARAMS[variant ?? 'full'],
          ...(slug && { filters: { slug: { $eq: slug } } }),
          ...(first && { pagination: { pageSize: 1 } }),
        },
        locale,
      })
      return variant === 'card' ? toCardResponse(response) : response
    }
  )
