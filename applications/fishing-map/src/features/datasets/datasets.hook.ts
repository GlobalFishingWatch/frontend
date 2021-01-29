// import { bindActionCreators } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { Dataset } from '@globalfishingwatch/api-types/dist'
import {
  CreateDataset,
  createDatasetThunk,
  deleteDatasetThunk,
  selectNewDatasetModal,
  setNewDatasetModal,
} from './datasets.slice'

export const useNewDatasetModalConnect = () => {
  const dispatch = useDispatch()
  const newDatasetModal = useSelector(selectNewDatasetModal)

  const dispatchNewDatasetModal = useCallback(
    (modalOpen: boolean) => {
      dispatch(setNewDatasetModal(modalOpen))
    },
    [dispatch]
  )

  return {
    newDatasetModal,
    dispatchNewDatasetModal,
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

  const dispatchDeleteDataset = useCallback(
    (id: string) => {
      dispatch(deleteDatasetThunk(id))
    },
    [dispatch]
  )

  return { dispatchCreateDataset, dispatchDeleteDataset }
}
