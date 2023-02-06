import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectDataviewsResources } from 'features/dataviews/dataviews.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import { parseTrackEventChunkProps } from 'features/timebar/timebar.utils'
import { parseUserTrackCallback } from './resources.utils'

export const useFetchDataviewResources = () => {
  const dataviewsResources = useSelector(selectDataviewsResources)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (dataviewsResources) {
      const { resources } = dataviewsResources
      resources.forEach((resource) => {
        dispatch(
          fetchResourceThunk({
            resource,
            resourceKey: resource.key,
            parseEventCb: parseTrackEventChunkProps,
            parseUserTrackCb: parseUserTrackCallback,
          })
        )
      })
    }
  }, [dispatch, dataviewsResources])
}
