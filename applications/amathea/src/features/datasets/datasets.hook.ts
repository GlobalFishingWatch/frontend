import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { fetchDatasetsThunk, selectAll, selectShared } from './datasets.slice'

export const useDatasetsConnect = () => {
  const dispatch = useDispatch()
  const datasetsList = useSelector(selectAll)
  const datasetsSharedList = useSelector(selectShared)
  const fetchDatasets = useCallback(() => {
    dispatch(fetchDatasetsThunk())
  }, [dispatch])
  return { datasetsList, datasetsSharedList, fetchDatasets }
}
