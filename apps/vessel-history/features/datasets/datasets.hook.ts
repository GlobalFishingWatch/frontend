import { useCallback } from 'react'

import type { Dataset } from '@globalfishingwatch/api-types'

import { useAppDispatch } from 'features/app/app.hooks'
import type { AsyncError } from 'utils/async-slice'

import { fetchDatasetByIdThunk } from './datasets.slice'

export const useDatasetsAPI = () => {
  const dispatch = useAppDispatch()

  const dispatchFetchDataset = useCallback(
    async (id: string): Promise<{ payload?: Dataset; error?: AsyncError }> => {
      const action = await dispatch(fetchDatasetByIdThunk(id))
      if (fetchDatasetByIdThunk.fulfilled.match(action)) {
        return { payload: action.payload }
      } else {
        return { error: action.payload as AsyncError }
      }
    },
    [dispatch]
  )

  return {
    dispatchFetchDataset,
  }
}
