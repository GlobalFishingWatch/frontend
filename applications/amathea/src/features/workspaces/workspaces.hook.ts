import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { fetchWorkspacesThunk, deleteWorkspaceThunk, selectAll } from './workspaces.slice'

export const useWorkspacesConnect = () => {
  const dispatch = useDispatch()
  const workspacesList = useSelector(selectAll)
  const fetchWorkspaces = useCallback(() => {
    dispatch(fetchWorkspacesThunk())
  }, [dispatch])
  const deleteWorkspace = useCallback(
    (id: number) => {
      dispatch(deleteWorkspaceThunk(id))
    },
    [dispatch]
  )
  return { workspacesList, fetchWorkspaces, deleteWorkspace }
}
