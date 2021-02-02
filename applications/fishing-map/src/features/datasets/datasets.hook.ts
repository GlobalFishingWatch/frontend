// import { bindActionCreators } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { Dataset } from '@globalfishingwatch/api-types/dist'
import {
  CreateDataset,
  createDatasetThunk,
  DatasetModals,
  deleteDatasetThunk,
  selectDatasetModal,
  selectEditingDatasetId,
  setDatasetModal,
  setEditingDatasetId,
  updateDatasetThunk,
} from './datasets.slice'

export const useDatasetModalConnect = () => {
  const dispatch = useDispatch()
  const datasetModal = useSelector(selectDatasetModal)
  const editingDatasetId = useSelector(selectEditingDatasetId)

  const dispatchDatasetModal = useCallback(
    (datasetModal: DatasetModals) => {
      dispatch(setDatasetModal(datasetModal))
    },
    [dispatch]
  )
  const dispatchEditingDatasetId = useCallback(
    (id: string) => {
      dispatch(setEditingDatasetId(id))
    },
    [dispatch]
  )

  return {
    datasetModal,
    dispatchDatasetModal,
    editingDatasetId,
    dispatchEditingDatasetId,
  }
}

export const useDatasetsAPI = () => {
  const dispatch = useDispatch()

  const dispatchCreateDataset = useCallback(
    async (createDataset: CreateDataset): Promise<Dataset> => {
      const { payload }: any = await dispatch(createDatasetThunk(createDataset))
      return payload
    },
    [dispatch]
  )

  const dispatchUpdateDataset = useCallback(
    async (updatedDataset: Partial<Dataset>): Promise<Dataset> => {
      const { payload }: any = await dispatch(updateDatasetThunk(updatedDataset))
      return payload
    },
    [dispatch]
  )

  const dispatchDeleteDataset = useCallback(
    (id: string) => {
      dispatch(deleteDatasetThunk(id))
    },
    [dispatch]
  )

  return { dispatchCreateDataset, dispatchUpdateDataset, dispatchDeleteDataset }
}
