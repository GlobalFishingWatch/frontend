import { createServerFn } from '@tanstack/react-start'

import type { DataUpdate } from 'features/cms/loaders/data-update.types'
import { findWithLocaleFallback } from 'features/cms/loaders/utils'
import type { StrapiResponse } from 'features/cms/strapi.types'
import type { Locale } from 'types'

export const getDataUpdateContent = createServerFn({
  method: 'GET',
})
  .validator((params: { locale?: Locale } = {}) => params)
  .handler(({ data: { locale } }): Promise<StrapiResponse<DataUpdate>> =>
    findWithLocaleFallback<DataUpdate>(
      'data-updates',
      {
        sort: ['publication_date:desc'],
        populate: ['thumbnail'],
      },
      locale
    )
  )
