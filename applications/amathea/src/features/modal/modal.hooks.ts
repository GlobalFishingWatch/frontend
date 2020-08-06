import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { ModalTypes } from 'types'
import { selectModal } from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'

export const useModalConnect = () => {
  const modal = useSelector(selectModal)
  const { dispatchQueryParams } = useLocationConnect()
  const showModal = useCallback(
    (modal: ModalTypes) => {
      dispatchQueryParams({ modal })
    },
    [dispatchQueryParams]
  )
  const hideModal = useCallback(() => {
    dispatchQueryParams({ modal: undefined })
  }, [dispatchQueryParams])
  return { modal, showModal, hideModal }
}
