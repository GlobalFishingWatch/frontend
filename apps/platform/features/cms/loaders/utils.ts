import type { StrapiResponse } from 'features/cms/strapi.types'
import { toContentLocale } from 'features/i18n/i18n.config'
import { Locale } from 'types'

import type { sdk } from '../strapi-sdk'

type StrapiCollection = ReturnType<typeof sdk.collection>
type FindParams = Omit<Parameters<StrapiCollection['find']>[0], 'locale'>

export const findWithLocaleFallback = async <T>(
  collection: StrapiCollection,
  params: FindParams,
  locale = Locale.en as string
): Promise<StrapiResponse<T>> => {
  const cmsLocale = toContentLocale(locale)
  try {
    const response = (await collection.find({
      ...params,
      locale: cmsLocale,
    })) as StrapiResponse<T>

    if (cmsLocale !== Locale.en && (!response?.data || response.data.length === 0)) {
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
