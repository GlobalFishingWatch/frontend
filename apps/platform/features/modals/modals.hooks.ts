import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { useAppDispatch } from 'features/app/app.hooks'
import type { DatasetUploadConfig } from 'features/modals/modals.slice'
import {
  selectDatasetUploadModalConfig,
  selectDatasetUploadModalOpen,
  setDatasetUploadConfig,
  setModalOpen,
} from 'features/modals/modals.slice'

export const useDatasetModalOpenConnect = () => {
  const dispatch = useAppDispatch()
  const datasetModalOpen = useSelector(selectDatasetUploadModalOpen)

  const dispatchDatasetModalOpen = useCallback(
    (open: boolean) => {
      dispatch(setModalOpen({ id: 'datasetUpload', open }))
    },
    [dispatch]
  )

  return useMemo(
    () => ({
      datasetModalOpen,
      dispatchDatasetModalOpen,
    }),
    [datasetModalOpen, dispatchDatasetModalOpen]
  )
}

export const useDatasetModalConfigConnect = () => {
  const dispatch = useAppDispatch()
  const datasetModal = useSelector(selectDatasetUploadModalConfig)

  const dispatchDatasetModalConfig = useCallback(
    (config: DatasetUploadConfig) => {
      dispatch(setDatasetUploadConfig(config))
    },
    [dispatch]
  )

  return useMemo(
    () => ({
      ...datasetModal,
      dispatchDatasetModalConfig,
    }),
    [datasetModal, dispatchDatasetModalConfig]
  )
}
