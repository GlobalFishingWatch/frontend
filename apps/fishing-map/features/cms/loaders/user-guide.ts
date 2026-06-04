import { createServerFn } from '@tanstack/react-start'

import type { UserGuideSection } from 'features/cms/loaders/user-guide.types'
import { findWithLocaleFallback } from 'features/cms/loaders/utils'
import type { StrapiResponse } from 'features/cms/strapi.types'
import type { Locale } from 'types'

import { sdk } from '../strapi-sdk'

const userGuideSections = sdk.collection('user-guide-sections')

export const getUserGuideContent = createServerFn({
  method: 'GET',
})
  .inputValidator((params: { locale?: Locale; page?: number } = {}) => params)
  .handler(
    ({ data: { locale, page } }): Promise<StrapiResponse<UserGuideSection>> =>
      findWithLocaleFallback<UserGuideSection>(
        userGuideSections,
        {
          // pagination: { page: page || 1, pageSize: 50 },
          sort: ['createdAt:asc'],
          populate: ['subsections'],
        },
        locale
      )
  )
