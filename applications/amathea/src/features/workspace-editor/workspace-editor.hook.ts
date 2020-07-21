import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { fetchWorkspaceByIdThunk, selectWorkspace } from './workspace-editor.slice'

export const useWorkspaceEditorConnect = () => {
  const dispatch = useDispatch()
  const workspace = useSelector(selectWorkspace)
  const fetchWorkspaceById = useCallback(
    (id: number) => {
      dispatch(fetchWorkspaceByIdThunk(id))
    },
    [dispatch]
  )
  return { workspace, fetchWorkspaceById }
}
