import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { Resource } from '@globalfishingwatch/dataviews-client'
import { GraphData } from 'data/data'
import { selectAll, fetchResourceByIdThunk } from './resources.slice'

export const useResourcesAPI = () => {
  const dispatch = useDispatch()

  const fetchResourceById = useCallback(
    async (resourceRequest: { id: string; url: string }): Promise<Resource<GraphData[]>> => {
      const { payload }: any = await dispatch(fetchResourceByIdThunk(resourceRequest))
      return payload
    },
    [dispatch]
  )

  return { fetchResourceById }
}

export const useResourcesConnect = () => {
  const resourcesList = useSelector(selectAll)

  return { resourcesList }
}
