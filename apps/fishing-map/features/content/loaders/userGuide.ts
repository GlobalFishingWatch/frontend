import { createServerFn } from '@tanstack/react-start'

import type { TStrapiResponse, TUserGuideSection } from 'features/content/strapi.types'

import { sdk } from '../strapi-sdk'

const userGuideSections = sdk.collection('user-guide-sections')

const DEFAULT_LOCALE = 'en'

type FindParams = Omit<Parameters<typeof userGuideSections.find>[0], 'locale'>

const findWithLocaleFallback = async (
  params: FindParams,
  locale?: string
): Promise<TStrapiResponse<TUserGuideSection>> => {
  const requestedLocale = locale || DEFAULT_LOCALE
  const response = (await userGuideSections.find({
    ...params,
    locale: requestedLocale,
  })) as TStrapiResponse<TUserGuideSection>

  if (requestedLocale !== DEFAULT_LOCALE && (!response?.data || response.data.length === 0)) {
    return userGuideSections.find({
      ...params,
      locale: DEFAULT_LOCALE,
    }) as Promise<TStrapiResponse<TUserGuideSection>>
  }

  return response
}

export const getAll = createServerFn({
  method: 'GET',
})
  .inputValidator((params: { locale?: string; page?: number } = {}) => params)
  .handler(
    ({ data: { locale, page } }): Promise<TStrapiResponse<TUserGuideSection>> =>
      findWithLocaleFallback(
        {
          pagination: { page: page || 1, pageSize: 50 },
          sort: ['createdAt:asc'],
          populate: '*',
        },
        locale
      )
  )

export const getById = createServerFn({
  method: 'GET',
})
  .inputValidator((params: { documentId: string; locale?: string }) => params)
  .handler(
    ({ data: { documentId, locale } }): Promise<TStrapiResponse<TUserGuideSection>> =>
      findWithLocaleFallback(
        {
          filters: {
            $or: [
              { id: { $eq: documentId } },
              { title: { $contains: documentId } },
              { documentId: { $eq: documentId } },
            ],
          },
          populate: '*',
        },
        locale
      )
  )
