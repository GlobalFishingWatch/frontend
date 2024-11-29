import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { API_URL } from 'data/config'
import type { DatasetType, ImportStatus } from 'features/datasets/datasets.types'

export type UploadFileParams = { file: File; type: DatasetType }

export type UploadFileResponse = {
  filename: string
}

export function useUploadFile() {
  const mutation = useMutation(async ({ file, type }: UploadFileParams) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    const response = await fetch(`${API_URL}/files`, {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) {
      throw new Error('Error uploading file')
    }
    return response.json() as Promise<UploadFileResponse>
  })
  return mutation
}

export type UploadFileStatusResponse = {
  fileId: string
  status: ImportStatus
}

const isFileReady = (status: ImportStatus) => {
  return status === 'COMPLETED'
}
export function useUploadFileStatus(fileId: string) {
  const [intervalMs, setIntervalMs] = useState(5000)
  const enabled = fileId && intervalMs > 0
  const query = useQuery(
    ['uploadFileStatus'],
    async () => {
      const response = await fetch(`${API_URL}/files/${fileId}/status`)
      if (!response.ok) {
        throw new Error('Error fetching file status')
      }
      const uploadFileStatus: UploadFileStatusResponse = await response.json()
      if (isFileReady(uploadFileStatus?.status)) {
        setIntervalMs(0)
      }
      return uploadFileStatus
    },
    {
      refetchInterval: intervalMs,
      enabled: !!enabled,
    }
  )
  return query
}

export type FielType =
  | 'BIGINT'
  | 'BOOLEAN'
  | 'BLOB'
  | 'DATE'
  | 'DOUBLE'
  | 'DECIMAL'
  | 'HUGEINT'
  | 'INTEGER'
  | 'INTERVAL'
  | 'REAL'
  | 'SMALLINT'
  | 'TIME'
  | 'TIMESTAMP'
  | 'TIMESTAMP'
  | 'TINYINT'
  | 'UBIGINT'
  | 'UINTEGER'
  | 'USMALLINT'
  | 'UTINYINT'
  | 'UUID'
  | 'VARCHAR'

export type FileField = {
  name: string
  type: FielType
}
export type FileFieldsResponse = FileField[]

export const FETCH_FIELDS_QUERY = 'fetchFileFields'
export function useFetchFileFields(fileId: string) {
  const uploadFileStatus = useUploadFileStatus(fileId)
  const enabled = isFileReady(uploadFileStatus.data?.status) && !!fileId
  const query = useQuery(
    [FETCH_FIELDS_QUERY],
    async () => {
      const response = await fetch(`${API_URL}/files/${fileId}/fields`)
      if (!response.ok) {
        throw new Error('Error fetching file fields')
      }
      return response.json() as Promise<FileFieldsResponse>
    },
    {
      enabled: enabled,
    }
  )
  return {
    ...(enabled ? query : uploadFileStatus),
    data: query.data,
  }
}
