import { createServerFn } from '@tanstack/react-start'

import type { UseCaseSection } from 'features/cms/loaders/use-case.types'
import { fetchStrapiCollectionCached } from 'features/cms/loaders/utils'
import type { StrapiResponse } from 'features/cms/strapi.types'
import type { Locale } from 'types'

// Use cases title from `role`, not `title`.
const INDEX_PARAMS = {
  fields: ['role', 'slug'],
  populate: { subsections: { fields: ['title', 'slug'] } },
}

export const getUseCaseContent = createServerFn({
  method: 'GET',
})
  .validator((params: { locale?: Locale; slug?: string; index?: boolean } = {}) => params)
  .handler(({ data: { locale, slug, index } }): Promise<StrapiResponse<UseCaseSection>> =>
    fetchStrapiCollectionCached<UseCaseSection>({
      collectionName: 'use-case-sections',
      params: {
        sort: ['createdAt:asc'],
        ...(index ? INDEX_PARAMS : { populate: '*' }),
        ...(slug && { filters: { slug: { $eq: slug } } }),
      },
      locale,
    })
  )
