import { createServerFn } from '@tanstack/react-start'

import type { DataUpdate } from 'features/cms/loaders/data-update.types'
import { fetchStrapiCollectionCached } from 'features/cms/loaders/utils'
import type { StrapiResponse } from 'features/cms/strapi.types'
import { toCardResponse } from 'features/help/helpHub.utils'
import type { Locale } from 'types'

// No subsections on this collection, so the index is just the fields the menu prints.
const VARIANT_PARAMS = {
  index: { fields: ['title', 'slug', 'publication_date'] },
  card: { fields: ['title', 'slug', 'publication_date', 'body'], populate: '*' },
  full: { populate: '*' },
}

export const getDataUpdateContent = createServerFn({
  method: 'GET',
})
  .validator(
    (
      params: { locale?: Locale; slug?: string; variant?: 'index' | 'card'; first?: boolean } = {}
    ) => params
  )
  .handler(
    async ({ data: { locale, slug, variant, first } }): Promise<StrapiResponse<DataUpdate>> => {
      const response = await fetchStrapiCollectionCached<DataUpdate>({
        collectionName: 'data-updates',
        params: {
          sort: ['publication_date:desc'],
          ...VARIANT_PARAMS[variant ?? 'full'],
          ...(slug && { filters: { slug: { $eq: slug } } }),
          ...(first && { pagination: { pageSize: 1 } }),
        },
        locale,
      })
      return variant === 'card' ? toCardResponse(response) : response
    }
  )
