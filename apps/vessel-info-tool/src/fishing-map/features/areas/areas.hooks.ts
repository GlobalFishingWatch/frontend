import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useAppDispatch } from 'features/app/app.hooks'
import type { DatasetAreaList } from 'features/areas/areas.slice'
import { fetchDatasetAreasThunk, selectDatasetAreasById } from 'features/areas/areas.slice'

export function useFetchContextDatasetAreas(datasetId?: string): DatasetAreaList {
  const dispatch = useAppDispatch()
  const datasetAreas = useSelector(selectDatasetAreasById(datasetId || ''))

  useEffect(() => {
    if (datasetId) {
      dispatch(fetchDatasetAreasThunk({ datasetId, areaType: 'context' }))
    }
  }, [datasetId, dispatch])

  return datasetAreas
}
