import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { selectAOIList, fetchAOI } from './areas-of-interest.slice'

export const useAOIConnect = () => {
  const dispatch = useDispatch()
  const aoiList = useSelector(selectAOIList)
  const fetchList = useCallback(() => {
    dispatch(fetchAOI())
  }, [dispatch])
  return { aoiList, fetchList }
}
