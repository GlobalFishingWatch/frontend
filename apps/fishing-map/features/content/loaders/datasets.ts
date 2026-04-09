import { createServerFn } from '@tanstack/react-start'

import type {
  ParsedDataset,
  TDataset,
  TStrapiResponseCollection,
} from 'features/content/strapi.types'

import { sdk } from '../strapi-sdk'

const datasets = sdk.collection('datasets')

const getDatasetIds = async (page?: number, category?: string, query?: string) => {
  return datasets.find({
    fields: ['dataset_id'],
    sort: ['createdAt:desc'],
    pagination: {
      page: page || 1,
      pageSize: PAGE_SIZE,
    },
    populate: ['cover', 'author', 'category'],
  }) as Promise<TStrapiResponseCollection<TDataset>>
}

export const getAllDatasetIds = createServerFn({
  method: 'GET',
}).handler(async (): Promise<TStrapiResponseCollection<TDataset>> => {
  const response = await getDatasetIds()
  console.log('🚀 ~ response:', response)
  return response
})

export const createNewDatasets = createServerFn({
  method: 'POST',
})
  .inputValidator((data: ParsedDataset[]) => data)
  .handler(async ({ data }) => {
    for (const dataset of data) {
      await datasets.create({
        data: dataset,
      })
    }
  })
