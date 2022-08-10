import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_URL } from 'data/config'
import { DATASET_QUERY_ID } from 'features/datasets/datasets.hooks'
import { APIDataset, DatasetType } from 'features/datasets/datasets.types'

export type UploadFileParams = { file: File; type: DatasetType }

export type UploadFileResponse = {
  filename: string
}

export function useUploadFile() {
  const mutation = useMutation(({ file, type }: UploadFileParams) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    return fetch(`${API_URL}/files`, { method: 'POST', body: formData }).then((r) =>
      r.json()
    ) as Promise<UploadFileResponse>
  })
  return mutation
}

export function useCreateDataset() {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    (dataset: Partial<APIDataset>) => {
      const body = JSON.stringify(dataset)
      return fetch(`${API_URL}/datasets`, { method: 'POST', body }).then((r) =>
        r.json()
      ) as Promise<APIDataset>
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([DATASET_QUERY_ID])
      },
    }
  )
  return mutation
}
