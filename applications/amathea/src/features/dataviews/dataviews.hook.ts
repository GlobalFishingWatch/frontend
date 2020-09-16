import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { Dataview, Resource } from '@globalfishingwatch/dataviews-client/dist/types'
import { selectResourceById } from 'features/resources/resources.slice'
import { useResourcesAPI } from 'features/resources/resources.hook'
import { GraphData } from 'data/data'
import {
  selectAllDataviews,
  fetchDataviewsThunk,
  createDataviewThunk,
  deleteDataviewThunk,
  DataviewDraft,
  setDraftDataview as setDraftDataviewAction,
  resetDraftDataview as resetDraftDataviewAction,
  selectDraftDataview,
  updateDataviewThunk,
  selectDataviewStatus,
  selectDataviewStatusId,
} from './dataviews.slice'

export const useDataviewResource = (dataview: Dataview, type = 'stats') => {
  const id = `dataview-${type}-${dataview?.id}`
  const dataviewResource: Resource<GraphData[]> | undefined = useSelector(selectResourceById(id))
  const { fetchResourceById } = useResourcesAPI()
  const filter = dataview?.datasetsConfig?.datasetId?.query?.find((q) => q.id === 'flag')?.value

  useEffect(() => {
    const dataset = dataview?.datasets?.find((dataset) => dataset.type === '4wings:v1')
    if (!dataset) {
      return
    }
    let url
    const endpoint = dataset?.endpoints?.find((endpoint) => endpoint.id === `4wings-${type}`)
    if (endpoint) {
      const pathTemplate = endpoint.pathTemplate.replace('{{aoiId}}', '1') + '?proxy=true'
      const filterString = filter ? `&filters[0]=flag='${filter}'` : ''
      url = pathTemplate + filterString
    }
    if (url) {
      fetchResourceById({ id, url })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, filter])

  return { dataviewResource }
}

export const useDraftDataviewConnect = () => {
  const dispatch = useDispatch()
  const draftDataview = useSelector(selectDraftDataview)
  const setDraftDataview = useCallback(
    (draftDataview: Partial<DataviewDraft>) => {
      dispatch(setDraftDataviewAction(draftDataview))
    },
    [dispatch]
  )
  const resetDraftDataview = useCallback(() => {
    dispatch(resetDraftDataviewAction(undefined))
  }, [dispatch])
  return { draftDataview, setDraftDataview, resetDraftDataview }
}

export const useDataviewsConnect = () => {
  const dataviewsStatus = useSelector(selectDataviewStatus)
  const dataviewsStatusId = useSelector(selectDataviewStatusId)
  const dataviewsList = useSelector(selectAllDataviews)
  return { dataviewsStatus, dataviewsStatusId, dataviewsList }
}

export const useDataviewsAPI = () => {
  const dispatch = useDispatch()

  const fetchDataviews = useCallback(() => {
    dispatch(fetchDataviewsThunk())
  }, [dispatch])

  const createDataview = useCallback(
    async (dataview: DataviewDraft): Promise<Dataview> => {
      const { payload }: any = await dispatch(createDataviewThunk(dataview))
      return payload
    },
    [dispatch]
  )
  const updateDataview = useCallback(
    async (dataview: DataviewDraft): Promise<Dataview> => {
      const { payload }: any = await dispatch(updateDataviewThunk(dataview))
      return payload
    },
    [dispatch]
  )

  const upsertDataview = useCallback(
    async (partialDataview: DataviewDraft): Promise<Dataview> => {
      if (partialDataview.id) {
        return updateDataview(partialDataview)
      } else {
        return createDataview(partialDataview)
      }
    },
    [createDataview, updateDataview]
  )

  const deleteDataview = useCallback(
    (id: number) => {
      dispatch(deleteDataviewThunk(id))
    },
    [dispatch]
  )
  return { fetchDataviews, createDataview, updateDataview, upsertDataview, deleteDataview }
}
