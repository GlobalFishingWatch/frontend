import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { QueryParams } from 'types'
import { selectCurrentLocation, selectLocationPayload } from 'routes/routes.selectors'
import { ROUTE_TYPES } from './routes'
import { updateLocation } from './routes.actions'

export const useLocationConnect = () => {
  const dispatch = useDispatch()
  const location = useSelector(selectCurrentLocation)
  const payload = useSelector(selectLocationPayload)

  const dispatchLocation = useCallback(
    (type: ROUTE_TYPES, customPayload: Record<string, any> = {}, replaceQuery = false) => {
      dispatch(updateLocation(type, { payload: { ...payload, ...customPayload }, replaceQuery }))
    },
    [dispatch, payload]
  )

  const dispatchQueryParams = useCallback(
    (query: QueryParams, replaceQuery = false) => {
      dispatch(updateLocation(location.type, { query, payload, replaceQuery }))
    },
    [dispatch, location.type, payload]
  )

  return { location, payload, dispatchLocation, dispatchQueryParams }
}
