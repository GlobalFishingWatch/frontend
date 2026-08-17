import { createServerFn } from '@tanstack/react-start'

import type { UserGuideSection } from 'features/cms/loaders/user-guide.types'
import { findWithLocaleFallback } from 'features/cms/loaders/utils'
import type { StrapiResponse } from 'features/cms/strapi.types'
import type { Locale } from 'types'

export const getUserGuideContent = createServerFn({
  method: 'GET',
})
  .validator((params: { locale?: Locale; page?: number } = {}) => params)
  .handler(({ data: { locale } }): Promise<StrapiResponse<UserGuideSection>> =>
    findWithLocaleFallback<UserGuideSection>(
      'user-guide-sections',
      {
        // pagination: { page: page || 1, pageSize: 50 },
        sort: ['createdAt:asc'],
        populate: ['subsections', 'thumbnail'],
      },
      locale
    )
  )
