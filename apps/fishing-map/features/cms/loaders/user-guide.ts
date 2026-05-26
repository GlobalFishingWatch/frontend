import { createServerFn } from '@tanstack/react-start'

import type { UserGuideSection } from 'features/cms/loaders/user-guide.types'
import type { StrapiResponse } from 'features/cms/strapi.types'
import { Locale } from 'types'

import { sdk } from '../strapi-sdk'

const userGuideSections = sdk.collection('user-guide-sections')

type FindParams = Omit<Parameters<typeof userGuideSections.find>[0], 'locale'>

const findWithLocaleFallback = async (
  params: FindParams,
  locale = Locale.en as Locale
): Promise<StrapiResponse<UserGuideSection>> => {
  try {
    const response = (await userGuideSections.find({
      ...params,
      locale,
    })) as StrapiResponse<UserGuideSection>

    if (locale !== Locale.en && (!response?.data || response.data.length === 0)) {
      return userGuideSections.find({
        ...params,
        locale: Locale.en,
      }) as Promise<StrapiResponse<UserGuideSection>>
    }

    return response
  } catch (e) {
    console.error('Error fetching user guide content:', e)
    throw e
  }
}

export const getUserGuideContent = createServerFn({
  method: 'GET',
})
  .inputValidator((params: { locale?: Locale; page?: number } = {}) => params)
  .handler(
    ({ data: { locale, page } }): Promise<StrapiResponse<UserGuideSection>> =>
      findWithLocaleFallback(
        {
          pagination: { page: page || 1, pageSize: 50 },
          sort: ['createdAt:asc'],
          populate: ['subsections'],
        },
        locale
      )
  )

// export const getUserGuideSection = createServerFn({
//   method: 'GET',
// })
//   .inputValidator((params: { documentId: string; locale?: Locale }) => params)
//   .handler(
//     ({ data: { documentId, locale } }): Promise<StrapiResponse<UserGuideSection>> =>
//       findWithLocaleFallback(
//         {
//           filters: {
//             $or: [
//               { id: { $eq: documentId } },
//               { title: { $contains: documentId } },
//               { documentId: { $eq: documentId } },
//             ],
//           },
//           populate: '*',
//         },
//         locale
//       )
//   )
