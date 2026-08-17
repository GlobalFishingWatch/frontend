import { createServerFn } from '@tanstack/react-start'

import type { UseCaseSection } from 'features/cms/loaders/use-case.types'
import { findWithLocaleFallback } from 'features/cms/loaders/utils'
import type { StrapiResponse } from 'features/cms/strapi.types'
import type { Locale } from 'types'

export const getUseCaseContent = createServerFn({
  method: 'GET',
})
  .validator((params: { locale?: Locale } = {}) => params)
  .handler(({ data: { locale } }): Promise<StrapiResponse<UseCaseSection>> =>
    findWithLocaleFallback<UseCaseSection>(
      'use-case-sections',
      {
        sort: ['createdAt:asc'],
        populate: ['subsections', 'thumbnail'],
      },
      locale
    )
  )
