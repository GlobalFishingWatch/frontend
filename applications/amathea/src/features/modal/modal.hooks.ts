import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { ModalTypes } from 'types'
import { selectModalOpen, setModalOpen } from 'features/app/app.slice'

export const useModalConnect = () => {
  const dispatch = useDispatch()
  const modal = useSelector(selectModalOpen)
  const showModal = useCallback(
    (modal: ModalTypes) => {
      dispatch(setModalOpen(modal))
    },
    [dispatch]
  )
  const hideModal = useCallback(() => {
    dispatch(setModalOpen(false))
  }, [dispatch])
  return { modal, showModal, hideModal }
}
