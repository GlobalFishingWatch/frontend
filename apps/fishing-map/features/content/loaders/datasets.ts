import { createServerFn } from '@tanstack/react-start'

import type {
  TDataset,
  TStrapiResponseCollection,
  TStrapiResponseSingle,
} from 'features/content/strapi.types'

import { sdk } from '../strapi-sdk'

const datasets = sdk.collection('datasets')

const getDatasetIds = async (page?: number) => {
  return datasets.find({
    fields: ['dataset_id'],
    sort: ['createdAt:desc'],
    pagination: {
      page: page || 1,
      pageSize: 50,
    },
    populate: ['cover', 'author', 'category'],
  }) as Promise<TStrapiResponseCollection<TDataset>>
}

export const getAllDatasetIds = createServerFn({
  method: 'GET',
}).handler(async (): Promise<TStrapiResponseCollection<TDataset>> => {
  const response = await getDatasetIds()
  return response
})

export const getDatasetById = createServerFn({
  method: 'GET',
})
  .inputValidator((datasetId: string) => datasetId)
  .handler(async ({ data: datasetId }): Promise<TStrapiResponseCollection<TDataset>> => {
    const response = (await datasets.find({
      filters: {
        dataset_id: { $eq: datasetId },
      },
      locale: 'en',
    })) as TStrapiResponseCollection<TDataset>
    return response
  })
