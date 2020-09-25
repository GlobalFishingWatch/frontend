import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { QueryParams } from 'types'
import { selectCurrentLocation, selectLocationPayload } from 'routes/routes.selectors'
import { ROUTE_TYPES } from './routes'
import { updateQueryParams } from './routes.actions'

export const useLocationConnect = () => {
  const dispatch = useDispatch()
  const location = useSelector(selectCurrentLocation)
  const payload = useSelector(selectLocationPayload)
  const dispatchLocation = useCallback(
    (type: ROUTE_TYPES, customPayload: any = payload) => {
      dispatch({ type, payload: customPayload })
    },
    [dispatch, payload]
  )
  const dispatchQueryParams = useCallback(
    (query: QueryParams) => {
      dispatch(updateQueryParams(location.type, { query, payload }))
    },
    [dispatch, location.type, payload]
  )
  return { location, payload, dispatchLocation, dispatchQueryParams }
}
