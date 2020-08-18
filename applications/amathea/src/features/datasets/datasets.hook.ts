// import { bindActionCreators } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { Dataset } from '@globalfishingwatch/dataviews-client'
import {
  fetchDatasetsThunk,
  deleteDatasetThunk,
  resetDraftDataset,
  setDraftDatasetStep,
  setDraftDatasetData,
  selectAllDatasets,
  selectDraftDatasetData,
  selectDraftDatasetStep,
  DatasetDraftSteps,
  DatasetDraftData,
  selectDatasetStatus,
  createDatasetThunk,
  CreateDataset,
  selectDatasetStatusId,
  updateDatasetThunk,
} from './datasets.slice'
import { selectShared } from './datasets.selectors'

export const useDraftDatasetConnect = () => {
  const dispatch = useDispatch()
  const draftDatasetStep = useSelector(selectDraftDatasetStep)
  const draftDataset = useSelector(selectDraftDatasetData)

  const dispatchResetDraftDataset = useCallback(() => {
    dispatch(resetDraftDataset(''))
  }, [dispatch])

  const dispatchDraftDatasetStep = useCallback(
    (step: DatasetDraftSteps) => {
      dispatch(setDraftDatasetStep(step))
    },
    [dispatch]
  )
  const dispatchDraftDatasetData = useCallback(
    (dataset: DatasetDraftData) => {
      dispatch(setDraftDatasetData(dataset))
    },
    [dispatch]
  )

  // const actions = bindActionCreators(
  //   { resetDraftDataset, setDraftDatasetStep, setDraftDatasetData },
  //   dispatch
  // )

  return {
    draftDataset,
    draftDatasetStep,
    dispatchResetDraftDataset,
    dispatchDraftDatasetStep,
    dispatchDraftDatasetData,
  }
}

export const useDatasetsConnect = () => {
  const datasetStatus = useSelector(selectDatasetStatus)
  const datasetStatusId = useSelector(selectDatasetStatusId)
  const datasetsList = useSelector(selectAllDatasets)
  const datasetsSharedList = useSelector(selectShared)
  return { datasetStatus, datasetStatusId, datasetsList, datasetsSharedList }
}

export const useDatasetsAPI = () => {
  const dispatch = useDispatch()

  const fetchDatasets = useCallback(() => {
    dispatch(fetchDatasetsThunk())
  }, [dispatch])

  const createDataset = useCallback(
    async (createDataset: CreateDataset): Promise<Dataset> => {
      const { payload }: any = await dispatch(createDatasetThunk(createDataset))
      return payload
    },
    [dispatch]
  )

  const updateDataset = useCallback(
    async (createDataset: Partial<Dataset>): Promise<Dataset> => {
      debugger
      const { payload }: any = await dispatch(updateDatasetThunk(createDataset))
      debugger
      return payload
    },
    [dispatch]
  )

  const deleteDataset = useCallback(
    (id: string) => {
      dispatch(deleteDatasetThunk(id))
    },
    [dispatch]
  )

  return { fetchDatasets, createDataset, updateDataset, deleteDataset }
}
