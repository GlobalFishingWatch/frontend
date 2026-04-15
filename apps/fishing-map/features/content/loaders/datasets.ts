import { createServerFn } from '@tanstack/react-start'

import type { TDataset, TStrapiResponse } from 'features/content/strapi.types'

import { sdk } from '../strapi-sdk'

const datasets = sdk.collection('datasets')

const getDatasetIds = async (locale?: string, page?: number) => {
  return datasets.find({
    fields: ['dataset_id'],
    sort: ['createdAt:desc'],
    pagination: {
      page: page || 1,
      pageSize: 50,
    },
    populate: '*',
    locale: locale || 'en',
  }) as Promise<TStrapiResponse<TDataset>>
}

export const getAll = createServerFn({
  method: 'GET',
})
  .inputValidator((params: { locale?: string } = {}) => params)
  .handler(async ({ data: { locale } }): Promise<TStrapiResponse<TDataset>> => {
    const response = await getDatasetIds(locale)
    return response
  })

export const getById = createServerFn({
  method: 'GET',
})
  .inputValidator((params: { datasetId: string; locale?: string }) => params)
  .handler(async ({ data: { locale, datasetId } }): Promise<TStrapiResponse<TDataset>> => {
    const response = (await datasets.find({
      filters: {
        dataset_id: { $eq: datasetId },
      },
      locale: locale || 'en',
    })) as TStrapiResponse<TDataset>
    return response
  })
