import { createServerFn } from '@tanstack/react-start'

import type {
  ContentPanelSection,
  TStrapiResponseCollection,
  TStrapiResponseSingle,
} from 'features/content/strapi.types'

import { sdk } from '../strapi-sdk'

const userGuideSections = sdk.collection('user-guide-sections')

const getUserGuideSections = async (page?: number) => {
  return userGuideSections.find({
    pagination: {
      page: page || 1,
      pageSize: 50,
    },
    populate: ['*'],
  }) as Promise<TStrapiResponseCollection<ContentPanelSection>>
}

export const getAllUserGuideSections = createServerFn({
  method: 'GET',
}).handler(async (): Promise<TStrapiResponseCollection<ContentPanelSection>> => {
  const response = await getUserGuideSections()
  return response
})

export const getUserGuideSectionById = createServerFn({
  method: 'GET',
})
  .inputValidator((documentId: string) => documentId)
  .handler(async ({ data: documentId }): Promise<TStrapiResponseSingle<ContentPanelSection>> => {
    const response = (await userGuideSections.findOne(documentId, {
      locale: 'en',
    })) as TStrapiResponseSingle<ContentPanelSection>
    return response
  })
