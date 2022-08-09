import { useMutation } from '@tanstack/react-query'
import { DatasetType } from 'features/datasets/datasets.hooks'

export type UploadFileParams = { file: File; type: DatasetType }

export type UploadFileResponse = {
  id: string
}

export function useUploadFile() {
  const mutation = useMutation(({ file, type }: UploadFileParams) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    return fetch('/api', { method: 'POST', body: formData })
  })
  return mutation
}
