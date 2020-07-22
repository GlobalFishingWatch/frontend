import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import {
  fetchWorkspaceByIdThunk,
  selectCurrentWorkspace,
} from 'features/workspaces/workspaces.slice'

export const useWorkspaceEditorConnect = () => {
  const dispatch = useDispatch()
  const workspace = useSelector(selectCurrentWorkspace)
  const fetchWorkspaceById = useCallback(
    (id: number) => {
      dispatch(fetchWorkspaceByIdThunk(id))
    },
    [dispatch]
  )
  return { workspace, fetchWorkspaceById }
}
