import { defineCachedFunction } from 'nitro/cache'

import type { StrapiResponse } from 'features/cms/strapi.types'
import { CMS_MAX_CACHE_AGE_MINUTES } from 'features/help/helpHub.config'
import { toContentLocale } from 'features/i18n/i18n.config'
import { Locale } from 'types'

import { sdk } from '../strapi-sdk'

type StrapiCollection = ReturnType<typeof sdk.collection>
type FindParams = Omit<Parameters<StrapiCollection['find']>[0], 'locale'>

export type StrapiCollectionName =
  | 'data-terminologies'
  | 'data-updates'
  | 'datasets'
  | 'use-case-sections'
  | 'use-case-subsections'
  | 'user-guide-sections'
  | 'user-guide-subsections'

const findWithLocaleFallbackUncached = async <T>(
  collectionName: StrapiCollectionName,
  params: FindParams,
  locale = Locale.en as string
): Promise<StrapiResponse<T>> => {
  const collection = sdk.collection(collectionName)
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
    const message = e instanceof Error ? e.message : String(e)
    console.error('Error fetching CMS content:', message)
    throw e
  }
}

export const findWithLocaleFallback = defineCachedFunction(findWithLocaleFallbackUncached, {
  name: 'strapi-content',
  maxAge: CMS_MAX_CACHE_AGE_MINUTES * 60,
  swr: true,
  getKey: (collectionName: StrapiCollectionName, params: FindParams, locale?: string) =>
    `${collectionName}:${locale ?? Locale.en}:${JSON.stringify(params)}`,
}) as <T>(
  collectionName: StrapiCollectionName,
  params: FindParams,
  locale?: string
) => Promise<StrapiResponse<T>>
