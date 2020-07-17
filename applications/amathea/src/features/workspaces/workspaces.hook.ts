import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { selectWorkspacesList, fetchWorkspaces } from './workspaces.slice'

export const useWorkspacesConnect = () => {
  const dispatch = useDispatch()
  const workspacesList = useSelector(selectWorkspacesList)
  const fetchList = useCallback(() => {
    dispatch(fetchWorkspaces())
  }, [dispatch])
  return { workspacesList, fetchList }
}
