import { createServerFn } from '@tanstack/react-start'

import type { TStrapiResponse, TUserGuideSection } from 'features/content/strapi.types'

import { sdk } from '../strapi-sdk'

const userGuideSections = sdk.collection('user-guide-sections')

const getUserGuideSections = async (page?: number) => {
  return userGuideSections.find({
    pagination: {
      page: page || 1,
      pageSize: 50,
    },
    populate: '*',
  }) as Promise<TStrapiResponse<TUserGuideSection>>
}

export const getAll = createServerFn({
  method: 'GET',
}).handler(async (): Promise<TStrapiResponse<TUserGuideSection>> => {
  const response = await getUserGuideSections()
  return response
})

export const getById = createServerFn({
  method: 'GET',
})
  .inputValidator((documentId: string) => documentId)
  .handler(async ({ data: documentId }): Promise<TStrapiResponse<TUserGuideSection>> => {
    const response = (await userGuideSections.find({
      filters: {
        $or: [
          {
            title: { $contains: documentId },
          },
          {
            documentId: { $eq: documentId },
          },
        ],
      },
      populate: '*',
      locale: 'en',
    })) as TStrapiResponse<TUserGuideSection>

    return response
  })
