import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_URL } from 'data/config'
import { DATASET_QUERY_ID } from 'features/datasets/datasets.hooks'
import type { APIDataset, APIDatasetUpdate } from 'features/datasets/datasets.types'

export function useCreateDataset() {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    async (dataset: APIDatasetUpdate) => {
      const body = JSON.stringify(dataset)
      const response = await fetch(`${API_URL}/datasets`, { method: 'POST', body })
      if (!response.ok) {
        throw new Error('Error fetching file status')
      }
      return response.json() as Promise<APIDataset>
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData([DATASET_QUERY_ID, { id: data.id }], data)
      },
    }
  )
  return mutation
}
