import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { ModalTypes } from 'types'
import { selectCurrentLocation } from 'routes/routes.selectors'
import { updateQueryParams } from 'routes/routes.actions'

export const useModalConnect = () => {
  const dispatch = useDispatch()
  const location = useSelector(selectCurrentLocation)
  const showModal = useCallback(
    (modal: ModalTypes) => {
      dispatch(updateQueryParams(location.type, { modal: modal }))
    },
    [dispatch, location.type]
  )
  const hideModal = useCallback(() => {
    dispatch(updateQueryParams(location.type, { modal: undefined }))
  }, [dispatch, location.type])
  return { showModal, hideModal }
}
