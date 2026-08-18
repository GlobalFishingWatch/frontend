import { getRequestUrl } from '@tanstack/react-start/server'
import { defineCachedFunction } from 'nitro/cache'

import { IS_DEVELOPMENT_ENV } from 'data/map/config'
import { resolveCmsRequestMode } from 'features/cms/loaders/preview'
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

export type FetchStrapiCollectionParams = {
  collectionName: StrapiCollectionName
  params: FindParams
  locale?: string
}

const fetchStrapiCollection = async <T>({
  collectionName,
  params,
  locale = Locale.en as string,
}: FetchStrapiCollectionParams): Promise<StrapiResponse<T>> => {
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

const fetchStrapiCollectionFromCache = defineCachedFunction(fetchStrapiCollection, {
  name: 'strapi-content',
  maxAge: CMS_MAX_CACHE_AGE_MINUTES * 60,
  swr: true,
  getKey: ({ collectionName, params, locale }: FetchStrapiCollectionParams) => {
    return `${collectionName}:${locale ?? Locale.en}:${JSON.stringify(params)}`
  },
}) as <T>(args: FetchStrapiCollectionParams) => Promise<StrapiResponse<T>>

const getCmsRequestMode = (): ReturnType<typeof resolveCmsRequestMode> => {
  try {
    return resolveCmsRequestMode(
      getRequestUrl().searchParams,
      process.env.STRAPI_PREVIEW_SECRET,
      IS_DEVELOPMENT_ENV
    )
  } catch {
    return { useCache: true }
  }
}

export const fetchStrapiCollectionCached = <T>(
  args: FetchStrapiCollectionParams
): Promise<StrapiResponse<T>> => {
  const { useCache, status } = getCmsRequestMode()
  if (useCache) {
    return fetchStrapiCollectionFromCache<T>(args)
  }
  return fetchStrapiCollection<T>(status ? { ...args, params: { ...args.params, status } } : args)
}
