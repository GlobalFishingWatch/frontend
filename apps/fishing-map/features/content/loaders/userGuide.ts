import { createServerFn } from '@tanstack/react-start'

import type { TStrapiResponse, TUserGuideSection } from 'features/content/strapi.types'

import { sdk } from '../strapi-sdk'

const userGuideSections = sdk.collection('user-guide-sections')

const getUserGuideSections = async (locale?: string, page?: number) => {
  return userGuideSections.find({
    pagination: {
      page: page || 1,
      pageSize: 50,
    },
    sort: ['createdAt:asc'],
    populate: '*',
    locale: locale || 'en',
  }) as Promise<TStrapiResponse<TUserGuideSection>>
}

export const getAll = createServerFn({
  method: 'GET',
})
  .inputValidator((params: { locale?: string } = {}) => params)
  .handler(async ({ data: { locale } }): Promise<TStrapiResponse<TUserGuideSection>> => {
    const response = await getUserGuideSections(locale)
    return response
  })

export const getById = createServerFn({
  method: 'GET',
})
  .inputValidator((params: { documentId: string; locale?: string }) => params)
  .handler(
    async ({ data: { documentId, locale } }): Promise<TStrapiResponse<TUserGuideSection>> => {
      const response = (await userGuideSections.find({
        filters: {
          $or: [
            {
              id: { $eq: documentId },
            },
            {
              title: { $contains: documentId },
            },
            {
              documentId: { $eq: documentId },
            },
          ],
        },
        populate: '*',
        locale: locale || 'en',
      })) as TStrapiResponse<TUserGuideSection>

      return response
    }
  )
