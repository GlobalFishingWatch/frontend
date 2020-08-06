// import { bindActionCreators } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import {
  fetchDatasetsThunk,
  resetDraftDataset,
  setDraftDatasetStep,
  setDraftDatasetData,
  selectAll,
  selectDraftDatasetData,
  selectDraftDatasetStep,
  DatasetDraftSteps,
  DatasetDraftData,
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
  const dispatch = useDispatch()
  const datasetsList = useSelector(selectAll)
  const datasetsSharedList = useSelector(selectShared)
  const fetchDatasets = useCallback(() => {
    dispatch(fetchDatasetsThunk())
  }, [dispatch])
  return { datasetsList, datasetsSharedList, fetchDatasets }
}
