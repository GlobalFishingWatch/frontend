import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { fetchDataviewsThunk, selectAll } from './dataviews.slice'

export const useDataviewsConnect = () => {
  const dispatch = useDispatch()
  const dataviewsList = useSelector(selectAll)
  const fetchDataviews = useCallback(() => {
    dispatch(fetchDataviewsThunk())
  }, [dispatch])
  return { dataviewsList, fetchDataviews }
}
