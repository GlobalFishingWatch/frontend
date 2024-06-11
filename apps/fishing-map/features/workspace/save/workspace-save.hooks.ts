import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectCreateWorkspaceModalOpen,
  selectEditWorkspaceModalOpen,
  setModalOpen,
} from 'features/modals/modals.slice'

export const useSaveWorkspaceModalConnect = (id: 'editWorkspace' | 'createWorkspace') => {
  const dispatch = useAppDispatch()
  const editWorkspaceModalOpen = useSelector(selectEditWorkspaceModalOpen)
  const createWorkspaceModalOpen = useSelector(selectCreateWorkspaceModalOpen)

  const dispatchWorkspaceModalOpen = useCallback(
    (open: boolean) => {
      dispatch(setModalOpen({ id, open }))
    },
    [dispatch, id]
  )

  return {
    workspaceModalOpen:
      id === 'editWorkspace'
        ? editWorkspaceModalOpen
        : id === 'createWorkspace'
        ? createWorkspaceModalOpen
        : false,
    dispatchWorkspaceModalOpen,
  }
}
