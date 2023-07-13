import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  selectDataviewsResources,
  selectVesselProfileDataviewsResources,
} from 'features/dataviews/dataviews.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import { parseTrackEventChunkProps } from 'features/timebar/timebar.utils'
import { parseUserTrackCallback } from './resources.utils'

export const useFetchResources = (resources) => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (resources?.length) {
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
  }, [dispatch, resources])
}
export const useFetchDataviewResources = () => {
  const dataviewsResources = useSelector(selectDataviewsResources)
  useFetchResources(dataviewsResources?.resources)
}

export const useFetchVesselProfileDataviewResources = () => {
  const dataviewsResources = useSelector(selectVesselProfileDataviewsResources)
  useFetchResources(dataviewsResources?.resources)
}
