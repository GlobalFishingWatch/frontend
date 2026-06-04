import type { StrapiResponse } from 'features/cms/strapi.types'
import { Locale } from 'types'

import type { sdk } from '../strapi-sdk'

type StrapiCollection = ReturnType<typeof sdk.collection>
type FindParams = Omit<Parameters<StrapiCollection['find']>[0], 'locale'>

export const findWithLocaleFallback = async <T>(
  collection: StrapiCollection,
  params: FindParams,
  locale = Locale.en as Locale
): Promise<StrapiResponse<T>> => {
  try {
    const response = (await collection.find({
      ...params,
      locale,
    })) as StrapiResponse<T>

    if (locale !== Locale.en && (!response?.data || response.data.length === 0)) {
      return collection.find({
        ...params,
        locale: Locale.en,
      }) as Promise<StrapiResponse<T>>
    }

    return response
  } catch (e) {
    console.error('Error fetching CMS content:', e)
    throw e
  }
}
