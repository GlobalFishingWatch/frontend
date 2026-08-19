import { createServerFn } from '@tanstack/react-start'

import type { UseCaseSection } from 'features/cms/loaders/use-case.types'
import { fetchStrapiCollectionCached } from 'features/cms/loaders/utils'
import type { StrapiResponse } from 'features/cms/strapi.types'
import { toCardResponse } from 'features/help/helpHub.utils'
import type { Locale } from 'types'

// Use cases title from `role`, not `title`.
const VARIANT_PARAMS = {
  index: {
    fields: ['role', 'slug'],
    populate: { subsections: { fields: ['title', 'slug'] } },
  },
  card: { fields: ['role', 'slug', 'body'], populate: '*' },
  full: { populate: '*' },
}

export const getUseCaseContent = createServerFn({
  method: 'GET',
})
  .validator(
    (
      params: { locale?: Locale; slug?: string; variant?: 'index' | 'card'; first?: boolean } = {}
    ) => params
  )
  .handler(
    async ({ data: { locale, slug, variant, first } }): Promise<StrapiResponse<UseCaseSection>> => {
      const response = await fetchStrapiCollectionCached<UseCaseSection>({
        collectionName: 'use-case-sections',
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
