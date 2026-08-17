import { createServerFn } from '@tanstack/react-start'

import type { UseCaseSection } from 'features/cms/loaders/use-case.types'
import { fetchStrapiCollectionCached } from 'features/cms/loaders/utils'
import type { StrapiResponse } from 'features/cms/strapi.types'
import type { Locale } from 'types'

export const getUseCaseContent = createServerFn({
  method: 'GET',
})
  .validator((params: { locale?: Locale } = {}) => params)
  .handler(({ data: { locale } }): Promise<StrapiResponse<UseCaseSection>> =>
    fetchStrapiCollectionCached<UseCaseSection>({
      collectionName: 'use-case-sections',
      params: {
        sort: ['createdAt:asc'],
        populate: ['subsections', 'thumbnail'],
      },
      locale,
    })
  )
