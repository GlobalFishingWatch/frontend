import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { selectAll, fetchAOIThunk } from './areas-of-interest.slice'

export const useAOIConnect = () => {
  const dispatch = useDispatch()
  const aoiList = useSelector(selectAll)
  const fetchAOI = useCallback(() => {
    dispatch(fetchAOIThunk())
  }, [dispatch])
  return { aoiList, fetchAOI }
}
