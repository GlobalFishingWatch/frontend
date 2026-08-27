import { createServerFn } from '@tanstack/react-start'

import type { DataTerminology } from 'features/cms/loaders/data-terminology.types'
import { fetchStrapiCollectionCached } from 'features/cms/loaders/utils'
import type { StrapiResponse } from 'features/cms/strapi.types'
import type { Locale } from 'types'

export const getDataTerminologyContent = createServerFn({
  method: 'GET',
})
  .validator((params: { id: string; locale?: Locale; page?: number }) => params)
  .handler(({ data: { id, locale } }): Promise<StrapiResponse<DataTerminology>> => {
    return fetchStrapiCollectionCached<DataTerminology>({
      collectionName: 'data-terminologies',
      params: {
        filters: { slug: { $eqi: id } },
        sort: ['createdAt:asc'],
      },
      locale,
    })
  })
