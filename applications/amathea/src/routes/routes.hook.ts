import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { QueryParams } from 'types'
import { selectCurrentLocation } from 'routes/routes.selectors'
import { ROUTE_TYPES } from './routes'
import { updateQueryParams } from './routes.actions'

export const useLocationConnect = () => {
  const dispatch = useDispatch()
  const location = useSelector(selectCurrentLocation)
  const dispatchLocation = useCallback(
    (type: ROUTE_TYPES) => {
      dispatch({ type })
    },
    [dispatch]
  )
  const dispatchQueryParams = useCallback(
    (query: QueryParams) => {
      dispatch(updateQueryParams(location.type, query))
    },
    [dispatch, location.type]
  )
  return { location, dispatchLocation, dispatchQueryParams }
}
