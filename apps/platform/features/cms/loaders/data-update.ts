import { createServerFn } from '@tanstack/react-start'

import type { DataUpdate } from 'features/cms/loaders/data-update.types'
import { fetchStrapiCollectionCached } from 'features/cms/loaders/utils'
import type { StrapiResponse } from 'features/cms/strapi.types'
import type { Locale } from 'types'

// No subsections on this collection, so the index is just the fields the menu prints.
const INDEX_PARAMS = { fields: ['title', 'slug', 'publication_date'] }

export const getDataUpdateContent = createServerFn({
  method: 'GET',
})
  .validator((params: { locale?: Locale; slug?: string; index?: boolean } = {}) => params)
  .handler(({ data: { locale, slug, index } }): Promise<StrapiResponse<DataUpdate>> =>
    fetchStrapiCollectionCached<DataUpdate>({
      collectionName: 'data-updates',
      params: {
        sort: ['publication_date:desc'],
        ...(index ? INDEX_PARAMS : { populate: '*' }),
        ...(slug && { filters: { slug: { $eq: slug } } }),
      },
      locale,
    })
  )
